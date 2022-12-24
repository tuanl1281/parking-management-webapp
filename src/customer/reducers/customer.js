import { defaultPaging } from 'app/utils/helpers';
import types from 'customer/actions/types';

const INITIAL_STATE = {
  selectedCustomer: undefined,
  customerList: defaultPaging,
  customerData: undefined,
  transactionOfCustomerData: undefined,
  vehicleOfCustomerData: undefined,
  getCustomersLoading: false,
  getCustomerLoading: false,
  getVehicleOfCustomerLoading: false,
  getTransactionOfCustomerLoading: false,
  createCustomerLoading: false,
  updateCustomerLoading: false,
  deleteCustomerLoading: false,
  addVehicleToCustomerLoading: false,
  removeVehicleOfCustomerLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SELECTED_CUSTOMER:
      return {
        ...state,
        selectedCustomer: action.payload,
      };
    case types.GET_CUSTOMERS_REQUEST:
      return {
        ...state,
        getCustomersLoading: true,
      };
    case types.GET_CUSTOMERS_SUCCESS: {
      return {
        ...state,
        customerList: action.payload,
        getCustomersLoading: false,
      };
    }
    case types.GET_CUSTOMERS_FAILURE:
      return {
        ...state,
        getCustomersLoading: false,
      };
    case types.GET_CUSTOMER_REQUEST:
      return {
        ...state,
        getCustomerLoading: true,
      };
    case types.GET_CUSTOMER_SUCCESS: {
      return {
        ...state,
        customerData: action.payload,
        getCustomerLoading: false,
      };
    }
    case types.GET_CUSTOMER_FAILURE:
      return {
        ...state,
        getCustomerLoading: false,
      };
    case types.GET_VEHICLE_OF_CUSTOMER_REQUEST:
      return {
        ...state,
        getVehicleOfCustomerLoading: true,
      };
    case types.GET_VEHICLE_OF_CUSTOMER_SUCCESS: {
      return {
        ...state,
        vehicleOfCustomerData: action.payload,
        getVehicleOfCustomerLoading: false,
      };
    }
    case types.GET_VEHICLE_OF_CUSTOMER_FAILURE:
      return {
        ...state,
        getVehicleOfCustomerLoading: false,
      };
    case types.GET_TRANSACTION_OF_CUSTOMER_REQUEST:
      return {
        ...state,
        getTransactionOfCustomerLoading: true,
      };
    case types.GET_TRANSACTION_OF_CUSTOMER_SUCCESS: {
      return {
        ...state,
        vehicleOfCustomerData: action.payload,
        getTransactionOfCustomerLoading: false,
      };
    }
    case types.GET_TRANSACTION_OF_CUSTOMER_FAILURE:
      return {
        ...state,
        getTransactionOfCustomerLoading: false,
      };
    case types.CREATE_CUSTOMER_REQUEST:
      return {
        ...state,
        createCustomerLoading: true,
      };
    case types.CREATE_CUSTOMER_SUCCESS:
    case types.CREATE_CUSTOMER_FAILURE:
      return {
        ...state,
        createCustomerLoading: false,
      };
    case types.UPDATE_CUSTOMER_REQUEST:
      return {
        ...state,
        updateCustomerLoading: true,
      };
    case types.UPDATE_CUSTOMER_SUCCESS:
    case types.UPDATE_CUSTOMER_FAILURE:
      return {
        ...state,
        updateCustomerLoading: false,
      };
    case types.DELETE_CUSTOMER_REQUEST:
      return {
        ...state,
        deleteCustomerLoading: true,
      };
    case types.DELETE_CUSTOMER_SUCCESS:
    case types.DELETE_CUSTOMER_FAILURE:
      return {
        ...state,
        deleteCustomerLoading: false,
      };
    case types.ADD_VEHICLE_TO_CUSTOMER_REQUEST:
      return {
        ...state,
        addVehicleToCustomerLoading: true,
      };
    case types.ADD_VEHICLE_TO_CUSTOMER_SUCCESS:
    case types.ADD_VEHICLE_TO_CUSTOMER_FAILURE:
      return {
        ...state,
        addVehicleToCustomerLoading: false,
      };
    case types.REMOVE_VEHICLE_OF_CUSTOMER_REQUEST:
      return {
        ...state,
        removeVehicleOfCustomerLoading: true,
      };
    case types.REMOVE_VEHICLE_OF_CUSTOMER_SUCCESS:
    case types.REMOVE_VEHICLE_OF_CUSTOMER_FAILURE:
      return {
        ...state,
        removeVehicleOfCustomerLoading: false,
      };
    default:
      return state;
  }
}
