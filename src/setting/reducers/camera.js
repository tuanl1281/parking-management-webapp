import { defaultPaging } from 'app/utils/helpers';
import types from 'setting/actions/types';

const INITIAL_STATE = {
  cameraList: defaultPaging,
  cameraData: undefined,
  getCamerasLoading: false,
  getCameraLoading: false,
  createCameraLoading: false,
  updateCameraLoading: false,
  deleteCameraLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_CAMERAS_REQUEST:
      return {
        ...state,
        getCamerasLoading: true,
      };
    case types.GET_CAMERAS_SUCCESS: {
      return {
        ...state,
        cameraList: action.payload,
        getCamerasLoading: false,
      };
    }
    case types.GET_CAMERAS_FAILURE:
      return {
        ...state,
        getCamerasLoading: false,
      };
    case types.GET_CAMERA_REQUEST:
      return {
        ...state,
        getCameraLoading: true,
      };
    case types.GET_CAMERA_SUCCESS: {
      return {
        ...state,
        cameraData: action.payload,
        getCameraLoading: false,
      };
    }
    case types.GET_CAMERA_FAILURE:
      return {
        ...state,
        getCameraLoading: false,
      };
    case types.GET_CAMERA_OF_CAMERA_REQUEST:
      return {
        ...state,
        getCameraOfCameraLoading: true,
      };
    case types.GET_CAMERA_OF_CAMERA_SUCCESS: {
      return {
        ...state,
        cameraOfCameraData: action.payload,
        getCameraOfCameraLoading: false,
      };
    }
    case types.GET_CAMERA_OF_CAMERA_FAILURE:
      return {
        ...state,
        getCameraOfCameraLoading: false,
      };
    case types.CREATE_CAMERA_REQUEST:
      return {
        ...state,
        createCameraLoading: true,
      };
    case types.CREATE_CAMERA_SUCCESS:
    case types.CREATE_CAMERA_FAILURE:
      return {
        ...state,
        createCameraLoading: false,
      };
    case types.UPDATE_CAMERA_REQUEST:
      return {
        ...state,
        updateCameraLoading: true,
      };
    case types.UPDATE_CAMERA_SUCCESS:
    case types.UPDATE_CAMERA_FAILURE:
      return {
        ...state,
        updateCameraLoading: false,
      };
    case types.DELETE_CAMERA_REQUEST:
      return {
        ...state,
        deleteCameraLoading: true,
      };
    case types.DELETE_CAMERA_SUCCESS:
    case types.DELETE_CAMERA_FAILURE:
      return {
        ...state,
        deleteCameraLoading: false,
      };
    default:
      return state;
  }
}
