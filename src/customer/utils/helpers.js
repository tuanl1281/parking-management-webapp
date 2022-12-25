const formatName = (customer) => `${customer?.firstName}${customer?.lastName ? ` ${customer.lastName}` : ''}`;
const formatPhoneNumber = (number) => {
  const formattedNumber = number.replace(/[^\d]/g, '');
  if (formattedNumber && formattedNumber.length === 10) {
    const matches = formattedNumber.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    return !matches[2] ? matches[1] : `${matches[1]} ${matches[2]}${matches[3] ? ` ${matches[3]}` : ''}`;
  }

  return formattedNumber;
};
const formatCurrency = (number, sign = 'đ') =>
  `${number?.toFixed(1)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,')
    .replace(/(\.\d)/g, '')} ${sign}`;

export {
  formatName,
  formatPhoneNumber,
  formatCurrency,
};
