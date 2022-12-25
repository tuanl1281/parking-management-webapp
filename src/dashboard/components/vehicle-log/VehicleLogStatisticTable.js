import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { FiImage } from 'react-icons/fi';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import { DataList } from 'app/components/shared';
import VehicleLogImageModal from 'vehicle/components/vehicle-log/VehicleLogImageModal';

import { useQueryString } from 'app/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { getVehicleLogStatistics } from 'dashboard/actions/statistic';
import { defaultPaging } from 'app/utils/helpers';
import { formatLicenseNumber } from 'vehicle/utils/helpers';
import { formatDate, formatSystemDate } from 'app/utils/time-utils';

const Wrapper = styled.div`
  position: relative;
  & .cddXGj {
    margin-top: 0;
  }

  & .bwqnUH {
    margin-top: 0.5rem;
  }
`;

const VehicleLogStatisticTable = () => {
  const [filter] = useQueryString();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [detail, setDetail] = useState(undefined);

  const dispatch = useDispatch();
  const {
    vehicleLogStatisticsList,
    getVehicleLogStatisticsLoading,
  } = useSelector((_) => _.statistic);

  const { data, totalCounts } = vehicleLogStatisticsList || defaultPaging;
  const loading = getVehicleLogStatisticsLoading;

  const headerRender = useCallback((_) => formatLicenseNumber(_?.vehicle?.licenseNumber), []);
  const contentRender = useCallback((_) => formatDate(_?.time, 'HH:mm | DD-MM-YYYY'), []);

  const fetchVehicleLogStatistics = useCallback(() => {
    dispatch(getVehicleLogStatistics({
      ...filter,
      fromDate: formatSystemDate(moment().startOf('month')),
      toDate: formatSystemDate(moment().endOf('month')),
      pageIndex,
      pageSize,
    }));
  }, [dispatch, filter, pageIndex, pageSize]);
  useEffect(fetchVehicleLogStatistics, [fetchVehicleLogStatistics]);

  return (
    <>
      <Wrapper>
        <Dimmer inverted active={loading} style={{ paddingTop: (data || []).length < 1 ? '0px' : '64px' }}>
          <Loader />
        </Dimmer>
        {(!loading && (data || []).length < 1) && (
          <center>Không có dữ liệu</center>
        )}
        {(data || []).length > 0 && (
          <Segment style={{ marginTop: '0' }}>
            <DataList
              data={data}
              totalCounts={totalCounts}
              onPaginationChange={({ pageIndex: pi, pageSize: pe }) => {
                setPageIndex(pe !== pageSize ? 0 : pi);
                setPageSize(pe);
              }}
              getRowKey={(_) => _.id}
              itemHeaderRender={headerRender}
              itemContentRender={contentRender}
              itemActions={[
                {
                  icon: <FiImage />,
                  color: 'blue',
                  onClick: (_) => setDetail(_),
                },
              ]}
            />
          </Segment>
        )}
      </Wrapper>

      <VehicleLogImageModal
        data={detail}
        onClose={() => setDetail(undefined)}
      />
    </>
  );
};

export default VehicleLogStatisticTable;
