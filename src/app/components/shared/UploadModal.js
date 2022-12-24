import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { Dimmer, Loader, Icon, Modal, Message, Button } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { showUploadModal } from 'app/actions/global';

const Wrapper = styled.div`
  position: relative;
`;

const UploadModal = () => {
  const inputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

  const dispatch = useDispatch();
  const {
    uploadHeader,
    uploadContent,
    uploadCallback,
    uploadLoading,
  } = useSelector((_) => _.global);

  const loading = uploadLoading;

  const onClose = useCallback(() => {
    dispatch(showUploadModal(null, null, null));
    setSelectedFile(null);
  }, [dispatch]);

  const onSubmit = useCallback(async () => {
    if (!selectedFile?.name) {
      return;
    }

    try {
      if (uploadCallback) {
        await uploadCallback(selectedFile);
      }
      onClose();
    // eslint-disable-next-line no-empty
    } catch (exception) {}
  }, [selectedFile]);
  useEffect(() => { onSubmit(); }, [onSubmit]);

  return (
    <Modal open={Boolean(uploadCallback)} onClose={onClose}>
      <Modal.Header>{uploadHeader || 'Tải lên'}</Modal.Header>
      <Modal.Content>
        <Wrapper>
          <Dimmer inverted active={loading}>
            <Loader />
          </Dimmer>

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
            {selectedFile ? <span style={{ marginLeft: '10px', fontWeight: '700' }}>{selectedFile.name}</span> : null}
          </div>
          {typeof uploadContent === 'string' && (
          <>
            <Message info icon>
              <Icon name="info" />
              <Message.Content>
                <Message.Header>Thông tin</Message.Header>
                {uploadContent}
              </Message.Content>
            </Message>
          </>
          )}
          <input
            hidden
            type="file"
            ref={inputRef}
            onChange={(e) => {
              setSelectedFile(e.target.files[0]);
            }}
          />
        </Wrapper>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          disabled={loading}
          onClick={onSubmit}
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

export default UploadModal;
