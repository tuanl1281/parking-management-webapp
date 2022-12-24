import React, { useMemo, useCallback } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import AppRoute from 'app/routes/AppRoute';

import componentTree from 'app/utils/component-tree';

const AppRouter = () => {
  const singleRoute = useCallback(({ path, exact, component, breadcrumb, layout, isPrivate, isDeveloping }) => (
    <AppRoute
      key={path || '404'}
      path={path}
      exact={exact}
      component={component}
      layout={layout}
      isPrivate={isPrivate}
      isDeveloping={isDeveloping}
      breadcrumb={breadcrumb}
    />
  ), []);

  const multipleRoute = useCallback((routes) =>
    routes.map((route) => {
      if (route?.childrenList && route.childrenList.length > 0) {
        return multipleRoute(route.childrenList);
      }
      return singleRoute(route);
    }), [singleRoute]);

  const appRoute = useMemo(() =>
    componentTree.map((component) => {
      if (component?.childrenList && component.childrenList.length > 0) {
        return multipleRoute(component.childrenList);
      }
      return singleRoute(component);
    }), [singleRoute, multipleRoute]);

  return (
    <BrowserRouter>
      <Switch>{appRoute}</Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
