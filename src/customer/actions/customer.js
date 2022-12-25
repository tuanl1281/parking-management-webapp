import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';
import types from 'customer/actions/types';

const selectCustomer = (payload) => ({ type: types.SELECTED_CUSTOMER, payload });

const getCustomersRequest = () => ({ type: types.GET_CUSTOMERS_REQUEST });
const getCustomersSuccess = (response) => ({
  type: types.GET_CUSTOMERS_SUCCESS,
  payload: response,
});
const getCustomersFailure = (error) => ({ type: types.GET_CUSTOMERS_FAILURE, payload: error });

const getCustomers = ({
  pageIndex = undefined,
  pageSize = undefined,
  ...params
}) =>
(dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getCustomersRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.customer.get(),
        params: {
          ...params,
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getCustomersSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getCustomersFailure(error));
        reject(error);
      });
  });

const getCustomerRequest = () => ({ type: types.GET_CUSTOMER_REQUEST });
const getCustomerSuccess = (response) => ({
  type: types.GET_CUSTOMER_SUCCESS,
  payload: response,
});
const getCustomerFailure = (error) => ({ type: types.GET_CUSTOMER_FAILURE, payload: error });

const getCustomer = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getCustomerRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.customer.get(id),
      })
      .then((response) => {
        dispatch(getCustomerSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getCustomerFailure(error));
        reject(error);
      });
  });

const getVehicleOfCustomerRequest = () => ({ type: types.GET_VEHICLE_OF_CUSTOMER_REQUEST });
const getVehicleOfCustomerSuccess = (response) => ({
  type: types.GET_VEHICLE_OF_CUSTOMER_SUCCESS,
  payload: response,
});
const getVehicleOfCustomerFailure = (error) => ({ type: types.GET_VEHICLE_OF_CUSTOMER_FAILURE, payload: error });

const getVehicleOfCustomer = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getVehicleOfCustomerRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.customer.getVehicle(id),
      })
      .then((response) => {
        dispatch(getVehicleOfCustomerSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getVehicleOfCustomerFailure(error));
        reject(error);
      });
  });

const getTransactionOfCustomerRequest = () => ({ type: types.GET_TRANSACTION_OF_CUSTOMER_REQUEST });
const getTransactionOfCustomerSuccess = (response) => ({
  type: types.GET_TRANSACTION_OF_CUSTOMER_SUCCESS,
  payload: response,
});
const getTransactionOfCustomerFailure = (error) => ({ type: types.GET_TRANSACTION_OF_CUSTOMER_FAILURE, payload: error });

const getTransactionOfCustomer = (id, params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getTransactionOfCustomerRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.customer.getTransaction(id),
        params,
      })
      .then((response) => {
        dispatch(getTransactionOfCustomerSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getTransactionOfCustomerFailure(error));
        reject(error);
      });
  });

const createCustomerRequest = () => ({ type: types.CREATE_CUSTOMER_REQUEST });
const createCustomerSuccess = (response) => ({
  type: types.CREATE_CUSTOMER_SUCCESS,
  payload: response,
});
const createCustomerFailure = (error) => ({
  type: types.CREATE_CUSTOMER_FAILURE,
  payload: error,
});

const createCustomer = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createCustomerRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.customer.create,
        data,
      })
      .then((response) => {
        dispatch(createCustomerSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(createCustomerFailure(error));
        reject(error);
      });
  });

const updateCustomerRequest = () => ({ type: types.UPDATE_CUSTOMER_REQUEST });
const updateCustomerSuccess = (response) => ({
  type: types.UPDATE_CUSTOMER_SUCCESS,
  payload: response,
});
const updateCustomerFailure = (error) => ({
  type: types.UPDATE_CUSTOMER_FAILURE,
  payload: error,
});

const updateCustomer = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateCustomerRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.customer.update(data?.id),
        data,
      })
      .then((response) => {
        dispatch(updateCustomerSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(updateCustomerFailure(response.data));
        reject(response.data);
      });
  });

const deleteCustomerRequest = () => ({ type: types.DELETE_CUSTOMER_REQUEST });
const deleteCustomerSuccess = (response) => ({
  type: types.DELETE_CUSTOMER_SUCCESS,
  payload: response,
});
const deleteCustomerFailure = (error) => ({
  type: types.DELETE_CUSTOMER_FAILURE,
  payload: error,
});

const deleteCustomer = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteCustomerRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.customer.delete(id),
      })
      .then((response) => {
        dispatch(deleteCustomerSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(deleteCustomerFailure(response.data));
        reject(response.data);
      });
  });

const addVehicleToCustomerRequest = () => ({ type: types.ADD_VEHICLE_TO_CUSTOMER_REQUEST });
const addVehicleToCustomerSuccess = (response) => ({
  type: types.ADD_VEHICLE_TO_CUSTOMER_SUCCESS,
  payload: response,
});
const addVehicleToCustomerFailure = (error) => ({ type: types.ADD_VEHICLE_TO_CUSTOMER_FAILURE, payload: error });

const addVehicleToCustomer = (id, data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(addVehicleToCustomerRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.customer.addVehicle(id),
        data,
      })
      .then((response) => {
        dispatch(addVehicleToCustomerSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(addVehicleToCustomerFailure(error));
        reject(error);
      });
  });

const removeVehicleOfCustomerRequest = () => ({ type: types.REMOVE_VEHICLE_OF_CUSTOMER_REQUEST });
const removeVehicleOfCustomerSuccess = (response) => ({
  type: types.REMOVE_VEHICLE_OF_CUSTOMER_SUCCESS,
  payload: response,
});
const removeVehicleOfCustomerFailure = (error) => ({ type: types.REMOVE_VEHICLE_OF_CUSTOMER_FAILURE, payload: error });

const removeVehicleOfCustomer = (id, data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(removeVehicleOfCustomerRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.customer.removeVehicle(id),
        data,
      })
      .then((response) => {
        dispatch(removeVehicleOfCustomerSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(removeVehicleOfCustomerFailure(error));
        reject(error);
      });
  });

const depositCustomerRequest = () => ({ type: types.DEPOSIT_CUSTOMER_REQUEST });
const depositCustomerSuccess = (response) => ({
  type: types.DEPOSIT_CUSTOMER_SUCCESS,
  payload: response,
});
const depositCustomerFailure = (error) => ({ type: types.DEPOSIT_CUSTOMER_FAILURE, payload: error });

const depositCustomer = (id, data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(depositCustomerRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.customer.deposit(id),
        data,
      })
      .then((response) => {
        dispatch(depositCustomerSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(depositCustomerFailure(error));
        reject(error);
      });
  });

const withdrawCustomerRequest = () => ({ type: types.WITHDRAW_CUSTOMER_REQUEST });
const withdrawCustomerSuccess = (response) => ({
  type: types.WITHDRAW_CUSTOMER_SUCCESS,
  payload: response,
});
const withdrawCustomerFailure = (error) => ({ type: types.WITHDRAW_CUSTOMER_FAILURE, payload: error });

const withdrawCustomer = (id, data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(withdrawCustomerRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.customer.withdraw(id),
        data,
      })
      .then((response) => {
        dispatch(withdrawCustomerSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(withdrawCustomerFailure(error));
        reject(error);
      });
  });

export {
  selectCustomer,
  getCustomers,
  getCustomer,
  getVehicleOfCustomer,
  getTransactionOfCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addVehicleToCustomer,
  removeVehicleOfCustomer,
  depositCustomer,
  withdrawCustomer,
};
