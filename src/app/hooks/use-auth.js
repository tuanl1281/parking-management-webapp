import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setToken, login as li, logout as lo, getUserInfo, getPermission, checkCredential } from 'app/actions/auth';

import { TOKEN, EXPIRED_TIME } from 'app/utils/constants';

const useAuth = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { userInfo, permissionList } = useSelector((state) => state.auth);

  /**
   * Check role is admin or not
   * @returns {boolean}
   */
  const isAdmin = useCallback(() => (userInfo?.role?.code ?? '').includes('ADMIN'), [userInfo]);

  /**
   * Check role is site or not
   * @returns {boolean}
   */
  const isSite = useCallback(() => (userInfo?.role?.code ?? '').includes('SITE'), [userInfo]);

  /**
   * Check role is leader or not
   * @returns {boolean}
   */
  const isLeader = useCallback(() => (userInfo?.role?.code ?? '').includes('LEADER'), [userInfo]);

  /**
   * Check role is meal provider or not
   * @returns {boolean}
   */
  const isMealProvider = useCallback(() => (userInfo?.role?.code ?? '').includes('MEAL_PROVIDER'), [userInfo]);

  /**
   * Check role is meal provider or not
   * @returns {boolean}
   */
  const isEmployee = useCallback(() => (userInfo?.role?.code ?? '').includes('EMPLOYEE'), [userInfo]);

  /**
   * Check validate permission
   * @returns {boolean}
   */
  // const hasPermission = useCallback(
  //   (code) =>
  //     permissionList.map((p) => p.code).includes('ALL') || permissionList.map((p) => p.code).includes(code),
  //   [permissionList],
  // );

  const hasPermission = () => true;

  /**
   * Return a Promise which resolve when login successfully
   * @param {string} username Username
   * @param {string} password Password
   * @param {boolean} remember Option to remember password
   * @returns {Promise} Resolve if login successfully and reject if login failed
   */
  const login = useCallback(
    (username, password, remember = true) =>
      new Promise((resolve, reject) => {
        dispatch(li(username, password))
          .then((response) => {
            const { token, expiresIn } = response.data;
            if (remember) {
              localStorage.setItem(TOKEN, token);
              localStorage.setItem(EXPIRED_TIME, new Date(new Date().getTime() + expiresIn * 1000));
            } else {
              sessionStorage.setItem(TOKEN, token);
              sessionStorage.setItem(EXPIRED_TIME, new Date(new Date().getTime() + expiresIn * 1000));
            }
            dispatch(getUserInfo(token));
            dispatch(getPermission(token));
            resolve();
          })
          .catch(reject);
      }),
    [dispatch],
  );

  /**
   * Logout and delete token from localStorage
   */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(EXPIRED_TIME);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(EXPIRED_TIME);
    dispatch(lo());
  }, [dispatch]);

  /**
   * Check and handle token from localStorage and return if the token is still validate
   * @returns {boolean} token validate status
   */
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem(TOKEN) || sessionStorage.getItem(TOKEN);
    if (token) {
      /* Validate token */
      checkCredential(token).catch(() => {
        toast.warning('Phiên đăng nhập đã hết, vui lòng đăng nhập lại', {
          toastId: 'token-expired',
        });
        logout();
        /* Redirect to login page */
        history.push('/');
      });
      /* Parse token */
      const expiredTime = new Date(localStorage.getItem(EXPIRED_TIME) || sessionStorage.getItem(EXPIRED_TIME));
      if (token && expiredTime > new Date()) {
        dispatch(setToken(token, expiredTime, undefined));
        /* Get info user */
        dispatch(getUserInfo(token));
        /* Get permission */
        dispatch(getPermission(token));
        return true;
      }
    }

    localStorage.removeItem(TOKEN);
    localStorage.removeItem(EXPIRED_TIME);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(EXPIRED_TIME);
    dispatch(lo());
    return false;
  }, [dispatch, history, logout]);

  return {
    isAuthenticated,
    isAdmin,
    isSite,
    isLeader,
    isMealProvider,
    isEmployee,
    hasPermission,
    login,
    logout,
  };
};

export default useAuth;
