import httpClient from 'app/utils/http-client';

import types from 'app/actions/types';
import apiLinks from 'app/utils/api-links';

const getFilesRequest = () => ({ type: types.GET_FILES_REQUEST });
const getFilesSuccess = (response) => ({
  type: types.GET_FILES_SUCCESS,
  payload: response,
});
const getFilesFailure = (error) => ({
  type: types.GET_FILES_FAILURE,
  payload: error,
});

const getFiles =
  ({ keyword, pageIndex = 0, pageSize = 10 }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getFilesRequest());
      httpClient
        .callApi({
          method: 'GET',
          url: apiLinks.file.get,
          params: {
            keyword,
            pageIndex,
            pageSize,
          },
        })
        .then((response) => {
          dispatch(getFilesSuccess(response.data));
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(getFilesFailure(error));
          reject(error);
        });
    });

const getFileRequest = () => ({ type: types.GET_FILE_REQUEST });
const getFileSuccess = (response) => ({
  type: types.GET_FILE_SUCCESS,
  payload: response,
});
const getFileFailure = (error) => ({
  type: types.GET_FILE_FAILURE,
  payload: error,
});

const getFile = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getFileRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: `${apiLinks.file.get}/${id}`,
      })
      .then(({ data }) => {
        dispatch(getFileSuccess(data?.data ?? {}));
        resolve(data?.data ?? {});
      })
      .catch((error) => {
        dispatch(getFileFailure(error));
        reject(error);
      });
  });

const createFileRequest = () => ({ type: types.CREATE_FILE_REQUEST });
const createFileSuccess = (response) => ({
  type: types.CREATE_FILE_SUCCESS,
  payload: response,
});
const createFileFailure = (error) => ({
  type: types.CREATE_FILE_FAILURE,
  payload: error,
});

const createFile = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createFileRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.file.create,
        data,
      })
      .then((response) => {
        dispatch(createFileSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(createFileFailure(response.data));
        reject(response.data);
      });
  });

const updateFileRequest = () => ({ type: types.UPDATE_FILE_REQUEST });
const updateFileSuccess = (response) => ({
  type: types.UPDATE_FILE_SUCCESS,
  payload: response,
});
const updateFileFailure = (error) => ({
  type: types.UPDATE_FILE_FAILURE,
  payload: error,
});

const updateFile = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateFileRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: `${apiLinks.file.update}/${data?.id}`,
        data,
      })
      .then((response) => {
        dispatch(updateFileSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(updateFileFailure(response.data));
        reject(response.data);
      });
  });

const deleteFileRequest = () => ({ type: types.DELETE_FILE_REQUEST });
const deleteFileSuccess = (response) => ({
  type: types.DELETE_FILE_SUCCESS,
  payload: response,
});
const deleteFileFailure = (error) => ({
  type: types.DELETE_FILE_FAILURE,
  payload: error,
});

const deleteFile = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteFileRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: `${apiLinks.file.delete}/${id}`,
      })
      .then((response) => {
        dispatch(deleteFileSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(deleteFileFailure(response.data));
        reject(response.data);
      });
  });

export {
  getFiles,
  getFile,
  createFile,
  updateFile,
  deleteFile,
};
