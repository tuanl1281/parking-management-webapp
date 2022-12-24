import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import DevelopmentPage from 'app/pages/DevelopmentPage';

import { useAuth } from 'app/hooks';
import { isDev } from 'app/utils/api-links';

const AppRoute = (props) => {
  const { component: Component, layout: Layout, path, exact, isPrivate, isDeveloping, breadcrumb } = props;

  const { isAuthenticated } = useAuth();
  const isAuth = useMemo(() => isAuthenticated(), [isAuthenticated]);

  return (
    <Route
      path={path}
      exact={exact}
      render={(componentProps) => {
        if (isDeveloping && !isDev) {
        // if (isDeveloping) {
          return <DevelopmentPage />;
        }
        if ((isPrivate && isAuth) || !isPrivate) {
          if (Layout) {
            return (
              <Layout breadcrumb={breadcrumb}>
                <Component location={componentProps.location} history={componentProps.history} />
              </Layout>
            );
          }
          return <Component location={componentProps.location} history={componentProps.history} />;
        }
        return (
          <Redirect
            to={{
              pathname: '/',
              state: {
                from: componentProps.location,
              },
            }}
          />
        );
      }}
    />
  );
};

AppRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  layout: PropTypes.elementType,
  path: PropTypes.string,
  exact: PropTypes.bool,
  isPrivate: PropTypes.bool,
  isDeveloping: PropTypes.bool,
  breadcrumb: PropTypes.bool,
};

AppRoute.defaultProps = {
  layout: null,
  path: null,
  exact: false,
  isPrivate: false,
  isDeveloping: false,
  breadcrumb: false,
};

export default AppRoute;
