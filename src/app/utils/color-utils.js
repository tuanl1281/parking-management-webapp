const colors = {
  vk: '#4D7198',
  red: '#B03060',
  orange: '#FE9A76',
  yellow: '#FFD700',
  olive: '#32CD32',
  green: '#016936',
  teal: '#008080',
  blue: '#0E6EB8',
  violet: '#EE82EE',
  purple: '#B413EC',
  pink: '#FF1493',
  brown: '#A52A2A',
  grey: '#A0A0A0',
  black: '#000000',
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : {
      r: 0,
      g: 0,
      b: 0,
    };
};

const getConstrastText = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const contrast = (Math.round(r * 299) + Math.round(g * 587) + Math.round(b * 114)) / 1000;
  return contrast >= 128 ? 'black' : 'white';
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  /* Builder */
  let builder = '#';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 6; i++) {
    builder += letters[Math.floor(Math.random() * 16)];
  }
  /* Return */
  return builder;
};

export {
  colors,
  getRandomColor,
  getConstrastText,
  hexToRgb,
};
