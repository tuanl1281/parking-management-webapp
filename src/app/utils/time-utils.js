/* eslint-disable no-underscore-dangle */
import moment from 'moment';

const formatHour = (time) =>
  time.indexOf('T') > -1
  ? (time.indexOf('Z') > -1 || time.indexOf('z') > -1)
    ? moment(time).add(-7, 'hours').format('HH:mm')
    : moment(time).format('HH:mm')
  : moment(`1900-01-01T${time}`).format('HH:mm');

const formatDate = (date, format = 'DD-MM-YYYY') =>
  date
  ? date.indexOf('Z') > -1
    ? moment(date).add(-7, 'hours').format(format)
    : moment(date).format(format)
  : '';

const formatSystemDate = (date) =>
  `${moment(date).format('YYYY-MM-DDT00:00:00')}Z`;

const getDaysInMonth = (time = undefined, dayOfWeek = undefined) => {
  const _time = time ? moment(time).startOf('month').toDate() : moment().startOf('month').toDate();

  const days = [];
  const length = new Date(_time.getFullYear(), _time.getMonth() + 1, 0).getDate();
  for (let index = 1; index <= length; index += 1) {
    const day = new Date(_time.getFullYear(), _time.getMonth(), index);
    if (typeof dayOfWeek === 'undefined' || day.getDay() === dayOfWeek) {
      days.push(day);
    }
  }

  return days;
};

const getDaysInYear = (time = undefined) => {
  const _time = time ? moment(time).startOf('year').toDate() : moment().startOf('year').toDate();
  return new Date(_time.getFullYear(), _time.getMonth() + 1, 0).getDate();
};

const getNumberOfWeekDays = (start, end, dayNum) => {
  const _start = new Date(start);
  const _end = new Date(end);
  // Sunday's num is 0 with Date.prototype.getDay.
  const _dayNum = dayNum || 0;
  // Calculate the number of days between start and end.
  const daysInInterval = Math.ceil((_end.getTime() - _start.getTime()) / (1000 * 3600 * 24));
  // Calculate the nb of days before the next target day (e.g. next Sunday after start).
  const toNextTargetDay = (7 + _dayNum - _start.getDay()) % 7;
  // Calculate the number of days from the first target day to the end.
  const daysFromFirstTargetDay = Math.max(daysInInterval - toNextTargetDay, 0);
  // Calculate the number of weeks (even partial) from the first target day to the end.
  return Math.ceil(daysFromFirstTargetDay / 7);
};

export {
  formatHour,
  formatDate,
  formatSystemDate,
  getDaysInMonth,
  getDaysInYear,
  getNumberOfWeekDays,
};
