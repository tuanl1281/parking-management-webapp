/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FiArrowRight } from 'react-icons/fi';
import { Button } from 'semantic-ui-react';

import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';

import { useOutsideClick } from 'app/hooks';

// prettier-ignore
const months = [
  'Tháng 1', 'Tháng 2', 'Tháng 3',
  'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9',
  'Tháng 10', 'Tháng 11', 'Tháng 12',
];

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  z-index: 3;
  & button {
    height: 100%;
  }
`;

const ArrowIcon = styled(FiArrowRight)`
  vertical-align: bottom;
  margin: 0 2px;
`;

const PickerWrapper = styled.div`
  & .DayPickerInput-Overlay {
    width: 625px;

    & .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
      background-color: #f0f8ff !important;
      color: #4a90e2;
    }

    & .DayPicker-Day {
      border-radius: 0 !important;
    }

    & .DayPicker-Day--start {
      border-top-left-radius: 50% !important;
      border-bottom-left-radius: 50% !important;
    }

    & .DayPicker-Day--end {
      border-top-right-radius: 50% !important;
      border-bottom-right-radius: 50% !important;
    }
  }
`;

const RangePicker = ({ basic, color, initial, value, onChange }) => {
  const [selectedDates, setSelectedDates] = useState({
    from: value?.from ?? new Date(),
    to: value?.to ?? new Date(),
  });

  const [open, setOpen] = useState(false);

  const openRef = useRef(null);
  useOutsideClick(openRef, () => setOpen(false));

  const { from, to } = selectedDates;
  const modifiers = { start: from, end: to };

  const f = moment(from).format('DD/MM');
  const t = moment(to).format('DD/MM');
  const buttonContent = (
    <>
      {from ? f : ''}
      <ArrowIcon />
      {to ? t : ''}
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
    <Wrapper>
      <Button basic={basic} color={color || 'vk'} content={buttonContent} onClick={() => setOpen(true)} />
      {open && (
        <PickerWrapper ref={openRef}>
          <div className="DayPickerInput-Overlay">
            <DayPicker
              locale="vi"
              showOutsideDays
              months={months}
              numberOfMonths={2}
              localeUtils={MomentLocaleUtils}
              modifiers={modifiers}
              selectedDays={[from, { from, to }]}
              onDayClick={(d) => {
                const range = DateUtils.addDayToRange(d, selectedDates);
                setSelectedDates(range);

                if (onChange && onChange.toString() !== '() => {}' && onChange.toString() !== 'function(){}') {
                  if (range?.from && range?.to) {
                    onChange({
                      from: moment(range.from).format('YYYY-MM-DD'),
                      to: moment(range.to).format('YYYY-MM-DD'),
                    });
                  }
                }

                if (range?.to) {
                  setOpen(false);
                }
              }}
            />
          </div>
        </PickerWrapper>
      )}
    </Wrapper>
  );
};

RangePicker.propTypes = {
  basic: PropTypes.bool,
  color: PropTypes.string,
  initial: PropTypes.bool,
  value: PropTypes.shape({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
  }),
  onChange: PropTypes.func,
};

RangePicker.defaultProps = {
  basic: false,
  color: undefined,
  initial: false,
  value: undefined,
  onChange: () => {},
};

export default React.memo(RangePicker);
