import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import styled from 'styled-components';

import { FiImage } from 'react-icons/fi';
import { Dimmer, Header, Loader, Segment } from 'semantic-ui-react';
import { DataList } from 'app/components/shared';
import VehicleLogImageModal from 'vehicle/components/vehicle-log/VehicleLogImageModal';

import { useDispatch, useSelector } from 'react-redux';
import { getLogOfVehicle } from 'vehicle/actions/vehicle';
import { defaultPayload } from 'app/utils/helpers';
import { formatDate, formatSystemDate } from 'app/utils/time-utils';

const Wrapper = styled.div`
  position: relative;
`;

const VehicleLogTable = () => {
  const [detail, setDetail] = useState(undefined);

  const dispatch = useDispatch();
  const {
    selectedVehicle,
    logOfVehicleData,
    getLogOfVehicleLoading,
  } = useSelector((_) => _.vehicle);

  const { data } = logOfVehicleData || { data: [] };
  const loading = getLogOfVehicleLoading;

  const headerRender = useCallback(() => 'Cổng thu phí số 1', []);
  const contentRender = useCallback((_) => formatDate(_?.time, 'HH:mm | DD-MM-YYYY'), []);

  const fetchVehicleLogs = useCallback(() => {
    if (selectedVehicle?.id) {
      dispatch(getLogOfVehicle(selectedVehicle.id, {
        ...defaultPayload,
        fromDate: formatSystemDate(moment().startOf('month')),
        toDate: formatSystemDate(moment().endOf('month')),
      }));
    }
  }, [selectedVehicle, dispatch]);
  useEffect(fetchVehicleLogs, [fetchVehicleLogs]);

  return (
    <>
      <Header style={{ marginTop: '.65rem', marginBottom: '.65rem' }}>Lịch sử</Header>
      <Wrapper>
        <Dimmer inverted active={loading} style={{ paddingTop: (data || []).length < 1 ? '0px' : '64px' }}>
          <Loader />
        </Dimmer>
        {(!loading && (data || []).length < 1) && (
          <Segment style={{ marginTop: '0' }}>
            <center>Không có dữ liệu</center>
          </Segment>
        )}
        {(data || []).length > 0 && (
          <Segment style={{ marginTop: '0' }}>
            <DataList
              data={data}
              getRowKey={(_) => _.time}
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

export default VehicleLogTable;
