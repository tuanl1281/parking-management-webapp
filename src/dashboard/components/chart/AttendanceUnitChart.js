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
import { UnitSection } from 'filter/components';

import { useDispatch, useSelector } from 'react-redux';
import { getAttendanceUnitStatistic } from 'statistic/actions/statistic';

import { formatDate } from 'app/utils/time-utils';
import { formatToSystemDate } from 'app/utils/helpers';
import { getRandomColor } from 'app/utils/color-utils';

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

  &:first-child {
    > * {
      margin-right: 16px !important;
    }
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

const AttendanceUnitChart = () => {
  const [filter, setFilter] = useState({});

  // #region data
  const dispatch = useDispatch();
  const { attendanceUnitStatisticData, getAttendanceUnitStatisticLoading } = useSelector((state) => state.statistic);

  const units = useMemo(() => {
    const data = attendanceUnitStatisticData || [];
    if (data.length < 1) {
      return [];
    }

    return (attendanceUnitStatisticData[0]?.units ?? []).map(({ unit }) => {
      const color = getRandomColor();
      return { ...unit, color };
    });
  }, [attendanceUnitStatisticData]);

  const data = useMemo(() =>
  (attendanceUnitStatisticData || [])
    // eslint-disable-next-line no-shadow
    .map(({ date, units }) => ({
      date: formatDate(date, 'DD/MM'),
      ...(units || []).reduce((builder, { total, unit }) => {
        const newest = { ...builder };
        newest[unit.id] = total;

        return newest;
      }, {}),
    }),
  ), [attendanceUnitStatisticData]);

  const handleRefresh = useCallback(() => {
    dispatch(getAttendanceUnitStatistic(filter));
  }, [dispatch, filter]);
  useEffect(handleRefresh, [handleRefresh]);
  // #endregion

  return (
    <StyledCard>
      <Card.Content>
        <FilterWrapper>
          <CompactPicker
            onChange={({ from, to }) => setFilter({
              ...filter,
              fromDate: from ? formatToSystemDate(from) : formatToSystemDate(moment().startOf('week')),
              toDate: to ? formatToSystemDate(to) : formatToSystemDate(moment().endOf('week')),
            })}
          />
          <UnitSection hasntUnit onChange={({ unitType }) => setFilter({ ...filter, type: unitType })} />
        </FilterWrapper>
        <ChartWrapper>
          <Dimmer inverted active={getAttendanceUnitStatisticLoading}>
            <Loader />
          </Dimmer>
          <div className="chart">
            <ResponsiveContainer>
              <LineChart width={300} height={300} margin={{ top: 20 }} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                {(units || []).map(({ id, name, color }) => (
                  <Line
                    key={id}
                    dataKey={id}
                    type="monotone"
                    stroke={color}
                    name={name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="legend">
            <div className="content">
              {(units || []).map(({ id, name, color }) => (
                <div key={id} className="item" style={{ color }}>
                  <i className="ui icon circle" />
                  {name}
                </div>
              ))}
            </div>
          </div>
        </ChartWrapper>
      </Card.Content>
    </StyledCard>
  );
};

export default AttendanceUnitChart;
