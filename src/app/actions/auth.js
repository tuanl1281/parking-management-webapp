import axios from 'axios';
import types from 'app/actions/types';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

const setToken = (token, tokenExpiredTime, userInfo) => ({
  type: types.SET_TOKEN,
  payload: {
    token,
    tokenExpiredTime,
    userInfo,
  },
});

const checkCredential = (token) =>
  new Promise((resolve, reject) => {
    const headerToken = token ? { Authorization: `bearer ${token}` } : null;
    axios({
      url: apiLinks.checkCredential,
      headers: { ...headerToken },
    })
      .then(resolve)
      .catch(reject);
  });

const loginRequest = () => ({ type: types.LOG_IN_REQUEST });
const loginSuccess = (response) => ({
  type: types.LOG_IN_SUCCESS,
  payload: response,
});
const loginFailure = (error) => ({ type: types.LOG_IN_FAILURE, payload: error });

const login = (username, password) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(loginRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.login,
        data: { username, password },
      })
      .then((response) => {
        dispatch(loginSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(loginFailure(error));
        reject(error);
      });
  });

const getUserInfoRequest = () => ({ type: types.GET_USER_INFO_REQUEST });
const getUserInfoSuccess = (response) => ({
  type: types.GET_USER_INFO_SUCCESS,
  payload: response,
});
const getUserInfoFailure = (error) => ({
  type: types.GET_USER_INFO_FAILURE,
  payload: error,
});

const getUserInfo = (token) => (dispatch) =>
  new Promise((resolve, reject) => {
    const headerToken = token ? { Authorization: `bearer ${token}` } : null;
    dispatch(getUserInfoRequest());
    axios({
      url: apiLinks.userInfo,
      headers: { ...headerToken },
    })
      .then(({ data: { data } }) => {
        dispatch(getUserInfoSuccess(data));
        resolve(data);
      })
      .catch(({ response }) => {
        dispatch(getUserInfoFailure(response));
        reject(response);
      });
  });

const getPermissionRequest = () => ({ type: types.GET_PERMISSION_OF_USER_INFO_REQUEST });
const getPermissionSuccess = (response) => ({
  type: types.GET_PERMISSION_OF_USER_INFO_SUCCESS,
  payload: response,
});
const getPermissionFailure = (error) => ({
  type: types.GET_PERMISSION_OF_USER_INFO_FAILURE,
  payload: error,
});

const getPermission = (token) => (dispatch) =>
  new Promise((resolve, reject) => {
    const headerToken = token ? { Authorization: `bearer ${token}` } : null;
    dispatch(getPermissionRequest());
    axios({
      url: apiLinks.getPermission,
      headers: { ...headerToken },
    })
      .then(({ data: { data } }) => {
        dispatch(getPermissionSuccess(data));
        resolve(data);
      })
      .catch(({ response }) => {
        dispatch(getPermissionFailure(response));
        reject(response);
      });
  });

const logout = () => ({ type: types.LOG_OUT });

export {
  setToken,
  checkCredential,
  login,
  logout,
  getUserInfo,
  getPermission,
};
