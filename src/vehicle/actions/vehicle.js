import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';
import types from 'vehicle/actions/types';

const selectVehicle = (payload) => ({ type: types.SELECTED_VEHICLE, payload });

const getVehiclesRequest = () => ({ type: types.GET_VEHICLES_REQUEST });
const getVehiclesSuccess = (response) => ({
  type: types.GET_VEHICLES_SUCCESS,
  payload: response,
});
const getVehiclesFailure = (error) => ({ type: types.GET_VEHICLES_FAILURE, payload: error });

const getVehicles = ({
  pageIndex = undefined,
  pageSize = undefined,
  ...params
}) =>
(dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getVehiclesRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.vehicle.get(),
        params: {
          ...params,
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getVehiclesSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getVehiclesFailure(error));
        reject(error);
      });
  });

const getVehicleRequest = () => ({ type: types.GET_VEHICLE_REQUEST });
const getVehicleSuccess = (response) => ({
  type: types.GET_VEHICLE_SUCCESS,
  payload: response,
});
const getVehicleFailure = (error) => ({ type: types.GET_VEHICLE_FAILURE, payload: error });

const getVehicle = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getVehicleRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.customer.get(id),
      })
      .then((response) => {
        dispatch(getVehicleSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getVehicleFailure(error));
        reject(error);
      });
  });

const getLogOfVehicleRequest = () => ({ type: types.GET_LOG_OF_VEHICLE_REQUEST });
const getLogOfVehicleSuccess = (response) => ({
  type: types.GET_LOG_OF_VEHICLE_SUCCESS,
  payload: response,
});
const getLogOfVehicleFailure = (error) => ({ type: types.GET_LOG_OF_VEHICLE_FAILURE, payload: error });

const getLogOfVehicle = (id, params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getLogOfVehicleRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.vehicle.getLog(id),
        params,
      })
      .then((response) => {
        dispatch(getLogOfVehicleSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getLogOfVehicleFailure(error));
        reject(error);
      });
  });

const createVehicleRequest = () => ({ type: types.CREATE_VEHICLE_REQUEST });
const createVehicleSuccess = (response) => ({
  type: types.CREATE_VEHICLE_SUCCESS,
  payload: response,
});
const createVehicleFailure = (error) => ({
  type: types.CREATE_VEHICLE_FAILURE,
  payload: error,
});

const createVehicle = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createVehicleRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.customer.create,
        data,
      })
      .then((response) => {
        dispatch(createVehicleSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(createVehicleFailure(error));
        reject(error);
      });
  });

const updateVehicleRequest = () => ({ type: types.UPDATE_VEHICLE_REQUEST });
const updateVehicleSuccess = (response) => ({
  type: types.UPDATE_VEHICLE_SUCCESS,
  payload: response,
});
const updateVehicleFailure = (error) => ({
  type: types.UPDATE_VEHICLE_FAILURE,
  payload: error,
});

const updateVehicle = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateVehicleRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.vehicle.update(data?.id),
        data,
      })
      .then((response) => {
        dispatch(updateVehicleSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(updateVehicleFailure(response.data));
        reject(response.data);
      });
  });

const deleteVehicleRequest = () => ({ type: types.DELETE_VEHICLE_REQUEST });
const deleteVehicleSuccess = (response) => ({
  type: types.DELETE_VEHICLE_SUCCESS,
  payload: response,
});
const deleteVehicleFailure = (error) => ({
  type: types.DELETE_VEHICLE_FAILURE,
  payload: error,
});

const deleteVehicle = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteVehicleRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.vehicle.delete(id),
      })
      .then((response) => {
        dispatch(deleteVehicleSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(deleteVehicleFailure(response.data));
        reject(response.data);
      });
  });

const addCustomerToVehicleRequest = () => ({ type: types.ADD_CUSOMTER_TO_VEHICLE_REQUEST });
const addCustomerToVehicleSuccess = (response) => ({
  type: types.ADD_CUSOMTER_TO_VEHICLE_SUCCESS,
  payload: response,
});
const addCustomerToVehicleFailure = (error) => ({ type: types.ADD_CUSOMTER_TO_VEHICLE_FAILURE, payload: error });

const addCustomerToVehicle = (id, customerId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(addCustomerToVehicleRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.vehicle.addVehicle(id, customerId),
      })
      .then((response) => {
        dispatch(addCustomerToVehicleSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(addCustomerToVehicleFailure(error));
        reject(error);
      });
  });

const removeCustomerOfVehicleRequest = () => ({ type: types.REMOVE_CUSTOMER_OF_VEHICLE_REQUEST });
const removeCustomerOfVehicleSuccess = (response) => ({
  type: types.REMOVE_CUSTOMER_OF_VEHICLE_SUCCESS,
  payload: response,
});
const removeCustomerOfVehicleFailure = (error) => ({ type: types.REMOVE_CUSTOMER_OF_VEHICLE_FAILURE, payload: error });

const removeVehicleOfCustomer = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(removeCustomerOfVehicleRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.vehicle.removeVehicle(id),
      })
      .then((response) => {
        dispatch(removeCustomerOfVehicleSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(removeCustomerOfVehicleFailure(error));
        reject(error);
      });
  });

export {
  selectVehicle,
  getVehicles,
  getVehicle,
  getLogOfVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  addCustomerToVehicle,
  removeVehicleOfCustomer,
};
