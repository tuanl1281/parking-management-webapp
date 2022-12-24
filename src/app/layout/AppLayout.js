/* eslint-disable import/no-cycle */
import React from 'react';
import PropTypes from 'prop-types';

import DesktopContainer from 'app/layout/DesktopContainer';
import BreadCrumb from 'app/layout/BreadCrumb';

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

ResponsiveContainer.defaultProps = {
  children: null,
};

const AppLayout = (props) => {
  const { children, breadcrumb } = props;

  return (
    <>
      <ResponsiveContainer>
        <div style={{ padding: '4.5em 1.5em 1.5em 1.5em' }}>
          {breadcrumb && <BreadCrumb />}
          {children}
        </div>
      </ResponsiveContainer>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  breadcrumb: PropTypes.bool,
};

AppLayout.defaultProps = {
  breadcrumb: false,
};

export default AppLayout;
