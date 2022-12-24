import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Dimmer, Loader, Card, Statistic } from 'semantic-ui-react';

const Wrapper = styled.div`
  position: relative;

  & .statistic {
    margin: 0 !important;
  }
`;

const CardChart = ({ loading, color, height, label, value }) => (
  <Card color={color} style={{ height: height || '202px' }}>
    <Card.Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Wrapper>
        <Dimmer inverted active={loading}>
          <Loader />
        </Dimmer>
        <Statistic size="large" color={color}>
          <Statistic.Label>{label}</Statistic.Label>
          <Statistic.Value>
            {typeof value !== 'undefined'
              ? typeof value === 'function'
                ? value()
                : value
              : 0
            }
          </Statistic.Value>
        </Statistic>
      </Wrapper>
    </Card.Content>
  </Card>
);

CardChart.propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.string,
  height: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func]),
};

CardChart.defaultProps = {
  loading: false,
  color: 'grey',
  height: '202px',
  label: '',
  value: '',
};

export default CardChart;
