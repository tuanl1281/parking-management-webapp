import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PopupText from './PopupText';

const Label = styled.p`
  font-size: 13px;
  margin-bottom: 6px;
  margin-right: 6px;
  float: left;
`;
const Content = styled.p`
  & span {
    font-size: 16px;
    font-weight: bold;
  }
  margin-top: -3px !important;
  margin-bottom: 0 !important;
`;

const InfoRow = (props) => {
  const { label, content } = props;
  return (
    <div style={{ overflow: 'hidden' }}>
      <Label>{`${label}:`}</Label>
      <Content>
        <PopupText content={content || '...'} />
      </Content>
    </div>
  );
};

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default React.memo(InfoRow);
