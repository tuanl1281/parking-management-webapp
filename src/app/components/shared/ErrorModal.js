import React from 'react';
import { Modal, Button, Grid } from 'semantic-ui-react';
import { FiX } from 'react-icons/fi';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { showErrorModal } from 'app/actions/global';

const StyledIconWrapper = styled.span`
  line-height: 0;
  margin-right: 8px;
  font-size: 20px;
  vertical-align: middle;
`;
const Message = styled.p`
  font-family: Arial, Helvetica, sans-serif;
  white-space: break-spaces;
  font-size: 30px;
`;

const ErrorModal = () => {
  const dispatch = useDispatch();
  const { errorHeader, errorSuccessList, errorFailLogs } = useSelector(
    (state) => state.global,
  );

  return (
    <Modal basic open={Boolean(errorHeader)}>
      <Modal.Header>{errorHeader}</Modal.Header>
      <Modal.Content>
        <Message>Thành công: {errorSuccessList}</Message>
        <Message>Lỗi: {errorFailLogs?.length ?? 0}</Message>
        {errorFailLogs.map((e) => (
          <Grid.Column key={e}>{e}</Grid.Column>
        ))}
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          inverted
          color="red"
          content="Đóng"
          icon={
            <StyledIconWrapper>
              <FiX />
            </StyledIconWrapper>
          }
          onClick={() => dispatch(showErrorModal('', '', []))}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ErrorModal;
