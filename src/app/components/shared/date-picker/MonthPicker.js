/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, Input } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

import { useOutsideClick } from 'app/hooks';
import { colors } from 'app/utils/color-utils';

import 'react-datepicker/dist/react-datepicker.css';

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
  position: relative;
  height: 100%;

  & button {
    height: 100%;
    margin: 0 !important;
  }
`;

const PickerWrapper = styled.div`
  & .react-datepicker {
    display: ${(props) => (props.open ? 'block' : 'none')}!important;
    position: absolute;
    min-width: 282px;
    left: 0;
    z-index: 3;
    background: white;
    box-shadow: 0 2px 5px rgb(0 0 0 / 15%);
    border: unset;
    border-radius: unset;

    font-family: Barlow, 'Helvetica Neue', Arial, Helvetica, sans-serif;

    & .react-datepicker__month-container {
      display: table;
      margin: 0 1em;
      margin-top: 1em;
      border-spacing: 0;
      border-collapse: collapse;
      -webkit-user-select: none;
      user-select: none;

      & .react-datepicker__header {
        text-align: unset;
        background-color: unset;
        border-bottom: unset;
        border-top-left-radius: unset;
        padding: unset;
        position: unset;
      }

      & .react-datepicker__month {
        text-align: center;
      }

      & .react-datepicker__month-text {
        padding: 6px 6px;
        width: 5.5em;
        font-size: 14px;

        &:hover {
          background-color: #f0f8ff;
        }

        &--today {
          color: #d0021b;
          font-weight: 700;
        }

        &--keyboard-selected {
          background-color: ${(props) => (props?.color ? colors[props.color] : '#4D7198')};
          color: #f0f8ff;
          font-weight: 700;
          
          &:hover {
            background-color: ${(props) => (props?.color ? colors[props.color] : '#4D7198')};
          }
        }
      }
    }
  }
`;

const HeaderPickerWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.5em;
  margin-bottom: 0.5em;

  > div {
    font-weight: 500;
    font-size: 1.75em;
  }
`;

const NavBarPicker = styled.div`
  height: 25px;
  margin-left: auto;
  display: flex;

  & .button {
    cursor: pointer;
    height: 25px;
    width: 25px;
    background-position: center;
    background-size: 45%;
    background-repeat: no-repeat;

    &_prev {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAABGdBTUEAALGPC/xhBQAAAVVJREFUWAnN2G0KgjAYwPHpGfRkaZeqvgQaK+hY3SUHrk1YzNLay/OiEFp92I+/Mp2F2Mh2lLISWnflFjzH263RQjzMZ19wgs73ez0o1WmtW+dgA01VxrE3p6l2GLsnBy1VYQOtVSEH/atCCgqpQgKKqYIOiq2CBkqtggLKqQIKgqgCBjpJ2Y5CdJ+zrT9A7HHSTA1dxUdHgzCqJIEwq0SDsKsEg6iqBIEoq/wEcVRZBXFV+QJxV5mBtlDFB5VjYTaGZ2sf4R9PM7U9ZU+lLuaetPP/5Die3ToO1+u+MKtHs06qODB2zBnI/jBd4MPQm1VkY79Tb18gB+C62FdBFsZR6yeIo1YQiLJWMIiqVjQIu1YSCLNWFgijVjYIuhYYCKoWKAiiFgoopxYaKLUWOii2FgkophYp6F3r42W5A9s9OcgNvva8xQaysKXlFytoqdYmQH6tF3toSUo0INq9AAAAAElFTkSuQmCC);
    }

    &_next {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAABGdBTUEAALGPC/xhBQAAAVVJREFUWAnN2G0KgjAYwPHpGfRkaZeqvgQaK+hY3SUHrk1YzNLay/OiEFp92I+/Mp2F2Mh2lLISWnflFjzH263RQjzMZ19wgs73ez0o1WmtW+dgA01VxrE3p6l2GLsnBy1VYQOtVSEH/atCCgqpQgKKqYIOiq2CBkqtggLKqQIKgqgCBjpJ2Y5CdJ+zrT9A7HHSTA1dxUdHgzCqJIEwq0SDsKsEg6iqBIEoq/wEcVRZBXFV+QJxV5mBtlDFB5VjYTaGZ2sf4R9PM7U9ZU+lLuaetPP/5Die3ToO1+u+MKtHs06qODB2zBnI/jBd4MPQm1VkY79Tb18gB+C62FdBFsZR6yeIo1YQiLJWMIiqVjQIu1YSCLNWFgijVjYIuhYYCKoWKAiiFgoopxYaKLUWOii2FgkophYp6F3r42W5A9s9OcgNvva8xQaysKXlFytoqdYmQH6tF3toSUo0INq9AAAAAElFTkSuQmCC);
      transform: rotate(180deg);
    }
  }
`;

const MonthPicker = ({ basic, color, asInput, initial, onChange: onChangeProps }) => {
  const openRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(undefined);

  useOutsideClick(openRef, () => setOpen(false));

  const buttonContent = useMemo(() => months[moment(month).format('M') - 1], [month]);

  const onChange = (v) => {
    /* Trigger */
    onChangeProps({
      from: moment(v).startOf('month').format('YYYY-MM-DD'),
      to: moment(v).endOf('month').format('YYYY-MM-DD'),
    });
    /* Save */
    setMonth(v);
  };
  /* Initial */
  useEffect(() => {
    if (!initial) {
      return;
    }
    onChangeProps(month);
    // eslint-disable-next-line
  }, [initial, month]);

  return (
    <Wrapper>
      {!asInput && <Button basic={basic} color={color || 'vk'} content={buttonContent} onClick={() => setOpen(true)} />}
      {asInput && (
        <Input value={`${buttonContent} - Năm ${moment(month)?.format('YYYY')}`} onClick={() => setOpen(true)} />
      )}
      <PickerWrapper ref={openRef} open={open}>
        <DatePicker
          locale={locale}
          inline
          showMonthYearPicker
          renderCustomHeader={({ date, decreaseYear, increaseYear }) => (
            <HeaderPickerWrapper>
              <div>{moment(date).format('YYYY')}</div>
              <NavBarPicker>
                <div className="button button_prev" onClick={() => decreaseYear()} />
                <div className="button button_next" onClick={() => increaseYear()} />
              </NavBarPicker>
            </HeaderPickerWrapper>
          )}
          onChange={onChange}
        />
      </PickerWrapper>
    </Wrapper>
  );
};

MonthPicker.propTypes = {
  basic: PropTypes.bool,
  color: PropTypes.string,
  asInput: PropTypes.bool,
  initial: PropTypes.bool,
  onChange: PropTypes.func,
};

MonthPicker.defaultProps = {
  basic: false,
  color: undefined,
  asInput: false,
  initial: false,
  onChange: () => {},
};

export default React.memo(MonthPicker);
