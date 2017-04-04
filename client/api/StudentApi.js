/**
 * Description of the routes associated with the student api
 *
 * /api/students
 *
 * GET /
 * GET /outreach-counts
 * GET /intervention-summary
 * GET /outreach-summary
 * GET /:studentId
 * PUT /:studentId/iep
 * PUT /:studentId/cfa
 * PUT /:studentId/withdrawn
 * PUT /:field **NEEDS TO UPDATE INTERVENTION TYPES**
 *
 * /api/students/:studentId/interventions
 *
 * GET /
 * POST /
 * PUT /:interventionId/archived
 * DELETE /:interventionId
 * POST /:interventionId/note
 *
 * /api/students/:studentId/notes
 *
 * GET /
 * GET /:noteId
 * POST /
 * PUT /:noteId
 * DELETE /:noteId
 *
 * /api/students/:studentId/outreaches
 *
 * GET /
 * POST /:outreachId/note
 * PUT /:outreachId/action
 *
 */
import Api from './Api';

class StudentApi extends Api {
  /**
  * Get outreach counts
  */
  static getOutreachCounts() {
    return this.getAPI('/api/student/outreach-counts');
  }

  /**
  * Get intervention summary
  */
  static getInterventionSummary() {
    return this.getAPI('/api/student/intervention-summary');
  }

  /**
  * Get outreach summary
  */
  static getOutreachSummary() {
    return this.getAPI('/api/student/outreach-summary');
  }

  /**
   * Fetch a student from the database
   */
  static getStudent(studentId) {
    return this.getAPI(`/api/students/${studentId}`);
  }

  /**
   * Get the absence records for a specific student
   */
  static getStudentRecords(studentId) {
    return this.getAPI(`/api/absence-records/students/${studentId}`);
  }

  /**
   * Get interventions for a student from the student id
   */
  static getStudentInterventions(studentId) {
    return this.getAPI(`/api/student/${studentId}/interventions`);
  }

  /**
   * Get outreaches for a student from the student id
   */
  static getStudentOutreaches(studentId) {
    return this.getAPI(`/api/student/${studentId}/outreaches`);
  }

  /**
   * Get notes for a student from the student id
   */
  static getStudentNotes(studentId) {
    return this.getAPI(`/api/student/${studentId}/notes`);
  }

  /**
   * Change iep status of student
   */
  static putStudentIep(studentId, iep) {
    return this.putAPI(`/api/students/${studentId}/iep`, iep);
  }

  /**
   * Change cfa status of student
   */
  static putStudentCfa(studentId, cfa) {
    return this.putAPI(`/api/students/${studentId}/cfa`, cfa);
  }

  /**
   * Change withdrawn status of student
   */
  static putStudentWithdrawn(studentId, withdrawn) {
    return this.putAPI(`/api/students/${studentId}/withdrawn`, withdrawn);
  }

}


export default StudentApi;
