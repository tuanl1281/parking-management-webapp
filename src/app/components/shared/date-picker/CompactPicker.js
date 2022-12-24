/* eslint-disable import/no-cycle */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Select } from 'semantic-ui-react';
import { WeekPicker, MonthPicker, RangePicker, DatePicker } from 'app/components/shared/date-picker';

import { colors } from 'app/utils/color-utils';
import moment from 'moment';

const StyledFormGroup = styled(Form.Group)`
  padding-left: 0.5em;
  padding-right: 0.25em;

  & :last-child {
    & .button {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
  }

  & .active {
    border-color: ${(props) => props?.color ? colors[props.color] : colors.vk} !important;
    & .menu {
      border-color: ${(props) => props?.color ? colors[props.color] : colors.vk} !important;
    }

    & .selected {
      border: none !important;
    }
  }
`;

const StyledSelect = styled(Select)`
  height: 40.5px;
  width: ${(props) => props?.width ?? '200px'} !important;
  background-color: ${(props) => props?.color ? colors[props.color] : colors.vk} !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;

  & .icon {
    display: none !important;
    height: 0 !important;
    width: 0 !important;
  }

  & .item {
    white-space: nowrap !important;
    overflow: hidden;
    text-overflow: ellipsis !important;
  }

  & .text {
    overflow: hidden;
    width: 90% !important;
    color: white !important;
    font-weight: 700 !important;
    text-align: center !important;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
  }

  & .menu {
    & .text {
      color: black !important;
      font-weight: 500 !important;
    }
  }
`;

export const PICKER_TYPES = {
  WEEK: 0,
  MONTH: 1,
  RANGE: 2,
  DATE: 3,
};

const CompactPicker = ({
  pickers,
  color,
  onChange,
}) => {
  const pickerTypes = pickers || [
    {
      order: 0,
      value: PICKER_TYPES.WEEK,
      label: 'Theo tuần',
    },
    {
      order: 1,
      value: PICKER_TYPES.MONTH,
      label: 'Theo tháng',
    },
    {
      order: 2,
      value: PICKER_TYPES.RANGE,
      label: 'Theo ngày',
    },
  ];

  const filteredTypes = pickerTypes.filter((t) => !t?.hidden);
  const pickerTypeOptions =
    filteredTypes
    .sort((_, __) => (_?.order ?? 0) - (__?.order ?? 0))
    .map((_) => ({
      key: _.value,
      value: _.value,
      text: _.label,
    }));

  const [type, setType] = useState(filteredTypes[0].value);
  useEffect(() => {
    switch (type) {
      case PICKER_TYPES.WEEK: {
        onChange({
          from: moment().startOf('week'),
          to: moment().endOf('week'),
        });
        break;
      }
      case PICKER_TYPES.MONTH: {
        onChange({
          from: moment().startOf('month'),
          to: moment().endOf('month'),
        });
        break;
      }
      case PICKER_TYPES.RANGE: {
        onChange({
          from: moment().startOf('day'),
          to: moment().endOf('day'),
        });
        break;
      }
      default:
        break;
    }
    // eslint-disable-next-line
  }, [type]);

  return (
    <div className="ui form">
      <StyledFormGroup color={color} width="equal">
        <StyledSelect
          width="130px"
          value={type}
          options={pickerTypeOptions}
          onChange={(_, { value }) => setType(value)}
        />
        {type === PICKER_TYPES.WEEK
          ? <WeekPicker basic onChange={onChange} />
          : type === PICKER_TYPES.MONTH
            ? <MonthPicker basic onChange={onChange} />
            : type === PICKER_TYPES.RANGE
              ? <RangePicker basic onChange={onChange} />
              : type === PICKER_TYPES.DATE
                ? <DatePicker basic onChange={onChange} />
                : null
        }
      </StyledFormGroup>
    </div>
  );
};

CompactPicker.propTypes = {
  pickers: PropTypes.arrayOf(PropTypes.shape({
    order: PropTypes.number,
    value: PropTypes.instanceOf(PICKER_TYPES).isRequired,
    label: PropTypes.string,
  })),
  color: PropTypes.string,
  onChange: PropTypes.func,
};

CompactPicker.defaultProps = {
  pickers: undefined,
  color: 'vk',
  onChange: () => {},
};

export default React.memo(CompactPicker);
