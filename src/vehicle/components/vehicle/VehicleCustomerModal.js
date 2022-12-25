import React, { useMemo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Dimmer, Form, Loader, Modal, Label, Input, TextArea, Select, Button } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { getCustomers, createCustomer } from 'customer/actions/customer';
import {
  carBrandOptions,
  motorcycleBrandOptions,
  vehicleTypeOptions,
  formatLicenseNumber,
} from 'vehicle/utils/helpers';
import { VEHICLE_TYPE } from 'vehicle/utils/constants';
import { defaultPaging } from 'app/utils/helpers';
import { formatName } from 'customer/utils/helpers';
import { updateVehicle } from 'vehicle/actions/vehicle';

const Wrapper = styled.div`
  position: relative;
`;

const Ribbon = styled(Label)`
  left: calc(-1rem - 1.725em) !important;
  margin-bottom: 1rem !important;
`;

const VehicleCustomerModal = ({ data, onRefresh, onClose: onCloseProps }) => {
  const [openSelectCustomer, setOpenSelectCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(false);

  const dispatch = useDispatch();
  const { errors, control, watch, reset, getValues, handleSubmit } = useForm();
  const {
    customerList,
    getCustomersLoading,
    createCustomerLoading,
  } = useSelector((_) => _.customer);
  const { updateVehicleLoading } = useSelector((_) => _.vehicle);

  // #region customer
  const customerOptions = useMemo(() =>
    (customerList?.data ?? [])
      .map((customer) => ({
        key: customer.id,
        value: customer.id,
        text: formatName(customer),
        content: formatName(customer),
        detail: customer,
      })),
  [customerList]);

  useEffect(() => {
    if ((customerList?.data ?? []).length === 0) {
      dispatch(getCustomers(defaultPaging));
    }
  }, [dispatch, customerList]);
  // #endregion

  const loading =
    createCustomerLoading ||
    updateVehicleLoading;

  const vehicleType = watch('type');
  const defaultValue = useMemo(() => ({
    firstName: undefined,
    lastName: undefined,
    phoneNumber: undefined,
    address: undefined,
    type: vehicleTypeOptions[1].value,
    branch:
      vehicleType === VEHICLE_TYPE.CAR
      ? carBrandOptions[0].value
      : vehicleType === VEHICLE_TYPE.motorcycle
        ? motorcycleBrandOptions[0].value
        : motorcycleBrandOptions[0].value,
    licenseNumber: undefined,
  }), [vehicleType]);

  const rules = useMemo(() => ({
    firstName: {
      required: true,
    },
    lastName: {
      required: true,
    },
    phoneNumber: {
      required: true,
    },
    address: {
      required: true,
    },
    type: {
      required: true,
    },
    branch: {
      required: true,
      validate: (value) => {
        if (!value) {
          return false;
        }
        return true;
      },
    },
    licenseNumber: {
      required: true,
    },
  }), []);

  const formatCustomer = (values) => ({
    firstName: values?.firstName,
    lastName: values?.lastName,
    phoneNumber: values?.phoneNumber,
    address: values?.address,
  });

  const formatVehicle = (values) => ({
    type: values?.type,
    brand: values?.brand,
    licenseNumber: values?.licenseNumber,
    customerId: values?.customerId,
  });

  const onClose = () => {
    reset({});
    setSelectedCustomer(undefined);
    onCloseProps();
    onRefresh();
  };

  const onSubmit = useCallback(async (values) => {
    try {
      let customerId = selectedCustomer?.id;
      if (!selectedCustomer?.id) {
        const response = await dispatch(createCustomer(formatCustomer(values)));
        customerId = response?.data;
      }

      if (customerId) {
        await dispatch(updateVehicle({
          ...formatVehicle({ ...values, customerId }),
          id: data?.id,
        }));
      }
      onClose();
    // eslint-disable-next-line no-empty
    } catch (exception) {}
  }, [data, selectedCustomer, onClose]);

  useEffect(() => {
    reset(data?.id ? data : {});
  }, [data]);

  return (
    <>
      <Modal open={Boolean(data?.id)} onClose={onClose}>
        <Modal.Header>
          {formatLicenseNumber(data?.licenseNumber)}
        </Modal.Header>
        <Modal.Content>
          <Wrapper>
            <Dimmer inverted active={loading}>
              <Loader />
            </Dimmer>

            <Ribbon ribbon size="large" color="green" content="Thông tin khách hàng" />
            <Form>
              <Form.Group widths="equal">
                <Controller
                  name="firstName"
                  control={control}
                  rules={rules.firstName}
                  defaultValue={defaultValue.firstName}
                  render={({ value, onChange, onBlur }) => (
                    <Form.Field
                      fluid
                      required
                      action={{
                        basic: true,
                        icon: 'pencil',
                        onClick: () => setOpenSelectCustomer(true),
                      }}
                      label="Tên"
                      control={Input}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={errors?.firstName && `${errors?.firstName?.message !== '' ? errors.firstName.message : 'Bắt buộc'}`}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  rules={rules.lastName}
                  defaultValue={defaultValue.lastName}
                  render={({ value, onChange, onBlur }) => (
                    <Form.Field
                      fluid
                      required
                      label="Họ"
                      control={Input}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={errors?.lastName && `${errors?.lastName?.message !== '' ? errors.lastName.message : 'Bắt buộc'}`}
                    />
                  )}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={rules.phoneNumber}
                  defaultValue={defaultValue.phoneNumber}
                  render={({ value, onChange, onBlur }) => (
                    <Form.Field
                      fluid
                      required
                      label="Số điện thoại"
                      control={Input}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={errors?.phoneNumber && `${errors?.phoneNumber?.message !== '' ? errors.phoneNumber.message : 'Bắt buộc'}`}
                    />
                  )}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Controller
                  name="address"
                  control={control}
                  rules={rules.address}
                  defaultValue={defaultValue.address}
                  render={({ value, onChange, onBlur }) => (
                    <Form.Field
                      fluid
                      required
                      label="Địa chỉ"
                      control={TextArea}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={errors?.address && `${errors?.address?.message !== '' ? errors.address.message : 'Bắt buộc'}`}
                    />
                  )}
                />
              </Form.Group>
            </Form>

            <Ribbon ribbon size="large" color="blue" content="Phương tiện giao thông" />
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
                      disabled
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

      <Modal open={openSelectCustomer} onClose={() => setOpenSelectCustomer(false)}>
        <Modal.Header>
          Khách hàng
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Field
                fluid
                loading={getCustomersLoading}
                control={Select}
                options={customerOptions}
                onChange={(_, { value }) => {
                  setSelectedCustomer(customerOptions.find((__) => __.key === value)?.detail);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content="Xác nhận"
            onClick={() => {
              setOpenSelectCustomer(false);
              reset({ ...getValues(), ...selectedCustomer });
            }}
          />
          <Button
            negative
            labelPosition="right"
            icon="x"
            content="Đóng"
            onClick={() => setOpenSelectCustomer(false)}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

VehicleCustomerModal.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    licenseNumber: PropTypes.string,
  }),
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

VehicleCustomerModal.defaultProps = {
  data: null,
  onRefresh: () => {},
  onClose: () => {},
};

export default VehicleCustomerModal;
