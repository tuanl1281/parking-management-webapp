import moment from 'moment';
import locations from 'app/assets/mock/locations.json';
import _ from 'lodash';

const formatLabelSelect = (options, value) => Array.isArray(options) && options?.find((__) => __.value === value)?.text;

const defaultPaging = {
  totalCounts: 0,
  data: [],
};

const defaultPagingWithStatistic = {
  totalCounts: 0,
  data: [],
  statistic: {},
};

const emptyOption = {
  key: '00000000-0000-0000-0000-000000000000',
  value: '00000000-0000-0000-0000-000000000000',
  text: 'Không có giá trị',
  content: 'Không có giá trị',
};

const blankOption = {
  key: undefined,
  value: undefined,
  text: 'Tất cả',
  content: 'Tất cả',
};

const defaultPayload = {
  pageIndex: 0,
  pageSize: 2147483647,
};

const getFirstLetter = (str) => {
  const words = `${str}`.split(' ');
  const firstWord = words[0];
  return firstWord[0];
};

// eslint-disable-next-line no-restricted-globals
const isNumberic = (num) => !isNaN(num);

const formatVNCurrency = (number) => `${number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} ₫`;

const filterArray = (array, searchValue) =>
  array.filter((element) => {
    const keys = Object.keys(element);
    let found = false;
    keys.forEach((key) => {
      if (element[key] && `${element[key]}`.toLowerCase().includes(searchValue.toLowerCase())) {
        found = true;
      }
    });
    return found;
  });

const compareName = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const mergeArrayObjects = (arr1, arr2) => {
  let start = 0;
  const merge = [];
  while (start < arr1.length) {
    if (arr1.length !== 0 && arr2.length !== 0 && arr1[start].time === arr2[start].time) {
      // pushing the merged objects into array
      const array1 = arr1[start];
      const nameArray1 = array1.name;
      const array2 = arr2[start];
      const nameArray2 = array2.name;
      array1[nameArray1] = array1.value;
      array2[nameArray2] = array2.value;
      array1.formattedTime = moment(array1.time).format('DD-MM-YY');
      array2.formattedTime = moment(array2.time).format('DD-MM-YY');
      merge.push({ ...array1, ...array2 });
    }
    // incrementing start value
    start += 1;
  }
  return merge;
};

