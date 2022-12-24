/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import {
  ComposedChart,
  XAxis,
  YAxis,
  Bar,
  Line,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Dimmer, Loader, Card } from 'semantic-ui-react';
import { CompactPicker } from 'app/components/shared/date-picker';
import { useDispatch, useSelector } from 'react-redux';
import { getMealDetailStatistic } from 'statistic/actions/statistic';

import { formatDate } from 'app/utils/time-utils';
import { MEAL_TYPES } from 'attendance/utils/constants';
import { getMealType } from 'attendance/utils/helpers';

const StyledCard = styled(Card)`
  width: 100% !important;
  height: 435px !important;
`;

const FilterWrapper = styled.div`
  height: 41.5px;

  > * {
    height: 40.5px !important;
    margin-right: 10px !important;

    & button {
      height: 40.5px !important;
    }
  }
`;

const ChartWrapper = styled.div`
  height: 350px;
  position: relative;
  margin-top: 0.75rem;
`;

const MEAL_STATISTICS = {
  ESTIMATED: 'estimated',
  ACTUAL: 'actual',
};

const mealStatistics = [
  {
    value: MEAL_STATISTICS.ESTIMATED,
    label: 'Kế hoạch',
    color: '#54BAB9',
  },
  {
    value: MEAL_STATISTICS.ACTUAL,
    label: 'Thực tế',
    color: '#EEC373',
  },
];

const AttendanceStatusChart = () => {
  const [filter, setFilter] = useState({});

  // #region data
  const dispatch = useDispatch();
  const { mealDetailStatisticList, getMealDetailStatisticLoading } = useSelector((state) => state.statistic);

  const data = useMemo(() =>
    (mealDetailStatisticList || []).map((d) => {
      const builder = {};
      builder.date = formatDate(d.date, 'DD/MM');

      for (const [key, value] of Object.entries(MEAL_STATISTICS)) {
        const statstics = d[value];
        if (!statstics) {
          continue;
        }

        /* Each */
        let total = 0;
        for (const [_key, _value] of Object.entries(MEAL_TYPES)) {
          const statistic = statstics.find((_) => _.type === _value);
          builder[`${key}_${_key}`] = statistic?.total ?? 0;
          total += statistic?.total ?? 0;
        }
        /* Total */
        builder[key] = total;
      }

      return builder;
    }),
  [mealDetailStatisticList]);

  const handleRefresh = useCallback(() => {
    dispatch(getMealDetailStatistic({
      ...filter,
      fromDate: filter?.from ? moment(filter.from).format('YYYY-MM-DD') : moment().startOf('week').format('YYYY-MM-DD'),
      toDate: filter?.to ? moment(filter.to).format('YYYY-MM-DD') : moment().endOf('week').format('YYYY-MM-DD'),
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
          <Dimmer inverted active={getMealDetailStatisticLoading}>
            <Loader />
          </Dimmer>
          <ResponsiveContainer>
            <ComposedChart width={300} height={300} margin={{ top: 20 }} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend wrapperStyle={{ position: 'relative', marginTop: '-15px' }} />
              {Object.keys(MEAL_STATISTICS).map((key) => {
                const mealStatistic = mealStatistics.find((_) => _.value === MEAL_STATISTICS[key]);
                return (
                  <Line
                    key={key}
                    dataKey={key}
                    type="monotone"
                    stroke={mealStatistic.color}
                    name={mealStatistic.label}
                  />
                );
              })}
              {Object.keys(MEAL_STATISTICS).filter((_) => MEAL_STATISTICS[_] !== MEAL_STATISTICS.ESTIMATED).map((key) =>
                Object.keys(MEAL_TYPES).map((_key) => {
                  // eslint-disable-next-line no-underscore-dangle
                  const mealType = getMealType(MEAL_TYPES[_key]);
                  return (
                    <Bar
                      key={`${key}_${_key}`}
                      dataKey={`${key}_${_key}`}
                      stackId={key}
                      barSize={20}
                      name={mealType.label}
                      fill={mealType.color}
                    />
                  );
                }),
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </Card.Content>
    </StyledCard>
  );
};

export default AttendanceStatusChart;
