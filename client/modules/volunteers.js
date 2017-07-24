import VolunteerApi from '../api/volunteers.js';
import {openSnackbar} from './view';

const GET_VOLUNTEERS_SUCCESS = 'GET_VOLUNTEERS_SUCCESS';
const POST_VOLUNTEER_SUCCESS = 'POST_VOLUNTEER_SUCCESS';
const PUT_VOLUNTEER_SUCCESS = 'PUT_VOLUNTEER_SUCCESS';
const DELETE_VOLUNTEER_SUCCESS = 'DELETE_VOLUNTEER_SUCCESS';

const initialState = {
  volunteers : []
};
export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
  case GET_VOLUNTEERS_SUCCESS: {
    return {
      ...state,
      volunteers : action.volunteers
    };
  }
  case POST_VOLUNTEER_SUCCESS: {
    const {volunteer} = action;
    console.log(volunteer);
    return {
      ...state,
      volunteers : [...state.volunteers, action.volunteer]
    };
  }
  case PUT_VOLUNTEER_SUCCESS: {
    return {...state};
  }

  case DELETE_VOLUNTEER_SUCCESS: {
    return {...state};
  }
  default: return state;
  }
}

export function getVolunteers(schoolId) {
  return dispatch => VolunteerApi.getVolunteers(schoolId)
    .then(volunteers => dispatch({
      type : GET_VOLUNTEERS_SUCCESS,
      volunteers
    }));
}

export function postVolunteer(schoolId, volunteer) {
  return dispatch => VolunteerApi.postVolunteer(schoolId, volunteer)
    .then(res => {
      dispatch(getVolunteers(schoolId));
      dispatch(openSnackbar(`Volunteer ${res.firstName} ${res.lastName} added to ${res.school}`));
    });
}
