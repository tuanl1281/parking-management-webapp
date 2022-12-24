import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DayPicker from 'react-day-picker/DayPicker';
import { PatternFormat } from 'react-number-format';

import MomentLocaleUtils from 'react-day-picker/moment';

import { useOutsideClick } from 'app/hooks';

const MODIFIERS = {
  INPUT: 'INPUT',
  PICKER: 'PICKER',
};

const locale = 'vi';
const dateFormat = 'DD/MM/YYYY';
const serverDateFormat = 'YYYY/MM/DD';

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

const Wrapper = styled.div`
  position: relative;
`;

const KeyboardDatePicker = ({
  value,
  onChange,
  onError,
  readOnly,
  disabledDays,
}) => {
  const pickerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [modifier, setModifier] = useState(null);

  const [date, setDate] = useState(null);
  const [input, setInput] = useState(null);
  const [display, setDisplay] = useState(null);

  const [formatTimeOut, setFormatTimeOut] = useState(null);

  const format = () => {
    if (formatTimeOut) {
      clearTimeout(setFormatTimeOut);
    }

    setFormatTimeOut(
      setTimeout(() => {
        if (modifier !== MODIFIERS.INPUT) {
          return;
        }

        const p = moment();
        const d = input.replace(/\D/g, '').slice(0, 10);
        if (d.length >= 5) {
          setDate(moment(`${d.slice(4)}/${d.slice(2, 4)}/${d.slice(0, 2)}`).toDate());
        } else if (d.length >= 3) {
          setDate(moment(`${p.format('YYYY')}/${d.slice(2, 4)}/${d.slice(0, 2)}`).toDate());
        } else if (d.length > 0) {
          setDate(moment(`${p.format('YYYY')}/${p.format('MM')}/${d.slice(0, 2)}`).toDate());
        }
      }, 100),
    );
  };

  useOutsideClick(pickerRef, () => {
    setOpen(false);
  });

  useEffect(() => {
    if (value && !moment(date).isSame(value)) {
      setDate(new Date(value));
      setDisplay(moment(value).format(dateFormat));
    }
    // eslint-disable-next-line
  }, [value]);

  useEffect(() => {
    if (date) {
      setDisplay(moment(date).format(dateFormat));
      onChange(moment(date).format(serverDateFormat));
    }
    // eslint-disable-next-line
  }, [date]);

  return (
    <Wrapper>
      <PatternFormat
        allowEmptyFormatting
        className={readOnly ? 'd-none' : ''}
        value={display}
        mask="_"
        format="##/##/####"
        onValueChange={({ value: v }) => {
          if (v) {
            setModifier(MODIFIERS.INPUT);
            setInput(v);
          }
        }}
        onClick={() => {
          setOpen(true);
        }}
        onBlur={() => {
          format();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Tab' || e.key === 'Enter') {
            setOpen(false);
            format();
          }
        }}
      />
      {open && (
        <div ref={pickerRef} className="DayPickerInput-Overlay">
          <DayPicker
            selectedDays={[date]}
            locale={locale}
            months={months}
            disabledDays={disabledDays}
            localeUtils={MomentLocaleUtils}
            onDayClick={(d) => {
              setOpen(false);
              if (!d) {
                onError('InvalidDate');
                return;
              }
              /* Update */
              setModifier(MODIFIERS.PICKER);
              setDate(d);
            }}
          />
        </div>
      )}
    </Wrapper>
  );
};

KeyboardDatePicker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(Date)]),
  onChange: PropTypes.func,
  onError: PropTypes.func,
  readOnly: PropTypes.bool,
  disabledDays: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.func]),
};

KeyboardDatePicker.defaultProps = {
  value: null,
  onChange: () => {},
  onError: () => {},
  readOnly: false,
  disabledDays: [],
};

export default KeyboardDatePicker;
