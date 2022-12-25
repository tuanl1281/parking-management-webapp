import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';
import types from 'setting/actions/types';

const getCamerasRequest = () => ({ type: types.GET_CAMERAS_REQUEST });
const getCamerasSuccess = (response) => ({
  type: types.GET_CAMERAS_SUCCESS,
  payload: response,
});
const getCamerasFailure = (error) => ({ type: types.GET_CAMERAS_FAILURE, payload: error });

const getCameras = ({
  pageIndex = undefined,
  pageSize = undefined,
  ...params
}) =>
(dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getCamerasRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.camera.get(),
        params: {
          ...params,
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getCamerasSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getCamerasFailure(error));
        reject(error);
      });
  });

const getCameraRequest = () => ({ type: types.GET_CAMERA_REQUEST });
const getCameraSuccess = (response) => ({
  type: types.GET_CAMERA_SUCCESS,
  payload: response,
});
const getCameraFailure = (error) => ({ type: types.GET_CAMERA_FAILURE, payload: error });

const getCamera = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getCameraRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.camera.get(id),
      })
      .then((response) => {
        dispatch(getCameraSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getCameraFailure(error));
        reject(error);
      });
  });

  const createCameraRequest = () => ({ type: types.CREATE_CAMERA_REQUEST });
const createCameraSuccess = (response) => ({
  type: types.CREATE_CAMERA_SUCCESS,
  payload: response,
});
const createCameraFailure = (error) => ({
  type: types.CREATE_CAMERA_FAILURE,
  payload: error,
});

const createCamera = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createCameraRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.camera.create,
        data,
      })
      .then((response) => {
        dispatch(createCameraSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(createCameraFailure(error));
        reject(error);
      });
  });

const updateCameraRequest = () => ({ type: types.UPDATE_CAMERA_REQUEST });
const updateCameraSuccess = (response) => ({
  type: types.UPDATE_CAMERA_SUCCESS,
  payload: response,
});
const updateCameraFailure = (error) => ({
  type: types.UPDATE_CAMERA_FAILURE,
  payload: error,
});

const updateCamera = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateCameraRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.camera.update(data?.id),
        data,
      })
      .then((response) => {
        dispatch(updateCameraSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(updateCameraFailure(response.data));
        reject(response.data);
      });
  });

const deleteCameraRequest = () => ({ type: types.DELETE_CAMERA_REQUEST });
const deleteCameraSuccess = (response) => ({
  type: types.DELETE_CAMERA_SUCCESS,
  payload: response,
});
const deleteCameraFailure = (error) => ({
  type: types.DELETE_CAMERA_FAILURE,
  payload: error,
});

const deleteCamera = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteCameraRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.camera.delete(id),
      })
      .then((response) => {
        dispatch(deleteCameraSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(deleteCameraFailure(response.data));
        reject(response.data);
      });
  });

export {
  getCameras,
  getCamera,
  createCamera,
  updateCamera,
  deleteCamera,
};
