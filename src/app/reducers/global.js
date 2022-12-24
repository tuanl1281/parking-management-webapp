import types from 'app/actions/types';

const INITIAL_STATE = {
  sidebarOpen: true,
  footerOpen: undefined,

  confirmMessage: '',
  confirmCallback: null,

  forwardMessage: '',
  forwardCallback: null,

  infoHeader: '',
  infoContent: '',
  infoCallback: null,

  errorHeader: '',
  errorSuccess: '',
  errorFailLogs: [],

  uploadHeader: '',
  uploadContent: '',
  uploadCallback: null,

  uploadLoading: false,
  downloadLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.TRIGGER_SIDEBAR_OPEN:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    case types.TRIGGER_FOOTER_OPEN:
      return {
        ...state,
        footerOpen: action.payload,
      };
    case types.SHOW_CONFIRM_MODAL:
      return {
        ...state,
        confirmMessage: action.payload.message,
        confirmCallback: action.payload.confirmCallback,
      };
    case types.SHOW_ERROR_MODAL:
      return {
        ...state,
        errorHeader: action.payload.header,
        errorSuccessList: action.payload.successList,
        errorFailLogs: action.payload.failLogs,
      };
    case types.SHOW_FORWARD_MODAL:
      return {
        ...state,
        forwardMessage: action.payload.message,
        forwardCallback: action.payload.confirmCallback,
      };
    case types.SHOW_INFO_MODAL:
      return {
        ...state,
        infoHeader: action.payload.header,
        infoContent: action.payload.content,
        infoCallback: action.payload.infoCallback,
      };
    case types.SHOW_UPLOAD_MODAL:
      return {
        ...state,
        uploadHeader: action.payload.uploadHeader,
        uploadContent: action.payload.uploadContent,
        uploadCallback: action.payload.uploadCallback,
      };
    case types.UPLOAD_REQUEST:
      return {
        ...state,
        uploadLoading: true,
      };
    case types.UPLOAD_SUCCESS:
    case types.UPLOAD_FAILURE:
      return {
        ...state,
        uploadLoading: false,
      };
    case types.DOWNLOAD_REQUEST:
      return {
        ...state,
        downloadLoading: true,
      };
    case types.DOWNLOAD_SUCCESS:
    case types.DOWNLOAD_FAILURE:
      return {
        ...state,
        downloadLoading: false,
      };
    default:
      return state;
  }
}
