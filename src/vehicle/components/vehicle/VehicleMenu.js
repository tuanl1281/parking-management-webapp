/* eslint-disable react/jsx-boolean-value */
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Grid, Tab } from 'semantic-ui-react';
import VehicleTable from 'vehicle/components/vehicle/VehicleTable';
import VehicleLogTable from 'vehicle/components/vehicle-log/VehicleLogTable';

import { useSelector } from 'react-redux';

const Wrapper = styled.div`
  & .segment {
    background-color: white !important;
    &:hover {
      background-color: white !important;
    }
  }
`;

const VehicleMenu = () => {
  const { selectedVehicle, vehicleList } = useSelector((_) => _.vehicle);

  const panes = useMemo(() => ([
    {
      menuItem: `Tất cả ${typeof vehicleList?.statistic?.hasRegistered !== 'undefined' || typeof vehicleList?.statistic?.hasntRegistered !== 'undefined' ? `(${vehicleList?.statistic?.hasRegistered + vehicleList?.statistic?.hasntRegistered})` : ''}`,
      render: () => (
        <Tab.Pane>
          <VehicleTable hasRegistered={null} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Đã đăng kí ${typeof vehicleList?.statistic?.hasRegistered !== 'undefined' ? `(${vehicleList?.statistic?.hasRegistered})` : ''}`,
      render: () => (
        <Tab.Pane>
          <VehicleTable hasRegistered={true} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Chưa đăng kí ${typeof vehicleList?.statistic?.hasntRegistered !== 'undefined' ? `(${vehicleList?.statistic?.hasntRegistered})` : ''}`,
      render: () => (
        <Tab.Pane>
          <VehicleTable hasRegistered={false} />
        </Tab.Pane>
      ),
    },
  ]), [vehicleList]);

  return (
    <Wrapper>
      <Grid>
        <Grid.Row divided>
          <Grid.Column width={selectedVehicle?.id ? 10 : 16}>
            <Tab panes={panes} />
          </Grid.Column>
          {selectedVehicle?.id && (
            <Grid.Column width={6}>
              <VehicleLogTable />
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
};

export default VehicleMenu;
