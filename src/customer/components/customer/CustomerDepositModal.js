import React, { useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Dimmer, Form, Loader, Modal, Input, Button } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { depositCustomer } from 'customer/actions/customer';

const Wrapper = styled.div`
  position: relative;
`;

const CustomerDepositModal = ({ open, data, onRefresh, onClose: onCloseProps }) => {
  const dispatch = useDispatch();
  const { errors, control, reset, handleSubmit } = useForm();
  const { depositCustomerLoading } = useSelector((_) => _.customer);

  const loading = depositCustomerLoading;

  const defaultValue = useMemo(() => ({
    amount: 0,
  }), []);

  const rules = useMemo(() => ({
    amount: {
      required: true,
    },
  }), []);

  const format = (values) => ({
    ...values,
    amount: parseInt(values?.amount ?? 0, 10),
    description: 'Nạp tiền',
  });

  const onClose = () => {
    reset({});
    onCloseProps();
    onRefresh();
  };

  const onSubmit = useCallback(async (values) => {
    if (!data?.id) {
      return;
    }

    try {
      await dispatch(depositCustomer(data.id, format(values)));

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
        Nạp tiền
      </Modal.Header>
      <Modal.Content>
        <Wrapper>
          <Dimmer inverted active={loading}>
            <Loader />
          </Dimmer>

          <Form>
            <Form.Group widths="equal">
              <Controller
                name="amount"
                control={control}
                rules={rules.amount}
                defaultValue={defaultValue.amount}
                render={({ value, onChange, onBlur }) => (
                  <Form.Field
                    fluid
                    required
                    type="number"
                    label="Số tiền"
                    control={Input}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors?.amount && `${errors?.amount?.message !== '' ? errors.amount.message : 'Bắt buộc'}`}
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

CustomerDepositModal.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

CustomerDepositModal.defaultProps = {
  open: false,
  data: null,
  onRefresh: () => {},
  onClose: () => {},
};

export default CustomerDepositModal;
