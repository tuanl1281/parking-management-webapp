import httpClient from 'app/utils/http-client';

import types from 'app/actions/types';
import { formatToDate } from 'app/utils/helpers';

const showConfirmModal = (message, confirmCallback) => ({
  type: types.SHOW_CONFIRM_MODAL,
  payload: { message, confirmCallback },
});

const showInfoModal = (header, content, infoCallback) => ({
  type: types.SHOW_INFO_MODAL,
  payload: { header, content, infoCallback },
});

const showErrorModal = (header, successList, failLogs) => ({
  type: types.SHOW_ERROR_MODAL,
  payload: { header, successList, failLogs },
});

const showForwardModal = (message, confirmCallback) => ({
  type: types.SHOW_FORWARD_MODAL,
  payload: { message, confirmCallback },
});

const showUploadModal = (header, content, uploadCallback) => ({
  type: types.SHOW_UPLOAD_MODAL,
  payload: { header, content, uploadCallback },
});

const uploadRequest = () => ({
  type: types.UPLOAD_REQUEST,
});
const uploadSuccess = (response) => ({
  type: types.UPLOAD_SUCCESS,
  payload: response,
});
const uploadFailure = (error) => ({
  type: types.UPLOAD_FAILURE,
  payload: error,
});
const uploadFile =
  ({ method = 'PUT', url, formData, params }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(uploadRequest());
      httpClient
        .callApi({
          method,
          contentType: 'application/x-www-form-urlencoded',
          url,
          data: formData,
          params,
        })
        .then((response) => {
          dispatch(uploadSuccess(response.data));
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(uploadFailure(error));
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(error?.response?.data);
        });
    });

const downloadFileRequest = () => ({
  type: types.DOWNLOAD_REQUEST,
});
const downloadFileSuccess = (response) => ({
  type: types.DOWNLOAD_SUCCESS,
  payload: response,
});
const downloadFileFailure = (error) => ({
  type: types.DOWNLOAD_FAILURE,
  payload: error,
});
const downloadFile =
  ({ method = 'GET', responseType = 'blob', url, data, params, fileName }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(downloadFileRequest());
      httpClient
        .callApi({
          method,
          responseType,
          url,
          data,
          params,
        })
        .then((response) => {
          dispatch(downloadFileSuccess(response.data));
          const tempUrl = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = tempUrl;
          link.setAttribute('download', `${fileName || formatToDate(new Date())}.xlsx`);
          document.body.appendChild(link);
          link.click();

          resolve(response.data);
        })
        .catch((error) => {
          dispatch(downloadFileFailure(error));
          reject();
        });
    });

export {
  showConfirmModal,
  showInfoModal,
  showForwardModal,
  showErrorModal,
  showUploadModal,
  uploadFile,
  downloadFile,
};
