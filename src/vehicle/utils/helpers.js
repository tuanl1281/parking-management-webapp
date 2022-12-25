import { VEHICLE_TYPE } from 'vehicle/utils/constants';

const vehicleTypes = [
  {
    text: 'Xe máy',
    value: VEHICLE_TYPE.motorcycle,
  },
  {
    text: 'Xe ô tô',
    value: VEHICLE_TYPE.CAR,
  },
];

const vehicleTypeOptions = vehicleTypes.map((_) => ({
  value: _.value,
  text: _.text,
  content: _.text,
}));

const motorcycleBrands = ['Honda', 'Yamaha', 'Sym', 'Piaggio'];

const motorcycleBrandOptions = motorcycleBrands.map((_) => ({
  value: _,
  text: _,
  content: _,
}));

const carBrands = ['Honda', 'Tesla', 'Toyota', 'Vinfast', 'BMW', 'KIA', 'Lambogini', 'Porsche', 'Lexus', 'Bentley', 'Chevrolet', 'Ford', 'Huyndai', 'Isuzu', 'Mitsubishi', 'Mazda', 'Nissan', 'Volkswagen', 'Mercedes Benz', 'Audi'];

const carBrandOptions = carBrands.map((_) => ({
  value: _,
  text: _,
  content: _,
}));

const getOption = (array, value) => (array || []).find((_) => _?.value === value);
const getVehicleType = (type) => getOption(vehicleTypeOptions, type);
const getmotorcycleBrand = (brand) => getOption(motorcycleBrandOptions, brand);
const getCarBrand = (brand) => getOption(carBrandOptions, brand);

const formatLicenseNumber = (number) => {
  if (!number) {
    return '';
  }

  if (number.length === 9) {
    return number.replace(/(\w{4})(\w{5})/i, '$1 - $2');
  }

  if (number.length === 8) {
    return number.replace(/(\w{3})(\w{5})/i, '$1 - $2');
  }

  return number;
};

export {
  vehicleTypes,
  vehicleTypeOptions,
  motorcycleBrands,
  motorcycleBrandOptions,
  carBrands,
  carBrandOptions,
  getOption,
  getVehicleType,
  getmotorcycleBrand,
  getCarBrand,
  formatLicenseNumber,
};
