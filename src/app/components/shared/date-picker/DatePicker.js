/* eslint-disable react/forbid-prop-types */
import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, Input } from 'semantic-ui-react';

import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';

import { useOutsideClick } from 'app/hooks';

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

  & .button {
    margin: 0 !important;
  }
`;

const DatePicker = ({ basic, color, asInput, initial, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);

  const ref = useRef(null);
  useOutsideClick(ref, () => setOpen(false));

  /* Initial */
  useEffect(() => {
    if (!initial) {
      return;
    }

    onChange(selectedDate);
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (moment(value).diff(moment(selectedDate)) !== 0) {
      setSelectedDate(value);
    }
    // eslint-disable-next-line
  }, [value]);

  return (
    <Wrapper color={color}>
      {!asInput && (
        <Button
          basic={basic}
          color={color || 'vk'}
          content={moment(selectedDate).format('DD/MM')}
          onClick={() => setOpen(true)}
        />
      )}

      {asInput && <Input value={moment(selectedDate).format('DD/MM/YYYY')} onClick={() => setOpen(true)} />}

      {open && (
        <div ref={ref} className="DayPickerInput-Overlay">
          <DayPicker
            locale="vi"
            showOutsideDays
            months={months}
            localeUtils={MomentLocaleUtils}
            selectedDays={selectedDate}
            onDayClick={(d) => {
              setSelectedDate(d);
              if (onChange && onChange.toString() !== '() => {}' && onChange.toString() !== 'function(){}') {
                onChange(d);
              }

              setOpen(false);
            }}
          />
        </div>
      )}
    </Wrapper>
  );
};

DatePicker.propTypes = {
  basic: PropTypes.bool,
  color: PropTypes.string,
  asInput: PropTypes.bool,
  initial: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
};

DatePicker.defaultProps = {
  basic: false,
  color: undefined,
  asInput: false,
  initial: false,
  value: new Date(),
  onChange: () => {},
};

export default React.memo(DatePicker);
