/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Dimmer, Loader, Card } from 'semantic-ui-react';
import { CompactPicker } from 'app/components/shared/date-picker';

import { useDispatch, useSelector } from 'react-redux';
import { getAttendanceStatusStatistic } from 'statistic/actions/statistic';

import { formatDate } from 'app/utils/time-utils';
import { ATTENDANCE_STATUSES } from 'attendance/utils/constants';
import { getAttendanceStatus } from 'attendance/utils/helpers';
import { formatToSystemDate } from 'app/utils/helpers';

const StyledCard = styled(Card)`
  width: 100% !important;
  height: 435px !important;
`;

const FilterWrapper = styled.div`
  height: 41.5px;
  display: flex;

  > * {
    height: 40.5px !important;
    margin-right: 10px !important;

    & button {
      height: 40.5px !important;
    }
  }

  i {
    top: .9em !important;
    transform: rotate(0deg) !important;
  }

  &:last-child {
    & .input {
      flex-grow: 1;
      height: 41.5px !important;
      margin-right: 0 !important;
    }
  }
`;

const ChartWrapper = styled.div`
  height: 350px;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 0.75rem;

  & .chart {
    width: 95%;
    height: 90%;
  }

  & .legend {
    margin-top: 0.5em;
    margin-left: 3.15em;
    margin-right: 3.15em;
    overflow-x: scroll;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      display: none;
    }

    & .content {
      display: flex;
      flex-direction: row;

      & .item {
        margin-right: 2em;
        white-space: nowrap;

        &:last-child {
          margin-right: 0 !important;
        }
  
        & .icon {
          margin-right: 0.25rem;
        }
      }
    }
  }
`;

const AttendanceStatusChart = () => {
  const [filter, setFilter] = useState({});

  const ignored = [ATTENDANCE_STATUSES.LOST_CHECK_IN_ON_SYSTEM, ATTENDANCE_STATUSES.LOST_CHECK_OUT_ON_SYSTEM];

  // #region data
  const dispatch = useDispatch();
  const { attendanceStatusStatisticData, getAttendanceStatusStatisticLoading } = useSelector((state) => state.statistic);

  const data = useMemo(() => (attendanceStatusStatisticData || []).map((d) => {
    const builder = {};
    builder.date = formatDate(d.date, 'DD/MM');

    for (const [key, value] of Object.entries(ATTENDANCE_STATUSES)) {
      if (ignored.includes(value)) {
        continue;
      }

      builder[key] = (d?.statuses ?? []).find((_) => _.status === value)?.total ?? 0;
    }
    return builder;
  }), [attendanceStatusStatisticData]);

  const handleRefresh = useCallback(() => {
    dispatch(getAttendanceStatusStatistic({
      ...filter,
      fromDate: filter?.from ? formatToSystemDate(filter.from) : formatToSystemDate(moment().startOf('week')),
      toDate: filter?.to ? formatToSystemDate(filter.to) : formatToSystemDate(moment().endOf('week')),
    }));
  }, [dispatch, filter]);
  useEffect(handleRefresh, [handleRefresh]);
  // #endregion

  return (
    <StyledCard>
      <Card.Content>
        <FilterWrapper>
          <CompactPicker onChange={setFilter} />
        </FilterWrapper>
        <ChartWrapper>
          <Dimmer inverted active={getAttendanceStatusStatisticLoading}>
            <Loader />
          </Dimmer>
          <div className="chart">
            <ResponsiveContainer>
              <LineChart width={300} height={300} margin={{ top: 20 }} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                {Object.keys(ATTENDANCE_STATUSES).filter((_) => !ignored.includes(_)).map((key) => {
                  const status = getAttendanceStatus(ATTENDANCE_STATUSES[key]);
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      stroke={status.color}
                      name={status.label}
                      dataKey={key}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="legend">
            <div className="content">
              {Object.keys(ATTENDANCE_STATUSES).filter((_) => !ignored.includes(_)).map((key) => {
                if (ignored.includes(ATTENDANCE_STATUSES[key])) {
                  return null;
                }

                const status = getAttendanceStatus(ATTENDANCE_STATUSES[key]);
                return (
                  <div key={key} className="item" style={{ color: status.color }}>
                    <i className="ui icon circle" />
                    {status.label}
                  </div>
                );
              })}
            </div>
          </div>
        </ChartWrapper>
      </Card.Content>
    </StyledCard>
  );
};

export default AttendanceStatusChart;
