import React, { useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Dimmer, Loader, Modal, Form, Input, Select, Button } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { showUploadModal } from 'app/actions/global';
import { addVehicleToCustomer } from 'customer/actions/customer';
import { carBrandOptions, motorcycleBrandOptions, vehicleTypeOptions } from 'vehicle/utils/helpers';
import { VEHICLE_TYPE } from 'vehicle/utils/constants';
import { identifyVehicle } from 'vehicle/actions/vehicle';

const Wrapper = styled.div`
  position: relative;
`;

const CustomerVehicleModal = ({ open, onRefresh, onChange: onChangeProps, onClose: onCloseProps }) => {
  const dispatch = useDispatch();
  const { control, errors, reset, watch, setValue, handleSubmit } = useForm();
  const { selectedCustomer, addVehicleToCustomerLoading } = useSelector((_) => _.customer);

  const loading = addVehicleToCustomerLoading;

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

  const format = (values) => ({ ...values, name: '' });
  const formatRegcognitionLicenseNumber = (file) => {
    const payload = new FormData();
    payload.append('file', file);
    payload.append('isLog', false);

    return payload;
  };

  const onRegconitionLicenseNumber = useCallback(async (file) => {
    if (!file?.name) {
      return;
    }

    try {
      const response = await dispatch(identifyVehicle(formatRegcognitionLicenseNumber(file)));
      if ((response?.data ?? []).length > 0) {
        setValue('licenseNumber', response.data.shift());
      }
      // eslint-disable-next-line no-empty
    } catch (exception) {}
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
        ????ng k?? ph????ng ti???n giao th??ng
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
                    label="Lo???i ph????ng ti???n"
                    control={Select}
                    options={vehicleTypeOptions}
                    value={value}
                    onChange={(_, { value: v }) => onChange(v)}
                    onBlur={onBlur}
                    error={errors?.type && `${errors?.type?.message !== '' ? errors.type.message : 'B???t bu???c'}`}
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
                    label="????n v??? s???n xu???t ph????ng ti???n"
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
                    error={errors?.brand && `${errors?.brand?.message !== '' ? errors.brand.message : 'B???t bu???c'}`}
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
                    label="Bi???n s??? ????ng k??"
                    control={Input}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors?.licenseNumber && `${errors?.licenseNumber?.message !== '' ? errors.licenseNumber.message : 'B???t bu???c'}`}
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
          content="X??c nh???n"
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
        />
        <Button
          negative
          labelPosition="right"
          icon="x"
          content="????ng"
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
