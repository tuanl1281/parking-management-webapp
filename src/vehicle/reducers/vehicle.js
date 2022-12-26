import { defaultPaging } from 'app/utils/helpers';
import types from 'vehicle/actions/types';

const INITIAL_STATE = {
  selectedVehicle: undefined,
  vehicleList: defaultPaging,
  vehicleData: undefined,
  logOfVehicleData: undefined,
  identifyVehicleData: undefined,
  getVehiclesLoading: false,
  getVehicleLoading: false,
  getLogOfVehicleLoading: false,
  createVehicleLoading: false,
  updateVehicleLoading: false,
  deleteVehicleLoading: false,
  addCustomerToVehicleLoading: false,
  removeCustomerOfVehicleLoading: false,
  identifyVehicleLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SELECTED_VEHICLE:
      return {
        ...state,
        selectedVehicle: action.payload,
      };
    case types.GET_VEHICLES_REQUEST:
      return {
        ...state,
        getVehiclesLoading: true,
      };
    case types.GET_VEHICLES_SUCCESS: {
      return {
        ...state,
        vehicleList: action.payload,
        getVehiclesLoading: false,
      };
    }
    case types.GET_VEHICLES_FAILURE:
      return {
        ...state,
        getVehiclesLoading: false,
      };
    case types.GET_VEHICLE_REQUEST:
      return {
        ...state,
        getVehicleLoading: true,
      };
    case types.GET_VEHICLE_SUCCESS: {
      return {
        ...state,
        vehicleData: action.payload,
        getVehicleLoading: false,
      };
    }
    case types.GET_VEHICLE_FAILURE:
      return {
        ...state,
        getVehiclsLoading: false,
      };
    case types.GET_LOG_OF_VEHICLE_REQUEST:
      return {
        ...state,
        getLogOfVehicleLoading: true,
      };
    case types.GET_LOG_OF_VEHICLE_SUCCESS: {
      return {
        ...state,
        logOfVehicleData: action.payload,
        getLogOfVehicleLoading: false,
      };
    }
    case types.GET_LOG_OF_VEHICLE_FAILURE:
      return {
        ...state,
        getLogOfVehicleLoading: false,
      };
    case types.CREATE_VEHICLE_REQUEST:
      return {
        ...state,
        createVehicleLoading: true,
      };
    case types.CREATE_VEHICLE_SUCCESS:
    case types.CREATE_VEHICLE_FAILURE:
      return {
        ...state,
        createVehicleLoading: false,
      };
    case types.UPDATE_VEHICLE_REQUEST:
      return {
        ...state,
        updateVehicleLoading: true,
      };
    case types.UPDATE_VEHICLE_SUCCESS:
    case types.UPDATE_VEHICLE_FAILURE:
      return {
        ...state,
        updateVehicleLoading: false,
      };
    case types.DELETE_VEHICLE_REQUEST:
      return {
        ...state,
        deleteVehicleLoading: true,
      };
    case types.DELETE_VEHICLE_SUCCESS:
    case types.DELETE_VEHICLE_FAILURE:
      return {
        ...state,
        deleteVehicleLoading: false,
      };
    case types.ADD_CUSTOMER_TO_VEHICLE_REQUEST:
      return {
        ...state,
        addCustomerToVehicleLoading: true,
      };
    case types.ADD_CUSTOMER_TO_VEHICLE_SUCCESS:
    case types.ADD_CUSTOMER_TO_VEHICLE_FAILURE:
      return {
        ...state,
        addCustomerToVehicleLoading: false,
      };
    case types.REMOVE_CUSTOMER_OF_VEHICLE_REQUEST:
      return {
        ...state,
        removeCustomerOfVehicleLoading: true,
      };
    case types.REMOVE_CUSTOMER_OF_VEHICLE_SUCCESS:
    case types.REMOVE_CUSTOMER_OF_VEHICLE_FAILURE:
      return {
        ...state,
        removeCustomerOfVehicleLoading: false,
      };
    case types.IDENTIFY_VEHICLE_REQUEST:
      return {
        ...state,
        identifyVehicleLoading: true,
      };
    case types.IDENTIFY_VEHICLE_SUCCESS:
    case types.IDENTIFY_VEHICLE_FAILURE:
      return {
        ...state,
        identifyVehicleLoading: false,
      };
    default:
      return state;
  }
}
