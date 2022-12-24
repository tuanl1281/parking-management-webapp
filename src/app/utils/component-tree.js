/* eslint-disable import/no-cycle */
import AppLayout from 'app/layout/AppLayout';

// import HomePage from 'app/pages/HomePage';
import LoginPage from 'app/pages/LoginPage';
import PageNotFound from 'app/pages/PageNotFound';
import LandingPage from 'app/pages/LandingPage';

import DashboardPage from 'dashboard/pages/DasboardPage';
import CustomerPage from 'customer/pages/CustomerPage';
import VehiclePage from 'vehicle/pages/VehiclePage';

export const groupKey = {
};

export const componentKey = {
  // #region core
  LANDING_PAGE: 'LANDING_PAGE',
  AUTH_PAGE: 'AUTH_PAGE',
  LOGIN_PAGE: 'LOGIN_PAGE',
  HOME_PAGE: 'HOME_PAGE',
  NOT_FOUND_PAGE: 'NOT_FOUND_PAGE',
  // #endregion

  // #region customer
  CUSTOMER_PAGE: 'CUSTOMER_PAGE',
  // #endregion

  // #region vehicle
  VEHICLE_PAGE: 'VEHICLE_PAGE',
  // #endregion
};

const componentTree = [
  // #region core
  {
    key: componentKey.LANDING_PAGE,
    path: '/',
    exact: true,
    hidden: true,
    layout: null,
    component: LandingPage,
    breadcrumb: false,
    isPrivate: false,
    isDeveloping: false,
  },
  {
    key: componentKey.AUTH_PAGE,
    path: '/auth',
    exact: false,
    hidden: true,
    layout: null,
    component: LandingPage,
    breadcrumb: false,
    isPrivate: false,
    isDeveloping: false,
  },
  {
    key: componentKey.LOGIN_PAGE,
    path: '/login',
    exact: false,
    hidden: true,
    layout: null,
    component: LoginPage,
    breadcrumb: false,
    isPrivate: false,
    isDeveloping: false,
  },
  {
    key: componentKey.HOME_PAGE,
    path: '/home',
    exact: false,
    hidden: true,
    layout: AppLayout,
    component: DashboardPage,
    breadcrumb: false,
    isPrivate: true,
    isDeveloping: false,
  },
  {
    key: componentKey.CUSTOMER_PAGE,
    path: '/customers',
    exact: false,
    title: 'Khách hàng',
    hidden: false,
    layout: AppLayout,
    component: CustomerPage,
    breadcrumb: true,
    isPrivate: true,
    isDeveloping: false,
  },
  {
    key: componentKey.VEHICLE_PAGE,
    path: '/vehicles',
    exact: false,
    title: 'Phương tiện',
    hidden: false,
    layout: AppLayout,
    component: VehiclePage,
    breadcrumb: true,
    isPrivate: true,
    isDeveloping: false,
  },
  {
    key: componentKey.NOT_FOUND_PAGE,
    path: '/404',
    exact: false,
    title: 'Trang không tồn tại',
    hidden: true,
    layout: null,
    component: PageNotFound,
    breadcrumb: true,
    isPrivate: false,
    isDeveloping: false,
  },
  {
    exact: false,
    hidden: true,
    layout: null,
    component: PageNotFound,
    breadcrumb: true,
    isPrivate: false,
    isDeveloping: false,
  },
];

export default componentTree;
