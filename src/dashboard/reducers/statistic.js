import { defaultPaging } from 'app/utils/helpers';
import types from 'dashboard/actions/types';

const INITIAL_STATE = {
  vehicleLogStatisticsList: defaultPaging,
  getVehicleLogStatisticsLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_VEHICLE_LOG_STATISTICS_REQUEST:
      return {
        ...state,
        getVehicleLogStatisticsLoading: true,
      };
    case types.GET_VEHICLE_LOG_STATISTICS_SUCCESS: {
      return {
        ...state,
        vehicleLogStatisticsList: action.payload,
        getVehicleLogStatisticsLoading: false,
      };
    }
    case types.GET_VEHICLE_LOG_STATISTICS_FAILURE:
      return {
        ...state,
        getVehicleLogStatisticsLoading: false,
      };
    default:
      return state;
  }
}
