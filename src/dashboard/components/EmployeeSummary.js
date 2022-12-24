/* eslint-disable react/no-array-index-key */
import React, { useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';

import { Dimmer, Loader, Responsive, Grid, Card, Header, Statistic } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { getOverviewStatistic } from 'statistic/actions/statistic';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;

  & .statistic {
    width: 100%;
    margin: 0 !important;
  }
`;

const EmployeeSummary = () => {
  // #region data
  const dispatch = useDispatch();
  const { overviewStatisticData, getOverviewStatisticLoading } = useSelector((state) => state.statistic);

  const handleRefresh = useCallback(() => {
    dispatch(getOverviewStatistic());
  }, [dispatch]);
  useEffect(handleRefresh, [handleRefresh]);
  // #endregion

  // #region utilities
  // eslint-disable-next-line no-unused-vars
  const getWidth = () =>
    typeof window === 'undefined'
      ? Responsive.onlyTablet.minWidth
      : window.innerWidth;

  const isTablet = getWidth() <= 1024;
  // #endregion

  // #region statistic
  const rows = useMemo(() => ([
    {
      hidden: false,
      statistics: [
        {
          key: 'EMPLOYEE_TOTAL',
          label: 'Tổng',
          value: overviewStatisticData?.employee?.total ?? 0,
          color: 'black',
          loading: getOverviewStatisticLoading,
        },
        {
          key: 'WORKING_EMPLOYEE_TOTAL',
          label: 'Đang làm việc',
          value: overviewStatisticData?.employee?.working ?? 0,
          color: 'green',
          loading: getOverviewStatisticLoading,
        },
        {
          key: 'LEFT_EMPLOYEE_TOTAL',
          label: 'Nghỉ việc',
          value: overviewStatisticData?.employee?.left ?? 0,
          color: 'red',
          loading: getOverviewStatisticLoading,
        },
      ],
    },
    {
      hidden: isTablet,
      statistics: [
        {
          key: 'REGISTERED_EMPLOYEE',
          label: 'Đã đăng kí ảnh',
          value: overviewStatisticData?.employee?.registered ?? 0,
          color: 'green',
          loading: getOverviewStatisticLoading,
        },
        {
          key: 'NOT_REGISTERED_EMPLOYEE',
          label: 'Chưa đăng kí ảnh',
          value: overviewStatisticData?.employee?.hasntRegistered ?? 0,
          color: 'red',
          loading: getOverviewStatisticLoading,
        },
      ],
    },
  ]), [isTablet, overviewStatisticData, getOverviewStatisticLoading]);
  // #endregion

  return (
    <Grid>
      <div>
        <Header>Nhân sự</Header>
      </div>
      <Grid.Row>
        {rows.filter((row) => !row.hidden).map((row, index) => (
          <Grid.Column key={`COLUMN_${index}`} computer={Math.floor(16 / rows.filter((_row) => !_row.hidden).length)}>
            <Card style={{ width: '100%' }}>
              <Card.Content>
                <Wrapper>
                  {row.statistics.map(({ key, loading, color, label, value }) => (
                    <>
                      <Dimmer inverted active={loading}>
                        <Loader />
                      </Dimmer>
                      <Statistic key={key} color={color}>
                        <Statistic.Label>{label}</Statistic.Label>
                        <Statistic.Value>{value}</Statistic.Value>
                      </Statistic>
                    </>
                  ))}
                </Wrapper>
              </Card.Content>
            </Card>
          </Grid.Column>
        ))}
      </Grid.Row>
    </Grid>
  );
};

export default EmployeeSummary;
