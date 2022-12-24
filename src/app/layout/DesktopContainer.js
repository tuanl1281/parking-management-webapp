import React from 'react';
import PropTypes from 'prop-types';
import { Visibility } from 'semantic-ui-react';
// eslint-disable-next-line import/no-cycle
import TopBar from 'app/layout/TopBar';

const DesktopContainer = ({ children }) => (
  <>
    <Visibility once={false}>
      <TopBar />
    </Visibility>
    {children}
  </>
);

DesktopContainer.propTypes = {
  children: PropTypes.node,
};

DesktopContainer.defaultProps = {
  children: null,
};

export default DesktopContainer;
