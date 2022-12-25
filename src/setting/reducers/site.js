import { defaultPaging } from 'app/utils/helpers';
import types from 'setting/actions/types';

const INITIAL_STATE = {
  selectedSite: undefined,
  siteList: defaultPaging,
  siteData: undefined,
  cameraOfSiteData: undefined,
  getSitesLoading: false,
  getSiteLoading: false,
  getCamereaOfSiteLoading: false,
  createSiteLoading: false,
  updateSiteLoading: false,
  deleteSiteLoading: false,
  addCameraToSiteLoading: false,
  removeCameraOfSiteLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SELECTED_SITE:
      return {
        ...state,
        selectedSite: action.payload,
      };
    case types.GET_SITES_REQUEST:
      return {
        ...state,
        getSitesLoading: true,
      };
    case types.GET_SITES_SUCCESS: {
      return {
        ...state,
        siteList: action.payload,
        getSitesLoading: false,
      };
    }
    case types.GET_SITES_FAILURE:
      return {
        ...state,
        getSitesLoading: false,
      };
    case types.GET_SITE_REQUEST:
      return {
        ...state,
        getSiteLoading: true,
      };
    case types.GET_SITE_SUCCESS: {
      return {
        ...state,
        siteData: action.payload,
        getSiteLoading: false,
      };
    }
    case types.GET_SITE_FAILURE:
      return {
        ...state,
        getSiteLoading: false,
      };
    case types.GET_CAMERA_OF_SITE_REQUEST:
      return {
        ...state,
        getCameraOfSiteLoading: true,
      };
    case types.GET_CAMERA_OF_SITE_SUCCESS: {
      return {
        ...state,
        cameraOfSiteData: action.payload,
        getCameraOfSiteLoading: false,
      };
    }
    case types.GET_CAMERA_OF_SITE_FAILURE:
      return {
        ...state,
        getCameraOfSiteLoading: false,
      };
    case types.CREATE_SITE_REQUEST:
      return {
        ...state,
        createSiteLoading: true,
      };
    case types.CREATE_SITE_SUCCESS:
    case types.CREATE_SITE_FAILURE:
      return {
        ...state,
        createSiteLoading: false,
      };
    case types.UPDATE_SITE_REQUEST:
      return {
        ...state,
        updateSiteLoading: true,
      };
    case types.UPDATE_SITE_SUCCESS:
    case types.UPDATE_SITE_FAILURE:
      return {
        ...state,
        updateSiteLoading: false,
      };
    case types.DELETE_SITE_REQUEST:
      return {
        ...state,
        deleteSiteLoading: true,
      };
    case types.DELETE_SITE_SUCCESS:
    case types.DELETE_SITE_FAILURE:
      return {
        ...state,
        deleteSiteLoading: false,
      };
    case types.ADD_CAMERA_TO_SITE_REQUEST:
      return {
        ...state,
        addCameraToSiteLoading: true,
      };
    case types.ADD_CAMERA_TO_SITE_SUCCESS:
    case types.ADD_CAMERA_TO_SITE_FAILURE:
      return {
        ...state,
        addCameraToSiteLoading: false,
      };
    case types.REMOVE_CAMERA_OF_SITE_REQUEST:
      return {
        ...state,
        removeCameraOfSiteLoading: true,
      };
    case types.REMOVE_CAMERA_OF_SITE_SUCCESS:
    case types.REMOVE_CAMERA_OF_SITE_FAILURE:
      return {
        ...state,
        removeCameraOfSiteLoading: false,
      };
    default:
      return state;
  }
}
