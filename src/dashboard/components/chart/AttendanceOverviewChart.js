import React, { useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { Responsive, Card } from 'semantic-ui-react';
import CardChart from 'dashboard/components/chart/CardChart';

import { useDispatch, useSelector } from 'react-redux';
import { getAttendanceOverviewStatistic } from 'statistic/actions/statistic';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100% !important;
  height: ${(props) => props?.tablet ? '175px' : '435px'} !important;

  & .cards {
    width: 100% !important;
  }
`;

const AttendanceOverviewChart = () => {
  const dispatch = useDispatch();

  // #region data
  const { attendanceOverviewStatisticData, getAttendanceOverviewStatisticLoading } = useSelector((state) => state.statistic);

  const handleRefresh = useCallback(() => {
    dispatch(getAttendanceOverviewStatistic({
      fromDate: moment().format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
    }));
  }, [dispatch]);
  useEffect(handleRefresh, [handleRefresh]);
  // #endregion

  // #region utilities
  const getWidth = () =>
    typeof window === 'undefined'
      ? Responsive.onlyTablet.minWidth
      : window.innerWidth;

  const isTablet = getWidth() <= 1024;
  // #endregion

  // #region card
  const cards = useMemo(() => ([
    {
      key: 'checkIn',
      color: 'green',
      label: 'Vào',
      value: attendanceOverviewStatisticData?.checkIn ?? 0,
      height: isTablet ? '150px' : '202px',
      loading: getAttendanceOverviewStatisticLoading,
    },
    {
      key: 'checkOut',
      color: 'orange',
      label: 'Ra',
      value: attendanceOverviewStatisticData?.checkOut ?? 0,
      height: isTablet ? '150px' : '202px',
      loading: getAttendanceOverviewStatisticLoading,
    },
    {
      key: 'normalShift',
      color: 'teal',
      label: 'Ca chính',
      value: attendanceOverviewStatisticData?.shift?.normal ?? 0,
      height: isTablet ? '150px' : '202px',
      loading: getAttendanceOverviewStatisticLoading,
    },
    {
      key: 'overtimeShift',
      color: 'yellow',
      label: 'Tăng ca',
      value: attendanceOverviewStatisticData?.shift?.overtime ?? 0,
      height: isTablet ? '150px' : '202px',
      loading: getAttendanceOverviewStatisticLoading,
    },
  ]), [isTablet, attendanceOverviewStatisticData, getAttendanceOverviewStatisticLoading]);
  // #endregion

  return (
    <Wrapper tablet={isTablet}>
      <Card.Group itemsPerRow={isTablet ? 4 : 2}>
        {cards.map(({ key, loading, color, height, label, value }) => (
          <CardChart key={key} loading={loading} color={color} height={height} label={label} value={value} />
        ))}
      </Card.Group>
    </Wrapper>
  );
};

export default AttendanceOverviewChart;
