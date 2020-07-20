import axios from 'axios'

const SERVER_URL = process.env.VUE_APP_SERVER_ADD;

const server = axios.create({
  baseURL: SERVER_URL,
  timeout: 2000
});

function getTokenHeader() {
  return {
    headers: {'Token': sessionStorage.getItem("token"), "Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
    withCredentials: true
  }
}

function getExtendedTokenHeader(extendedHeaders) {
  let header = {
    headers: {'Token': sessionStorage.getItem("token"), "Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
    withCredentials: true
  };
  header.assign(extendedHeaders);
  return header;
}

export default {
  login: (loginData) => server.post('/login', loginData),
  register: (userData) => server.post('/profiles', userData),
  getActivityTypes: () => server.get('/activity-types', getTokenHeader()),
  editProfile: (userData, profileId) => server.put(`profiles/${profileId}`, userData, getTokenHeader()),
  getUserData: (profileId) => server.get(`/profiles/${profileId}`, getTokenHeader()),
  checkProfile: (profileId) => server.get(`/check-profile/`.concat(profileId), getTokenHeader()),
  getUserEmails: (profileId) => server.get(`/profiles/${profileId}/emails`, getTokenHeader()),
  checkUserEmail: (insertedEmail) => server.get(`/email`, getExtendedTokenHeader({'email': insertedEmail})),
  updateEmails: (emails, profileId) => server.post(`/profiles/${profileId}/emails`, emails, getTokenHeader()),
  putEmails: (emails, profileId) => server.put(`/profiles/${profileId}/emails`, emails, getTokenHeader()),
  logout: () => server.post('/logout', null, getTokenHeader()),
  updatePassword: (userId, oldPass, newPass, repeatPass) => server.put(`/profiles/${userId}/password`,
    {'old_password': oldPass, 'new_password': newPass, 'repeat_password': repeatPass}, getTokenHeader()),
  getAllUserData: () => server.get('/profiles', getTokenHeader()),
  getUserActivities: (profileId) => server.get(`/profiles/${profileId}/activities`, getTokenHeader()),
  getUserId: () => server.get(`/profiles/userId`, getTokenHeader()),
  deleteActivity: (activityId) => server.delete(`/activities/${activityId}`, getTokenHeader()),
  createActivity: (activityData, profileId) => server.post(`/profiles/${profileId}/activities`, activityData, getTokenHeader()),
  updateActivity: (activityData, profileId, activityId) => server.put(`/profiles/${profileId}/activities/${activityId}`, activityData, getTokenHeader()),
  getActivityData: (activityId) => server.get(`/activities/${activityId}`, getTokenHeader()),
  getUserRoles: (userId) => server.get(`/profiles/${userId}/role`, getTokenHeader())
}
