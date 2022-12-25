import auth from 'app/reducers/auth';
import global from 'app/reducers/global';
import statistic from 'dashboard/reducers/statistic';
import customer from 'customer/reducers/customer';
import vehicle from 'vehicle/reducers/vehicle';
import setting from 'setting/reducers/setting';

export default {
  auth,
  global,
  statistic,
  customer,
  vehicle,
  ...setting,
};
