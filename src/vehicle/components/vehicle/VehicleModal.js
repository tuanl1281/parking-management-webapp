import React, { useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Dimmer, Loader, Modal, Form, Input, Select, Button } from 'semantic-ui-react';

import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { carBrandOptions, formatLicenseNumber, motorcycleBrandOptions, vehicleTypeOptions } from 'vehicle/utils/helpers';
import { VEHICLE_TYPE } from 'vehicle/utils/constants';
import { createVehicle, updateVehicle } from 'vehicle/actions/vehicle';

const Wrapper = styled.div`
  position: relative;
`;

const VehicleModal = ({ open, data, onRefresh, onClose: onCloseProps }) => {
  const dispatch = useDispatch();
  const { errors, control, watch, reset, handleSubmit } = useForm();
  const { createVehicleLoading, updateVehicleLoading } = useSelector((_) => _.vehicle);

  const loading = createVehicleLoading || updateVehicleLoading;

  const vehicleType = watch('type');
  const defaultValue = useMemo(() => ({
    type: vehicleTypeOptions[0].value,
    branch:
      vehicleType === VEHICLE_TYPE.CAR
      ? carBrandOptions[0].value
      : vehicleType === VEHICLE_TYPE.motorcycle
        ? motorcycleBrandOptions[0].value
        : motorcycleBrandOptions[0].value,
    licenseNumber: undefined,
  }), [vehicleType]);

  const rules = useMemo(() => ({
    branch: {
      required: true,
    },
    licenseNumber: {
      required: true,
    },
  }), []);

  const format = (values) => ({ ...values });

  const onClose = () => {
    reset({});
    onCloseProps();
    onRefresh();
  };

  const onSubmit = useCallback(async (values) => {
    try {
      await dispatch(
        data?.id
        ? updateVehicle(format({ ...values, id: data.id, cusomterId: data?.customer?.id }))
        : createVehicle(format(values)),
      );

      onClose();
    // eslint-disable-next-line no-empty
    } catch (exception) {}
  }, [data, onClose]);

  useEffect(() => {
    reset(data?.id ? data : {});
  }, [data]);

  return (
    <Modal open={open || Boolean(data?.id)} onClose={onClose}>
      <Modal.Header>
        {data?.id ? formatLicenseNumber(data?.licenseNumber) : 'Tạo'}
      </Modal.Header>
      <Modal.Content>
        <Wrapper>
          <Dimmer inverted active={loading}>
            <Loader />
          </Dimmer>

          <Form>
            <Form.Group widths="equal">
              <Controller
                name="type"
                control={control}
                rules={rules.type}
                defaultValue={defaultValue.type}
                render={({ value, onChange, onBlur }) => (
                  <Form.Field
                    fluid
                    required
                    label="Loại phương tiện"
                    control={Select}
                    options={vehicleTypeOptions}
                    value={value}
                    onChange={(_, { value: v }) => onChange(v)}
                    onBlur={onBlur}
                    error={errors?.type && `${errors?.type?.message !== '' ? errors.type.message : 'Bắt buộc'}`}
                  />
                )}
              />
              <Controller
                name="brand"
                control={control}
                rules={rules.brand}
                defaultValue={defaultValue.brand}
                render={({ value, onChange, onBlur }) => (
                  <Form.Field
                    fluid
                    required
                    label="Đơn vị sản xuất phương tiện"
                    control={Select}
                    options={
                      watch('type') === VEHICLE_TYPE.CAR
                      ? carBrandOptions
                      : watch('type') === VEHICLE_TYPE.motorcycle
                        ? motorcycleBrandOptions
                        : motorcycleBrandOptions
                    }
                    value={value}
                    onChange={(_, { value: v }) => onChange(v)}
                    onBlur={onBlur}
                    error={errors?.brand && `${errors?.brand?.message !== '' ? errors.brand.message : 'Bắt buộc'}`}
                  />
                )}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Controller
                name="licenseNumber"
                control={control}
                rules={rules.licenseNumber}
                defaultValue={defaultValue.licenseNumber}
                render={({ value, onChange, onBlur }) => (
                  <Form.Field
                    fluid
                    required
                    label="Biển số đăng kí"
                    control={Input}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors?.licenseNumber && `${errors?.licenseNumber?.message !== '' ? errors.licenseNumber.message : 'Bắt buộc'}`}
                  />
                )}
              />
            </Form.Group>
          </Form>
        </Wrapper>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
        />
        <Button
          negative
          labelPosition="right"
          icon="x"
          content="Đóng"
          disabled={loading}
          onClick={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
};

VehicleModal.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    licenseNumber: PropTypes.string,
    customer: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

VehicleModal.defaultProps = {
  open: false,
  data: null,
  onRefresh: () => {},
  onClose: () => {},
};

export default VehicleModal;
