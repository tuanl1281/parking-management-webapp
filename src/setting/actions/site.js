import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';
import types from 'setting/actions/types';

const selectSite = (payload) => ({ type: types.SELECTED_SITE, payload });

const getSitesRequest = () => ({ type: types.GET_SITES_REQUEST });
const getSitesSuccess = (response) => ({
  type: types.GET_SITES_SUCCESS,
  payload: response,
});
const getSitesFailure = (error) => ({ type: types.GET_SITES_FAILURE, payload: error });

const getSites = ({
  pageIndex = undefined,
  pageSize = undefined,
  ...params
}) =>
(dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getSitesRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.site.get(),
        params: {
          ...params,
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getSitesSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getSitesFailure(error));
        reject(error);
      });
  });

const getSiteRequest = () => ({ type: types.GET_SITE_REQUEST });
const getSiteSuccess = (response) => ({
  type: types.GET_SITE_SUCCESS,
  payload: response,
});
const getSiteFailure = (error) => ({ type: types.GET_SITE_FAILURE, payload: error });

const getSite = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getSiteRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.site.get(id),
      })
      .then((response) => {
        dispatch(getSiteSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getSiteFailure(error));
        reject(error);
      });
  });

const getCameraOfSiteRequest = () => ({ type: types.GET_CAMERA_OF_SITE_REQUEST });
const getCameraOfSiteSuccess = (response) => ({
  type: types.GET_CAMERA_OF_SITE_SUCCESS,
  payload: response,
});
const getCameraOfSiteFailure = (error) => ({ type: types.GET_CAMERA_OF_SITE_FAILURE, payload: error });

const getCameraOfSite = (id, params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getCameraOfSiteRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.site.getCamera(id),
        params,
      })
      .then((response) => {
        dispatch(getCameraOfSiteSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getCameraOfSiteFailure(error));
        reject(error);
      });
  });

const createSiteRequest = () => ({ type: types.CREATE_SITE_REQUEST });
const createSiteSuccess = (response) => ({
  type: types.CREATE_SITE_SUCCESS,
  payload: response,
});
const createSiteFailure = (error) => ({
  type: types.CREATE_SITE_FAILURE,
  payload: error,
});

const createSite = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createSiteRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.site.create,
        data,
      })
      .then((response) => {
        dispatch(createSiteSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(createSiteFailure(error));
        reject(error);
      });
  });

const updateSiteRequest = () => ({ type: types.UPDATE_SITE_REQUEST });
const updateSiteSuccess = (response) => ({
  type: types.UPDATE_SITE_SUCCESS,
  payload: response,
});
const updateSiteFailure = (error) => ({
  type: types.UPDATE_SITE_FAILURE,
  payload: error,
});

const updateSite = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateSiteRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.site.update(data?.id),
        data,
      })
      .then((response) => {
        dispatch(updateSiteSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(updateSiteFailure(response.data));
        reject(response.data);
      });
  });

const deleteSiteRequest = () => ({ type: types.DELETE_SITE_REQUEST });
const deleteSiteSuccess = (response) => ({
  type: types.DELETE_SITE_SUCCESS,
  payload: response,
});
const deleteSiteFailure = (error) => ({
  type: types.DELETE_SITE_FAILURE,
  payload: error,
});

const deleteSite = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteSiteRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.site.delete(id),
      })
      .then((response) => {
        dispatch(deleteSiteSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(deleteSiteFailure(response.data));
        reject(response.data);
      });
  });

const addCameraToSiteRequest = () => ({ type: types.ADD_CAMERA_TO_SITE_REQUEST });
const addCameraToSiteSuccess = (response) => ({
  type: types.ADD_CAMERA_TO_SITE_SUCCESS,
  payload: response,
});
const addCameraToSiteFailure = (error) => ({ type: types.ADD_CAMERA_TO_SITE_FAILURE, payload: error });

const addCameraToSite = (id, data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(addCameraToSiteRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.site.addCamera(id),
        data,
      })
      .then((response) => {
        dispatch(addCameraToSiteSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(addCameraToSiteFailure(error));
        reject(error);
      });
  });

const removeCameraOfSiteRequest = () => ({ type: types.REMOVE_CAMERA_OF_SITE_REQUEST });
const removeCameraOfSiteSuccess = (response) => ({
  type: types.REMOVE_CAMERA_OF_SITE_SUCCESS,
  payload: response,
});
const removeCameraOfSiteFailure = (error) => ({ type: types.REMOVE_CAMERA_OF_SITE_FAILURE, payload: error });

const removeCameraOfSite = (id, data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(removeCameraOfSiteRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.site.removeCamera(id),
        data,
      })
      .then((response) => {
        dispatch(removeCameraOfSiteSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(removeCameraOfSiteFailure(error));
        reject(error);
      });
  });

export {
  selectSite,
  getSites,
  getSite,
  getCameraOfSite,
  createSite,
  updateSite,
  deleteSite,
  addCameraToSite,
  removeCameraOfSite,
};
