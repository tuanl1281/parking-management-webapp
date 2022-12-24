import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Modal } from 'semantic-ui-react';

import { useDispatch } from 'react-redux';

const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;

const ImageRecognition = styled.div`
  position: relative;
`;

const Image = styled.div`
  width: ${((props) => `${props?.width}px`)};
  height: ${((props) => `${props?.height}px`)};
  margin: 0 auto;
  background: url(${((props) => props?.url)}) no-repeat;
  background-size: cover;
`;

const Plate = styled.div`
  position: a
`;

const VehicleLogImageModal = ({ data, onClose }) => {
  const dispatch = useDispatch();
  return (
    <Modal basic size="large" open={Boolean(data?.id)} onClose={onClose}>
      <Modal.Content>
        <ImageRecognition>
          <Image url={data?.imageRecognition} height={IMAGE_HEIGHT} width={IMAGE_WIDTH} />
          <Plate />
        </ImageRecognition>
      </Modal.Content>
    </Modal>
  );
};

VehicleLogImageModal.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    imageRecognition: PropTypes.string,
  }),
  onClose: PropTypes.func,
};

VehicleLogImageModal.defaultProps = {
  data: null,
  onClose: () => {},
};

export default VehicleLogImageModal;
