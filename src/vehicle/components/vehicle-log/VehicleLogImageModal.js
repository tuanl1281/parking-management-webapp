/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Modal } from 'semantic-ui-react';
import { formatLicenseNumber } from 'vehicle/utils/helpers';

const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;

const ImageRecognition = styled.div`
  width: ${((props) => `${props?.width}px`)};
  height: ${((props) => `${props?.height}px`)};
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const BoudingBox = styled.div`
  position: absolute;
  top: ${(props) => `${props?.x ?? 0}px`};
  left: ${(props) => `${props?.y ?? 0}px`};
  width: ${(props) => `${props?.width ?? 0}px`};
  height: ${(props) => `${props?.height ?? 0}px`};
  display: flex;
  flex-direction: column;

  & .description {
    height: 24px;
    width: ${(props) => `${props?.width ?? 0}px`};
    background-color: black;
    & .content {
      display: ${(props) => props?.x ? 'block' : 'none'};
      text-align: center;
      &::before {
        color: white;
        font-weight: 700;
        text-transform: uppercase;
        content: '${(props) => `${props?.content}`}';
      }
    }
  }

  & .bounding {
    width: 100%;
    height: 100%;
    border: 3px solid black;
    border-top: 1px solid black;
  }
`;

const VehicleLogImageModal = ({ data, onClose }) => {
  const [imageNatualHeight, setImageNatualHeight] = useState(0);
  const [imageNatualWidth, setImageNatualWidth] = useState(0);

  const { x, y, boxWidth, boxHeight } = useMemo(() => {
    const result = { x: 0, y: 0, boxWidth: 0, boxHeight: 0 };
    if (!data?.id || !data?.imageRecognition || !data?.coordinate || imageNatualHeight === 0 || imageNatualWidth === 0) {
      return result;
    }

    const coordinate = JSON.parse(data.coordinate);

    let height = 0;
    let width = 0;
    const ratio = IMAGE_WIDTH / IMAGE_HEIGHT;
    const naturalRatio = imageNatualWidth / imageNatualHeight;

    if (ratio < naturalRatio) {
      width = IMAGE_WIDTH;
      height = IMAGE_HEIGHT / ratio;
    } else {
      width = IMAGE_WIDTH * ratio;
      height = IMAGE_HEIGHT;
    }

    result.x = (coordinate.minimumHorizontal * (height / imageNatualHeight)) + ((IMAGE_HEIGHT - height) / 2) - 24;
    result.y = (coordinate.minimumVertical * (width / imageNatualWidth)) + ((IMAGE_WIDTH - width) / 2);

    result.boxHeight = ((coordinate.maximumHorizontal - coordinate.minimumHorizontal) * (height / imageNatualHeight)) + 24;
    result.boxWidth = (coordinate.maximumVertical - coordinate.minimumVertical) * (width / imageNatualWidth);

    return result;
  }, [data, imageNatualHeight, imageNatualWidth]);

  return (
    <Modal basic size="large" open={Boolean(data?.id)} onClose={onClose}>
      <Modal.Content>
        <ImageRecognition height={IMAGE_HEIGHT} width={IMAGE_WIDTH}>
          <Image
            src={data?.imageRecognition}
            onLoad={(event) => {
              setImageNatualHeight(event.target.naturalHeight);
              setImageNatualWidth(event.target.naturalWidth);
            }}
          />
          <BoudingBox
            x={x}
            y={y}
            width={boxWidth}
            height={boxHeight}
            content={formatLicenseNumber(data?.licenseNumber)}
          >
            <div className="description">
              <div className="content" />
            </div>
            <div className="bounding" />
          </BoudingBox>
        </ImageRecognition>
      </Modal.Content>
    </Modal>
  );
};

VehicleLogImageModal.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    coordinate: PropTypes.string,
    licenseNumber: PropTypes.string,
    imageRecognition: PropTypes.string,
  }),
  onClose: PropTypes.func,
};

VehicleLogImageModal.defaultProps = {
  data: null,
  onClose: () => {},
};

export default VehicleLogImageModal;
