import React, { useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Dimmer, Loader, Modal, Form, Input, Select, Button } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { showUploadModal } from 'app/actions/global';
import { addVehicleToCustomer } from 'customer/actions/customer';
import { carBrandOptions, motobikeBrandOptions, vehicleTypeOptions } from 'vehicle/utils/helpers';
import { VEHICLE_TYPE } from 'vehicle/utils/constants';

const Wrapper = styled.div`
  position: relative;
`;

const CustomerVehicleModal = ({ open, onRefresh, onChange: onChangeProps, onClose: onCloseProps }) => {
  const dispatch = useDispatch();
  const { control, errors, reset, watch, handleSubmit } = useForm();
  const { selectedCustomer, addVehicleToCustomerLoading } = useSelector((_) => _.customer);

  const loading = addVehicleToCustomerLoading;

  const vehicleType = watch('type');
  const defaultValue = useMemo(() => ({
    type: vehicleTypeOptions[0].value,
    branch:
      vehicleType === VEHICLE_TYPE.CAR
      ? carBrandOptions[0].value
      : vehicleType === VEHICLE_TYPE.MOTOBIKE
        ? motobikeBrandOptions[0].value
        : motobikeBrandOptions[0].value,
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

  const format = (values) => ({ ...values, name: '' });

  const onRegconitionLicenseNumber = useCallback(() => {
  }, [dispatch]);

  const onClose = useCallback(() => {
    if (selectedCustomer?.id) {
      onRefresh();
    }

    onCloseProps();
    reset({});
  }, [selectedCustomer, reset, onRefresh, onCloseProps]);

  const onSubmit = useCallback(async (values) => {
    try {
      if (!selectedCustomer?.id) {
        onChangeProps({
          ...format(values),
          id: uuidv4(),
        });
      } else {
        await dispatch(addVehicleToCustomer(selectedCustomer.id, [format(values)]));
      }

      onClose();
    // eslint-disable-next-line no-empty
    } catch (exception) {}
  }, [selectedCustomer, onClose]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        Đăng kí phương tiện giao thông
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
                      : watch('type') === VEHICLE_TYPE.MOTOBIKE
                        ? motobikeBrandOptions
                        : motobikeBrandOptions
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
                    action={{
                      basic: true,
                      icon: 'camera',
                      onClick: () => dispatch(showUploadModal(null, null, (file) => onRegconitionLicenseNumber(file))),
                    }}
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

CustomerVehicleModal.propTypes = {
  open: PropTypes.bool,
  onChange: PropTypes.func,
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

CustomerVehicleModal.defaultProps = {
  open: false,
  onChange: () => {},
  onRefresh: () => {},
  onClose: () => {},
};

export default CustomerVehicleModal;