const deburr = (s) => {
  let result = s ?? '';
  result = result.toLowerCase();
  result = result.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  result = result.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  result = result.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  result = result.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  result = result.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  result = result.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  result = result.replace(/đ/g, 'd');
  result = result.replace(
    // eslint-disable-next-line no-useless-escape
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  result = result.replace(/ + /g, ' ');
  result = result.trim();
  return result;
};

const formatAddress = (data) =>
  (data || []).map((e, i) => {
    let formattedFloor = '';
    let formattedBlock = '';
    let formattedStreet = '';
    let formattedWard = '';
    let formattedDistrict = '';
    // let formattedProvince = '';

    formattedFloor = e?.address?.floor ? `Tầng ${e?.address?.floor}, ` : '';
    formattedBlock = e?.address?.block ? `Lô ${e?.address?.block}, ` : '';
    formattedStreet = e?.address?.streetHouseNumber ? `${e?.address?.streetHouseNumber}, ` : '';
    // formattedProvince = e?.address?.provinceValue
    //   ? locations?.find((p) => p?.value === e?.address?.provinceValue)?.label
    //   : '';
    formattedDistrict =
      e?.address?.districtValue && e?.address?.provinceValue
        ? `${
            locations
              ?.find((p) => p?.value === e?.address?.provinceValue)
              ?.districts?.find((d) => d?.value === e?.address?.districtValue)?.label
          }`
        : '';
    formattedWard =
      e?.address?.wardValue && e?.address?.provinceValue && e?.address?.districtValue
        ? `${
            locations
              ?.find((p) => p?.value === e?.address?.provinceValue)
              ?.districts?.find((d) => d?.value === e?.address?.districtValue)
              ?.wards?.find((w) => w?.value === e?.address?.wardValue)?.label
          }, `
        : '';
    return {
      ...e,
      index: i + 1,
      formattedAddress: formattedFloor + formattedBlock + formattedStreet + formattedWard + formattedDistrict,
    };
  });

const formatObjectToAddress = (data) => {
  let formattedStreet = '';
  let formattedWard = '';
  let formattedDistrict = '';
  formattedStreet = data?.address?.streetHouseNumber ? `${data?.address?.streetHouseNumber}, ` : '';
  formattedDistrict =
    data?.address?.districtValue && data?.address?.provinceValue
      ? `${
          locations
            ?.find((p) => p?.value === data?.address?.provinceValue)
            ?.districts?.find((d) => d?.value === data?.address?.districtValue)?.label
        }`
      : '';
  formattedWard =
    data?.address?.wardValue && data?.address?.provinceValue && data?.address?.districtValue
      ? `${
          locations
            ?.find((p) => p?.value === data?.address?.provinceValue)
            ?.districts?.find((d) => d?.value === data?.address?.districtValue)
            ?.wards?.find((w) => w?.value === data?.address?.wardValue)?.label
        }, `
      : '';
  return formattedStreet + formattedWard + formattedDistrict;
};

const formatAddressToString = (address) => {
  let formattedStreet = '';
  let formattedWard = '';
  let formattedDistrict = '';
  formattedStreet = address?.streetHouseNumber ? `${address?.streetHouseNumber}, ` : '';
  formattedDistrict =
    address?.districtValue && address?.provinceValue
      ? `${
          locations
            ?.find((p) => p?.value === address?.provinceValue)
            ?.districts?.find((d) => d?.value === address?.districtValue)?.label
        }`
      : '';
  formattedWard =
    address?.wardValue && address?.provinceValue && address?.districtValue
      ? `${
          locations
            ?.find((p) => p?.value === address?.provinceValue)
            ?.districts?.find((d) => d?.value === address?.districtValue)
            ?.wards?.find((w) => w?.value === address?.wardValue)?.label
        }, `
      : '';
  return formattedStreet + formattedWard + formattedDistrict;
};

const checkFilter = (oldFilter, currentFilter) =>
  !_.isEqual(Object.values(oldFilter).filter(Boolean), Object.values(currentFilter).filter(Boolean));

const formatToDate = (date, format = 'DD-MM-YYYY') =>
  date
  ? typeof date === 'string'
    ? date.indexOf('Z') > -1
      ? moment(date).add(-7, 'hours').format(format)
      : moment(date).format(format)
    : moment(date).format(format)
  : '';

const formatToTime = (date, format = 'HH:mm | DD-MM-YYYY') =>
  date
  ? typeof date === 'string'
    ? date.indexOf('Z') > -1
      ? moment(date).add(-7, 'hours').format(format)
      : moment(date).format(format)
    : moment(date).format(format)
  : '';

const formatToSystemDate = (date) => `${moment(date).format('YYYY-MM-DDT00:00:00')}Z`;

const renderGender = ({ gender }) => {
  if (gender === 0) {
    return 'Nữ';
  }
  if (gender === 1) {
    return 'Nam';
  }
  if (gender === 2) {
    return 'Khác';
  }
  return '';
};

const getBase64 = (file) => new Promise((resolve) => {
  let baseURL = '';

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    baseURL = reader.result;
    resolve(baseURL);
  };
});

const subStringUtil = (string = '', displayLength) => {
  if (!string) {
    return null;
  }
  if (string.length <= displayLength) {
    return string;
  }
  return `${string.substr(0, displayLength / 2)}...${string.substr(
    string.length - displayLength / 2,
  )}`;
};

export {
  deburr,
  formatAddress,
  isNumberic,
  formatVNCurrency,
  filterArray,
  compareName,
  mergeArrayObjects,
  formatObjectToAddress,
  formatAddressToString,
  formatToDate,
  formatToTime,
  checkFilter,
  emptyOption,
  blankOption,
  defaultPaging,
  defaultPagingWithStatistic,
  defaultPayload,
  formatLabelSelect,
  renderGender,
  formatToSystemDate,
  getFirstLetter,
  getBase64,
  subStringUtil,
};
