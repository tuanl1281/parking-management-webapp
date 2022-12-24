/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FiArrowRight } from 'react-icons/fi';
import { Button } from 'semantic-ui-react';

import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';

import { useOutsideClick } from 'app/hooks';
import { colors } from 'app/utils/color-utils';
import { getDateOfWeek } from 'attendance/utils/helpers';

// #region config locale
const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const months = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];
// eslint-disable-next-line
const locale = {
  localize: {
    day: (n) => days[n],
    month: (n) => months[n],
  },
  formatLong: {
    date: () => 'dd/mm/yyyy',
  },
};
// #endregion

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  z-index: 3;
  & button {
    height: 100%;
    margin: 0 !important;
  }

  .DayPicker-Day {
    min-height: 38px !important;
    min-width: 38px !important;
    outline: none !important;
    border: 1px solid transparent !important;
  }
  .DayPicker-Month {
    border-collapse: separate !important;
  }
  .DayPicker-WeekNumber {
    outline: none !important;
  }
  .DayPicker-Day--hoverRange {
    background-color: #efefef !important;
    border-radius: 0 !important;
  }
  .DayPicker-Day--selectedRange {
    border-radius: 0 !important;
    background-color: ${(props) => (props?.color ? colors[props.color] : '#4D7198')} !important;
    border-top-color: ${(props) => (props?.color ? colors[props.color] : '#4D7198')} !important;
    border-bottom-color: ${(props) => (props?.color ? colors[props.color] : '#4D7198')} !important;
    border-left-color: ${(props) => (props?.color ? colors[props.color] : '#4D7198')} !important;
    border-right-color: ${(props) => (props?.color ? colors[props.color] : '#4D7198')} !important;
    color: white !important;
  }
  .DayPicker-Day--selectedRange:not(.DayPicker-Day--outside).DayPicker-Day--selected,
  .DayPicker-Day--hoverRange:not(.DayPicker-Day--outside).DayPicker-Day--selected {
    border-radius: 0 !important;
    color: black !important;
  }
  .DayPicker-Day--hoverRange:hover {
    border-radius: 0 !important;
  }
  .DayPickerInput {
    width: 100%;
  }
`;

const ArrowIcon = styled(FiArrowRight)`
  vertical-align: bottom;
  margin: 0 2px;
`;

const getWeekDays = (date) => {
  const result = [];
  const startOfWeek = moment(date).startOf('week').toDate();
  for (let i = 0; i < 7; i += 1) {
    result.push(moment(startOfWeek).add(i, 'days').toDate());
  }

  return result;
};

const getWeekRange = (date) => ({
  from: moment(date).startOf('week').toDate(),
  to: moment(date).endOf('week').toDate(),
});

const WeekPicker = ({ basic, color, initial, value, onChange }) => {
  const [hoverRange, setHoverRange] = useState();
  const [selectedDates, setSelectedDates] = useState(getDateOfWeek(value || new Date()).dayOfWeeks);
  const [open, setOpen] = useState(false);

  const ref = useRef(null);
  useOutsideClick(ref, () => setOpen(false));

  const modifiers = {
    hoverRange,
    selectedRange:
      selectedDates.length === 7
        ? {
            from: selectedDates[0],
            to: selectedDates[6],
          }
        : undefined,
    hoverRangeStart: hoverRange?.from,
    hoverRangeEnd: hoverRange?.to,
    selectedRangeStart: selectedDates?.[0],
    selectedRangeEnd: selectedDates?.[6],
  };

  const f = moment(selectedDates[0]).format('DD/MM');
  const t = moment(selectedDates[6]).format('DD/MM');
  const buttonContent = (
    <>
      {f}
      <ArrowIcon />
      {t}
    </>
  );

  /* Initial */
  useEffect(() => {
    if (!initial) {
      return;
    }

    onChange({ from: selectedDates[0], to: selectedDates[6] });
  // eslint-disable-next-line
  }, []);

  return (
    <Wrapper color={color}>
      <Button basic={basic} color={color || 'vk'} content={buttonContent} onClick={() => setOpen(true)} />
      {open && (
        <div ref={ref} className="DayPickerInput-Overlay">
          <DayPicker
            locale="vi"
            showOutsideDays
            showWeekNumbers
            months={months}
            localeUtils={MomentLocaleUtils}
            modifiers={modifiers}
            onDayMouseEnter={(d) => setHoverRange(getWeekRange(d))}
            onDayMouseLeave={() => setHoverRange(undefined)}
            onWeekClick={(_, _days) => setSelectedDates(_days)}
            onDayClick={(d) => {
              const selected = getWeekDays(d);
              setSelectedDates(selected);
              setOpen(false);

              if (onChange && selected.length === 7) {
                onChange({ from: selected[0], to: selected[6] });
              }
            }}
          />
        </div>
      )}
    </Wrapper>
  );
};

WeekPicker.propTypes = {
  basic: PropTypes.bool,
  color: PropTypes.string,
  initial: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
};

WeekPicker.defaultProps = {
  basic: false,
  color: undefined,
  initial: false,
  value: undefined,
  onChange: () => {},
};

export default React.memo(WeekPicker);
