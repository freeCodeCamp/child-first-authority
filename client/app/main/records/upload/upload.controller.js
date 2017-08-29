'use strict';

function dateOnly(dateStr) {
  var date = new Date(dateStr);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function UploadCtrl($scope, PDF, AbsenceRecord, Auth, School, Student, toastr) {
  var needGradeField = [];
  var willUpdateGrade = {};
  // Formats of pdf based on school year
  $scope.formats = ['2015-2016', '2016-2017', '2017-2018'];
  // $scope.formats = ['2015-2016', '2015-2016, with grade level', '2016-2017', '2016-2017, with grade level'];

  function resetState() {
    delete $scope.pending;
    delete $scope.parsedRecord;
    delete $scope.error;

    $scope.maxDate = dateOnly(Date.now());
    $scope.progress = 0;
    $scope.studentGradeUpdates = [];
    $scope.selected = {
      school: $scope.defaultSchool,
      date: new Date(),
      format: '2016-2017, with grade level'
    };
    AbsenceRecord.current().$promise.then(function(records) {
      _.forEach(records, function(record) {
        needGradeField = record.entries.filter(function(entry) {
            return !entry.student.grade;
          });
        var minDate = dateOnly(record.date);
        minDate.setDate(minDate.getDate() + 1);
        record.minDate = minDate;
      });
      $scope.records = _.keyBy(records, '_id');
    });

  }

  if (Auth.getCurrentUser().role === 'teacher') {
    $scope.defaultSchool = Auth.getCurrentUser().assignment;
  } else {
    $scope.schools = School.query();
  }
  resetState();

  $scope.hasCurrentRecord = function() {
    var selectedRecordDate =
      ($scope.records[$scope.selected.school._id] || {}).date;
    return selectedRecordDate && $scope.maxDate <= dateOnly(selectedRecordDate);
  };

  $scope.cancelUpload = resetState;

  $scope.confirmUpload = function() {
    $scope.pending = true;
    $scope.parsedRecord.date = $scope.selected.date;

    //Student service called to updated student grade if they don't already
    // have a grade
    var studentIds = Object.keys(willUpdateGrade);
    Student.batchUpdate(studentIds, 'grade', willUpdateGrade).$promise
      .then(function(updated) {
        if(updated.length) {
          toastr.success(updated.length + ' students updated with grade data.',
          {timeOut: 5000});
        }
      });

    AbsenceRecord.save({
      controller: 'school',
      selector: $scope.parsedRecord.schoolId
    }, $scope.parsedRecord, function(res) {
      resetState();
      var schoolName = res.record.school.name;
      if (res.record.newMissingStudents.length) {
        toastr.error(
          res.record.newMissingStudents.length + ' students missing.',
          schoolName,
          {timeOut: 5000}
        );
      }
      if (res.outreaches.length) {
        toastr.info(
          res.outreaches.length + ' outreaches triggered.',
          schoolName,
          {timeOut: 5000}
        );
      }
      if (res.record.createdStudents.length) {
        toastr.success(
          res.record.createdStudents.length + ' new students added.',
          schoolName,
          {timeOut: 5000}
        );
      }
      toastr.success(
        'Absence record with ' + res.record.entries.length + ' entries added.',
        schoolName,
        {timeOut: 5000}
      );
    }, function(err) {
      resetState();
      console.log(err);
      toastr.error(err.data.error, {timeOut: 0, closeButton: true});
    });
  };

  // TODO: This controller is getting rather unwieldy. Some of this
  // logic should probably be moved to services to keep the controller thin.

  function groupByType(students, idKeys) {
    return _.groupBy(students, function(student) {
      return student.student.studentId in idKeys ? 'updates' : 'creates';
    });
  }

  function createOutreaches(entry, prevEntry, school, schoolYear) {
    if (!entry.absencesDelta) {
      return [];
    }
    var prevTotal = prevEntry.absences || 0;
    return _(school.triggers)
      .filter(function(trigger) {
        return trigger.absences > prevTotal &&
               trigger.absences <= entry.absences;
      })
      .map(function(trigger) {
        return {
          type: trigger.type,
          tier: trigger.tier,
          absences: trigger.absences,
          student: entry.student,
          school: school._id,
          schoolYear: schoolYear,
          withdrawn: !!(prevEntry.student || {}).withdrawn
        };
      })
      .value();
  }

  function handleSameSchoolYear(prevRecord, partialRecord, school) {
    var combinedEntries = _.concat(prevRecord.entries || [],
      prevRecord.missingEntries || []);

    var studentIdToPrevEntry = _.keyBy(combinedEntries, 'student.studentId');
    var record = groupByType(partialRecord.students, studentIdToPrevEntry);

    record.schoolYear = partialRecord.schoolYear;
    _.forEach(record.updates || [], function(update) {

      //check and see if the updated records need a grade updated
      if(update.student.studentId.indexOf(needGradeField)) {
        var studentId = studentIdToPrevEntry[update.student.studentId];
        willUpdateGrade[studentId.student._id] = +update.student.grade;
      }

      var entry = update.entry;
      var prevEntry = studentIdToPrevEntry[update.student.studentId];
      entry.student = prevEntry.student._id;
      // Updates use previous entry to calculate deltas.
      entry.tardiesDelta = entry.tardies - prevEntry.tardies;
      entry.absencesDelta = entry.absences - prevEntry.absences;
      entry.outreaches =
        createOutreaches(entry, prevEntry, school, record.schoolYear);
    });
    record.missingEntries =
      _.differenceBy(combinedEntries, partialRecord.students || [],
        'student.studentId');
    record.newMissingStudents = _(record.missingEntries || [])
      .differenceBy(prevRecord.missingEntries || [], 'student.studentId')
      .map('student._id')
      .value();
    _.forEach(record.missingEntries, function(missingEntry) {
      if (!missingEntry.date) {
        missingEntry.date = prevRecord.date;
      }
    });
    return record;
  }

  function handleNewSchoolYear(prevRecord, partialRecord, school) {
    var combinedEntries = _.concat(prevRecord.entries || [],
      prevRecord.missingEntries || []);
    var studentIdToId = _(combinedEntries)
      .keyBy('student.studentId')
      .mapValues('student._id')
      .value();

    var record = groupByType(partialRecord.students, studentIdToId);
    record.schoolYear = partialRecord.schoolYear;
    _.forEach(record.updates || [], function(update) {
      //check and see if the updated records need a grade updated
      if(update.student.studentId.indexOf(needGradeField)) {
        var studentId = studentIdToPrevEntry[update.student.studentId];
        willUpdateGrade[studentId.student._id] = +update.student.grade;
      }
      var entry = update.entry;
      entry.student = studentIdToId[update.student.studentId];
      // Updates deltas start over by setting to tardies and absences values.
      entry.tardiesDelta = entry.tardies;
      entry.absencesDelta = entry.absences;
      entry.outreaches = createOutreaches(entry, {}, school, record.schoolYear);
    });
    record.missingEntries = [];
    record.newMissingStudents = [];
    return record;
  }

  function completeRecord(partialRecord) {
    var school = $scope.selected.school;
    var previousRecord = $scope.records[school._id] || {};
    var record = (partialRecord.schoolYear === previousRecord.schoolYear) ?
                 handleSameSchoolYear(previousRecord, partialRecord, school) :
                 handleNewSchoolYear(previousRecord, partialRecord, school);
    _.forEach(record.creates || [], function(create) {
      var entry = create.entry;
      entry.tardiesDelta = entry.tardies;
      entry.absencesDelta = entry.absences;
      entry.outreaches = createOutreaches(entry, {}, school, record.schoolYear);
    });
    console.log('updates:', record.updates);
    record.schoolId = school._id;
    record.previousRecordId = previousRecord.recordId;
    return record;
  }

  $scope.$watch('selected.file', function(n, o) {
    if (n !== o) {
      delete $scope.parsedRecord;
      delete $scope.error;

      $scope.progress = 0;
      if (n) {
        var promise = PDF.parse(n, $scope.selected.format);
        promise.then(function(partialRecord) {
          //partialRecord is a giant array of the columns
          $scope.parsedRecord = completeRecord(partialRecord);
        }, function(err) {
          //TODO: Error handling
          $scope.error = err;
        }, function(progress) {
          $scope.progress = progress;
        });
      }
    }
  });
}

angular.module('app').controller('UploadCtrl', UploadCtrl);
