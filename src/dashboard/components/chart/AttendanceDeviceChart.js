import React from 'react';
import styled from 'styled-components';

import {
  Icon,
  Card as CardSUI,
} from 'semantic-ui-react';

import { useSelector } from 'react-redux';
import { DEVICE_STATUSES } from 'setting/utils/constants';

const Flex = styled.div`
  height: ${(props) => props?.height ?? '100%'};
  width: ${(props) => props?.width ?? '100%'};
  display: flex;
  flex-direction: ${(props) => props?.direction ?? 'row'};
  
  > div {
    ${(props) => (props?.direction ?? 'row') === 'column' ? `margin-bottom: ${props?.seperate ?? '14px'};` : ''}
  }
`;

const Item = styled.div`
  height: ${(props) => props?.height ?? '100%'};
  width: ${(props) => props?.width ?? '100%'};
  margin-left: ${(props) => (props?.align ?? 'left') === 'right' ? 'auto' : '0'};
`;

const Container = styled.div`
  width: 100%;
  height: 450px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%
  display: flex;
  flex-direction: column;
  padding-left: 1em;
  padding-right: 1em;
`;

const Card = styled(CardSUI)`
  width: 100% !important;
  margin-top: 0 !important;
`;

const AttendanceDeviceChart = () => {
  const {
    attendanceOverviewStatisticData,
  } = useSelector((state) => state.statistic);
  const { devices } = attendanceOverviewStatisticData || { devices: [] };

  return (
    <Container>
      <Wrapper>
        {(devices || []).map((device) => (
          <Card color={(device?.status ?? 0) === DEVICE_STATUSES.ENABLED ? 'green' : 'red'}>
            <Card.Content>
              <Flex direction="column" seperate="0px">
                <Flex>
                  <Item height="none" width="none">
                    <Icon name="circle" color={(device?.status ?? 0) === DEVICE_STATUSES.ENABLED ? 'green' : 'red'} />
                  </Item>
                  <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center' }}>{device?.name}</div>
                </Flex>
                <div style={{ height: '12px' }} />
                <Flex>
                  <Flex direction="column" seperate="0px">
                    <Item>
                      <span style={{ color: 'grey' }}>Chi nhánh</span>
                    </Item>
                    <Item>
                      <span style={{ fontWeight: '700' }}>{device?.site?.name}</span>
                    </Item>
                  </Flex>
                  <Flex direction="column" seperate="0px">
                    <Item>
                      <span style={{ color: 'grey' }}>Số lần nhận diện</span>
                    </Item>
                    <Item>
                      <span style={{ fontWeight: '700' }}>{device?.total ?? 0}</span>
                    </Item>
                  </Flex>
                </Flex>
              </Flex>
            </Card.Content>
          </Card>
      ))}
      </Wrapper>
    </Container>
  );
};

export default AttendanceDeviceChart;
