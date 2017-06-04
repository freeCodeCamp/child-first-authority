import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../common/data-table/DataTable';
import { List } from 'immutable';
import RaisedButtonModel from '../../../../models/RaisedButtonModel';

const AtRiskTab = ({atRisk, ...props}) => {
  const page = {
    title   : 'At Risk Students',
    columns : [{
      title    : 'Last Name',
      id       : 'student.lastName',
      width    : 125,
      flexGrow : 1,
      fixed    : true
    }, {
      title    : 'First Name',
      id       : 'student.firstName',
      width    : 125,
      flexGrow : 1
    }, {
      title    : 'School',
      id       : 'school.name',
      width    : 125,
      flexGrow : 1
    }, {
      title    : 'Student ID',
      id       : 'student.studentId',
      width    : 90,
      flexGrow : 1
    }, {
      title    : 'Grade',
      id       : '',
      width    : 60,
      flexGrow : 1
    }, {
      title    : 'Absences',
      id       : 'entry.absences',
      width    : 100,
      flexGrow : 1
    }, {
      title    : 'Δ',
      id       : 'entry.absencesDelta',
      width    : 50,
      flexGrow : 1
    }, {
      title    : 'Tardies',
      id       : 'entry.tardies',
      width    : 100,
      flexGrow : 1
    }, {
      title    : 'Δ',
      id       : 'entry.tardiesDelta',
      width    : 50,
      flexGrow : 1
    }, {
      title    : 'Present',
      id       : 'entry.present',
      width    : 75,
      flexGrow : 1
    }, {
      title    : 'Enrolled',
      id       : 'entry.enrolled',
      width    : 75,
      flexGrow : 1
    }, {
      title    : 'IEP',
      id       : 'student.iep',
      width    : 50,
      flexGrow : 1
    }, {
      title    : 'CFA',
      id       : 'student.cfa',
      width    : 50,
      flexGrow : 1
    }, {
      title    : 'Updated',
      id       : '',
      width    : 75,
      flexGrow : 1
    }],
    buttons : [
      new RaisedButtonModel({
        label    : 'Show Student',
        actionID : 'showStudentPage'
      })
    ]
  };

  return (
    <DataTable
      page={page}
      data={atRisk}
      {...props}
    />
  );
};

AtRiskTab.propTypes = {
  view   : PropTypes.object.isRequired,
  atRisk : PropTypes.instanceOf(List).isRequired,
};

export default AtRiskTab;
