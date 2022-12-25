import React, { useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Dimmer, Loader, Modal, Form, Input, Button } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { addCameraToSite } from 'setting/actions/site';

const Wrapper = styled.div`
  position: relative;
`;

const CameraModal = ({ open, onRefresh, onChange: onChangeProps, onClose: onCloseProps }) => {
  const dispatch = useDispatch();
  const { control, errors, reset, watch, handleSubmit } = useForm();
  const { selectedSite, addCameraToSiteLoading } = useSelector((_) => _.site);

  const loading = addCameraToSiteLoading;

  const vehicleType = watch('type');
  const defaultValue = useMemo(() => ({
    name: undefined,
  }), [vehicleType]);

  const rules = useMemo(() => ({
    name: {
      required: true,
    },
  }), []);

  const format = (values) => ({ ...values });

  const onClose = useCallback(() => {
    if (selectedSite?.id) {
      onRefresh();
    }

    onCloseProps();
    reset({});
  }, [selectedSite, reset, onRefresh, onCloseProps]);

  const onSubmit = useCallback(async (values) => {
    try {
      if (!selectedSite?.id) {
        onChangeProps({
          ...format(values),
          id: uuidv4(),
        });
      } else {
        await dispatch(addCameraToSite(selectedSite.id, [format(values)]));
      }

      onClose();
    // eslint-disable-next-line no-empty
    } catch (exception) {}
  }, [selectedSite, onClose]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        Tạo
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

CameraModal.propTypes = {
  open: PropTypes.bool,
  onChange: PropTypes.func,
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

CameraModal.defaultProps = {
  open: false,
  onChange: () => {},
  onRefresh: () => {},
  onClose: () => {},
};

export default CameraModal;
