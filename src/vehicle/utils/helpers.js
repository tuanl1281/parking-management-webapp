import { VEHICLE_TYPE } from 'vehicle/utils/constants';

const vehicleTypes = [
  {
    text: 'Xe máy',
    value: VEHICLE_TYPE.MOTOBIKE,
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

const motobikeBrands = ['Honda', 'Yamaha', 'Sym', 'Piaggio'];

const motobikeBrandOptions = motobikeBrands.map((_) => ({
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
const getMotobikeBrand = (brand) => getOption(motobikeBrandOptions, brand);
const getCarBrand = (brand) => getOption(carBrandOptions, brand);

export {
  vehicleTypes,
  vehicleTypeOptions,
  motobikeBrands,
  motobikeBrandOptions,
  carBrands,
  carBrandOptions,
  getOption,
  getVehicleType,
  getMotobikeBrand,
  getCarBrand,
};
