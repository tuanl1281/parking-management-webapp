import types from 'app/actions/types';

const INITIAL_STATE = {

  token: null,
  tokenExpiredTime: null,
  loginLoading: false,
  userInfo: null,
  getUserInfoLoading: false,
  permissionList: [],
  getPermissionLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOG_IN_REQUEST:
      return {
        ...state,
        loginLoading: true,
      };
    case types.LOG_IN_SUCCESS: {
      const token = action.payload;
      return {
        ...state,
        token,
        tokenExpiredTime: new Date(
          new Date().getTime() + token.expires_in * 1000,
        ),
        loginLoading: false,
      };
    }
    case types.LOG_IN_FAILURE:
      return {
        ...state,
        loginLoading: false,
      };
    case types.LOG_OUT:
      return {
        ...state,
        token: null,
        tokenExpiredTime: null,
        userInfo: null,
      };
    case types.SET_TOKEN:
      return {
        ...state,
        token: action.payload.token,
        tokenExpiredTime: action.payload.tokenExpiredTime,
        userInfo: action.payload.userInfo,
      };
    case types.SET_PERMISSIONS:
      return {
        ...state,
        permissionList: action.payload,
      };
    case types.GET_USER_INFO_REQUEST:
      return {
        ...state,
        getUserInfoLoading: true,
      };
    case types.GET_USER_INFO_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        getUserInfoLoading: false,
      };
    case types.GET_USER_INFO_FAILURE:
      return {
        ...state,
        getUserInfoLoading: false,
      };
    case types.GET_PERMISSION_OF_USER_INFO_REQUEST:
      return {
        ...state,
        getPermissionLoading: true,
      };
    case types.GET_PERMISSION_OF_USER_INFO_SUCCESS:
      return {
        ...state,
        permissionList: action.payload,
        getPermissionLoading: false,
      };
    case types.GET_PERMISSION_OF_USER_INFO_FAILURE:
      return {
        ...state,
        getPermissionLoading: false,
      };
    default:
      return state;
  }
}
