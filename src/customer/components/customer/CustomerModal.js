import React, { useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Dimmer, Form, Loader, Modal, /* Label, */ Input, Button, TextArea } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { createCustomer, updateCustomer } from 'customer/actions/customer';
import { formatName } from 'customer/utils/helpers';

const Wrapper = styled.div`
  position: relative;
`;

// const Ribbon = styled(Label)`
//   left: calc(-1rem - 1.725em) !important;
//   margin-bottom: 1rem !important;
// `;

const CustomerModal = ({ open, data, onRefresh, onClose: onCloseProps }) => {
  const dispatch = useDispatch();
  const { errors, control, reset, handleSubmit } = useForm();
  const { createCustomerLoading, updateCustomerLoading } = useSelector((_) => _.customer);

  const loading =
    createCustomerLoading ||
    updateCustomerLoading;

  const defaultValue = useMemo(() => ({
    firstName: undefined,
    lastName: undefined,
    phoneNumber: undefined,
    address: undefined,
    vehicles: [],
  }), []);

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
        ? updateCustomer(format({ ...values, id: data.id }))
        : createCustomer(format(values)),
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
        {data?.id ? formatName({ ...data }) : 'T???o'}
      </Modal.Header>
      <Modal.Content>
        <Wrapper>
          <Dimmer inverted active={loading}>
            <Loader />
          </Dimmer>

          {/* {!data?.id && <Ribbon ribbon size="large" color="green" content="Th??ng tin" />} */}
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
                    label="T??n"
                    control={Input}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors?.firstName && `${errors?.firstName?.message !== '' ? errors.firstName.message : 'B???t bu???c'}`}
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
                    label="H???"
                    control={Input}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors?.lastName && `${errors?.lastName?.message !== '' ? errors.lastName.message : 'B???t bu???c'}`}
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
                    label="S??? ??i???n tho???i"
                    control={Input}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors?.phoneNumber && `${errors?.phoneNumber?.message !== '' ? errors.phoneNumber.message : 'B???t bu???c'}`}
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
                    label="?????a ch???"
                    control={TextArea}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors?.address && `${errors?.address?.message !== '' ? errors.address.message : 'B???t bu???c'}`}
                  />
                )}
              />
            </Form.Group>
          </Form>

          {/* {!data?.id && (
            <>
              <Ribbon ribbon size="large" color="blue" content="Ph????ng ti???n giao th??ng" />
            </>
          )} */}
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

CustomerModal.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

CustomerModal.defaultProps = {
  open: false,
  data: null,
  onRefresh: () => {},
  onClose: () => {},
};

export default CustomerModal;
