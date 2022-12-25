import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';
import types from 'dashboard/actions/types';

const getVehicleLogStatisticsRequest = () => ({ type: types.GET_VEHICLE_LOG_STATISTICS_REQUEST });
const getVehicleLogStatisticsSuccess = (response) => ({
  type: types.GET_VEHICLE_LOG_STATISTICS_SUCCESS,
  payload: response,
});
const getVehicleLogStatisticsFailure = (error) => ({ type: types.GET_VEHICLE_LOG_STATISTICS_FAILURE, payload: error });

const getVehicleLogStatistics = ({
  pageIndex = undefined,
  pageSize = undefined,
  ...params
}) =>
(dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getVehicleLogStatisticsRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.statistic.getVehicleLog,
        params: {
          ...params,
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getVehicleLogStatisticsSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getVehicleLogStatisticsFailure(error));
        reject(error);
      });
  });

export {
  getVehicleLogStatistics,
};
