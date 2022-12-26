import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { Grid, Tab as TabSUI, Segment, Dimmer, Loader, Modal, Form, Header, Icon, Select, Button } from 'semantic-ui-react';
import VehicleLogStatisticTable from 'dashboard/components/vehicle-log/VehicleLogStatisticTable';

import { useDispatch, useSelector } from 'react-redux';
import { getCameras } from 'setting/actions/camera';
import { defaultPayload } from 'app/utils/helpers';
import { identifyVehicle } from 'vehicle/actions/vehicle';
import { useQueryString } from 'app/hooks';
import { getVehicleLogStatistics } from 'dashboard/actions/statistic';
import { formatSystemDate } from 'app/utils/time-utils';

const Wrapper = styled.div`
  padding: 3.5em 6em;
`;

const Tab = styled(TabSUI)`
  .fuGbBC {
    > .segment {
      margin: 0;
      padding: 0;
      border: none;
      box-shadow: none;
    }
  }
`;

const Stream = styled(Segment)`
  height: 760px;
  background: #FFFFFF !important;
`;

const VehicleLogStatisticMenu = () => {
  const inputRef = useRef(null);
  const [identifyImage, setIdentifyImage] = useState(false);
  const [selectedImage, setSeletedImage] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(undefined);

  const dispatch = useDispatch();
  const [filter, setFilter] = useQueryString();
  const { identifyVehicleLoading } = useSelector((_) => _.vehicle);
  const { cameraList, getCamerasLoading } = useSelector((_) => _.camera);

  // #region camera
  const cameraOptions = useMemo(() =>
    (cameraList?.data ?? [])
      .map((camera) => ({
        key: camera.id,
        value: camera.id,
        text: camera.name,
        content: camera.name,
        detail: camera,
      })),
  [cameraList]);

  useEffect(() => {
    if ((cameraList?.data ?? []).length === 0) {
      dispatch(getCameras(defaultPayload));
    }
  }, [cameraList]);
  // #endregion

  const loading = identifyVehicleLoading;

  const panes = useMemo(() => ([
    {
      menuItem: 'Lịch sử',
      render: () => (
        <Tab.Pane>
          <VehicleLogStatisticTable />
        </Tab.Pane>
      ),
    },
  ]), []);

  const format = useCallback((values) => {
    const payload = new FormData();
    payload.append('file', values?.file);
    payload.append('cameraId', values?.cameraId);
    payload.append('isLog', values?.isLog);

    return payload;
  }, []);

  const onSubmit = useCallback(async () => {
    if (!selectedImage?.name || !selectedCamera?.id) {
      return;
    }

    try {
      await dispatch(identifyVehicle(format({ file: selectedImage, cameraId: selectedCamera?.id, isLog: true })));
      if (filter?.pageIndex !== '0') {
        setFilter({ pageIndex: 0, pageSize: 10 });
      } else {
        dispatch(getVehicleLogStatistics({
          ...filter,
          fromDate: formatSystemDate(moment().startOf('month')),
          toDate: formatSystemDate(moment().endOf('month')),
          pageIndex: 0,
          pageSize: 10,
        }));
      }
      setIdentifyImage(false);
      setSeletedImage(null);
      setSelectedCamera(undefined);
    // eslint-disable-next-line no-empty
    } catch (exception) {}
  }, [dispatch, selectedImage, selectedCamera]);

  return (
    <>
      <Wrapper>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Stream placeholder>
                <Header icon>
                  <Icon name="camera" />
                  Không có thiết bị nào đang hoạt động
                </Header>
                <Button primary onClick={() => setIdentifyImage(true)}>Tải ảnh</Button>
              </Stream>
            </Grid.Column>
            <Grid.Column width={6}>
              <Tab panes={panes} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Wrapper>

      <Modal open={identifyImage} onClose={() => setIdentifyImage(false)}>
        <Modal.Header>Tải ảnh</Modal.Header>
        <Modal.Content>
          <div style={{ position: 'relative' }}>
            <Dimmer inverted active={loading}>
              <Loader />
            </Dimmer>

            <Form>
              <Form.Group widths="equal">
                <Form.Field
                  fluid
                  required
                  label="Thiết bị"
                  loading={getCamerasLoading}
                  control={Select}
                  options={cameraOptions}
                  value={selectedCamera?.id}
                  onChange={(_, { value: v }) => setSelectedCamera(cameraOptions.find((__) => __.key === v)?.detail)}
                />
              </Form.Group>
            </Form>
            <div>
              <Button
                icon="upload"
                labelPosition="right"
                color="green"
                content="Chọn File"
                onClick={() => {
                  inputRef.current.click();
                }}
              />
              {selectedImage ? <span style={{ marginLeft: '10px', fontWeight: '700' }}>{selectedImage.name}</span> : null}
            </div>
            <input
              hidden
              type="file"
              ref={inputRef}
              onChange={(e) => {
                setSeletedImage(e.target.files[0]);
              }}
            />
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content="Xác nhận"
            disabled={loading}
            onClick={() => onSubmit()}
          />
          <Button
            negative
            labelPosition="right"
            icon="x"
            content="Đóng"
            disabled={loading}
            onClick={() => setIdentifyImage(false)}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};
export default VehicleLogStatisticMenu;
