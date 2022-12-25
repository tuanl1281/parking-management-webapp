import React, { useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Dimmer, Form, Loader, Modal, Input, Button, TextArea } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { createSite, updateSite } from 'setting/actions/site';

const Wrapper = styled.div`
  position: relative;
`;

const SiteModal = ({ open, data, onRefresh, onClose: onCloseProps }) => {
  const dispatch = useDispatch();
  const { errors, control, reset, handleSubmit } = useForm();
  const { createSiteLoading, updateSiteLoading } = useSelector((_) => _.site);

  const loading =
    createSiteLoading ||
    updateSiteLoading;

  const defaultValue = useMemo(() => ({
    name: undefined,
    address: undefined,
    fee: 0,
  }), []);

  const rules = useMemo(() => ({
    name: {
      required: true,
    },
    address: {
      required: true,
    },
    fee: {
      required: true,
    },
  }), []);

  const format = (values) => ({ ...values, fee: parseInt(values?.fee ?? 0, 10) });

  const onClose = () => {
    reset({});
    onCloseProps();
    onRefresh();
  };

  const onSubmit = useCallback(async (values) => {
    try {
      await dispatch(
        data?.id
        ? updateSite(format({ ...values, id: data.id }))
        : createSite(format(values)),
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
        {data?.id ? data?.name : 'Tạo'}
      </Modal.Header>
      <Modal.Content>
        <Wrapper>
          <Dimmer inverted active={loading}>
            <Loader />
          </Dimmer>

          <Form>
            <Form.Group widths="equal">
              <Controller
                name="name"
                control={control}
                rules={rules.name}
                defaultValue={defaultValue.name}
                render={({ value, onChange, onBlur }) => (
                  <Form.Field
                    fluid
                    required
                    label="Tên"
                    control={Input}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors?.name && `${errors?.name?.message !== '' ? errors.name.message : 'Bắt buộc'}`}
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
            <Form.Group widths="equal">
              <Controller
                name="fee"
                control={control}
                rules={rules.fee}
                defaultValue={defaultValue.fee}
                render={({ value, onChange, onBlur }) => (
                  <Form.Field
                    fluid
                    required
                    type="number"
                    label="Phí"
                    control={Input}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors?.fee && `${errors?.fee?.message !== '' ? errors.fee.message : 'Bắt buộc'}`}
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

SiteModal.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

SiteModal.defaultProps = {
  open: false,
  data: null,
  onRefresh: () => {},
  onClose: () => {},
};

export default SiteModal;
