/* eslint-disable camelcase */
import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';

import { Breadcrumb } from 'semantic-ui-react';
// eslint-disable-next-line import/no-cycle
import componentTree from 'app/utils/component-tree';

const Wrapper = styled.div`
  padding-bottom: 1em;
`;

const Point = styled.span`
  color: #4183C4;
  font-weight: bold;
`;

const BreadCrumb = () => {
  const location = useLocation();

  const { pathname } = location;
  const findDirection = useCallback((components, path, direction = []) => {
    const result = components.map((component) => {
      if (component?.childrenList && component.childrenList.length > 0) {
        return findDirection(component.childrenList, path, [...direction, component.key]);
      }

      if (component?.path && component.path === path) {
        return [...direction, component.key];
      }

      return null;
    });

    return _.flatten(result).filter((__) => __);
  }, []);

  const jsx_breadcrumb = useCallback((components, direction) => components.map((component) => {
    if (component?.childrenList && component.childrenList.length > 0) {
      return (
        <React.Fragment key={`component_${component.key}`}>
          {(component?.key && direction === component.key) && (
            <>
              {component?.path ? (
                <Breadcrumb.Section as={Link} to={component.path}>
                  {component.title}
                </Breadcrumb.Section>
              ) : (
                <Breadcrumb.Section as={Point}>
                  {component.title}
                </Breadcrumb.Section>
              )}
              <Breadcrumb.Divider />
            </>
          )}
          {jsx_breadcrumb(component.childrenList, direction)}
        </React.Fragment>
      );
    }

    if (component?.key && direction.includes(component.key)) {
      return component.path === pathname
        ? (
          <Breadcrumb.Section key={`component_${component.key}`} active>
            {component.title}
          </Breadcrumb.Section>
        )
        : (
          <Breadcrumb.Section key={`component_${component.key}`} as={Link} to={component.path} active>
            {component.title}
          </Breadcrumb.Section>
        );
    }

    return null;
  }), [pathname]);

  const breadcrumb = useMemo(() => {
    const direction = findDirection(componentTree, pathname);
    return (
      <Breadcrumb>
        <Breadcrumb.Section as={Link} to="/">
          Trang chủ
        </Breadcrumb.Section>
        {pathname !== '/home' && <Breadcrumb.Divider />}
        {jsx_breadcrumb(componentTree, direction)}
      </Breadcrumb>
    );
  }, [pathname, jsx_breadcrumb, findDirection]);

  return (
    <Wrapper>
      {breadcrumb}
    </Wrapper>
  );
};

export default BreadCrumb;
