import { List, fromJS } from 'immutable';

import AbsenceRecordsApi from '../api/absence-records';
import AbsenceRecordListModel from '../models/absence-record-list';

//ACTIONS
const CHANGE_TAB = 'CHANGE_TAB';
const FETCH_CURRENT_RECORD_SUCCESS = 'FETCH_CURRENT_RECORD_SUCCESS';
const ADD_RECORD_SUCCESS = 'ADD_RECORD_SUCCESS';
const REMOVE_RECORD_SUCCESS = 'REMOVE_RECORD_SUCCESS';
const LOAD_ABSENCE_RECORD_LIST_SUCCESS = 'LOAD_ABSENCE_RECORD_LIST_SUCCESS';

//REDUCER
const initialState = {
  view : {
    currentTab : 'upload'
  },
  current : []
};
export default function recordsReducer(state = initialState, action) {
  switch (action.type) {
  case CHANGE_TAB: {
    return {
      ...state,
      view : {
        currentTab : action.currentTab
      }
    };
  }
  case FETCH_CURRENT_RECORD_SUCCESS: {
    let current = action.current;
    return {
      ...state,
      current
    };
  }

  case LOAD_ABSENCE_RECORD_LIST_SUCCESS:
    return {
      ...state,
      [action.schoolId] : fromJS(action.recordList)
        .map(recordList => new AbsenceRecordListModel(recordList))
    };

  case ADD_RECORD_SUCCESS: {
    return {...state};
  }
  case REMOVE_RECORD_SUCCESS: {
    return {...state};
  }
  default: {
    return state;
  }
  }
}

//ACTION CREATORS
export function changeTab(tab) {
  return {
    type       : CHANGE_TAB,
    currentTab : tab
  };
}

export function fetchRecords() {
  return dispatch => AbsenceRecordsApi.fetchRecords()
    .then(current => dispatch({
      type : FETCH_CURRENT_RECORD_SUCCESS,
      current
    }));
}

/**
 * Get list of absence records for the most recent
 *   - untested
 */
export function fetchSchoolRecordList(schoolId) {
  return function(dispatch) {
    return AbsenceRecordsApi.fetchSchoolRecordList(schoolId).then(recordList =>
      dispatch({
        type : LOAD_ABSENCE_RECORD_LIST_SUCCESS,
        schoolId,
        recordList
      })
    )
    .catch(err => handleError(err, dispatch));
  };
}

// export function addRecord(record) {
//   return dispatch => AbsenceRecordsApi.addRecord(record)
//     .then(response => {
//       dispatch({
//         type : ADD_RECORD_SUCCESS
//       });
//       dispatch({
//         type      : 'OPEN_SNACKBAR',
//         message   : `Record created for ${response.record.school.name} with ${response.outreaches.length} outreaches.`,
//         snackType : 'success'
//       });
//     })
//     .catch(err => dispatch({
//       type      : 'OPEN_SNACKBAR',
//       message   : `Error: ${err}`,
//       snackType : 'error'
//     }));
// }
//
// export function removeRecord(record) {
//   return dispatch => AbsenceRecordsApi.removeRecord(record)
//     .then(() => {
//       dispatch({
//         type : REMOVE_RECORD_SUCCESS
//       });
//       dispatch({
//         type    : 'OPEN_SNACKBAR',
//         message : 'Record deleted.',
//         type    : 'success'
//       });
//     });
// }
