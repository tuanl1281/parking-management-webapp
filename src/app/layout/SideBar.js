import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

import { Icon, Menu, Sidebar as SidebarSUI } from 'semantic-ui-react';
import CollapseItems from 'app/layout/CollapseItems';

import { useSelector } from 'react-redux';
// eslint-disable-next-line
import componentTree from 'app/utils/component-tree';

const Wrapper = styled.div`
  & .pushable {
    height: 100vh !important;
  }
  & .pusher {
    transform: ${(props) =>
      (props?.visible ?? '').includes('true') ? 'translate3d(200px, 0, 0)' : 'translate3d(0, 0, 0)'} !important;
  }
  & .sidebar {
    width: 200px !important;
    border: none !important;
  }
`;
const WrapperItem = styled.div`
  margin-top: 3.5em;
  & .item {
    &:hover {
      font-weight: 700;
      border-left: 2px solid;
    }
    &-active {
      font-weight: 700;
      border-left: 2px solid;
    }
    & .dropdown {
      float: left !important;
      padding: 0 !important;
      margin: 0 0.5rem 0 0 !important;
    }
  }
`;

const SideBar = ({ children }) => {
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.global);

  const singleItemNode = useCallback((key, title, icon, path, active = false) => (
    <Menu.Item key={`item_${key}`} as={Link} to={path} className={active && 'item-active'}>
      {icon ? typeof icon === 'string' ? <Icon name={icon} /> : icon : null}
      {title}
    </Menu.Item>
  ), []);

  const mutipleItemNode = useCallback((data) => <CollapseItems key={`item_${data.key}`} data={data} />, []);

  return (
    <Wrapper visible={sidebarOpen.toString()}>
      <SidebarSUI.Pushable>
        <SidebarSUI as={Menu} visible={sidebarOpen} vertical animation="push">
          <WrapperItem>
            {componentTree.map((component) => {
              if (component?.key && component?.title && !(component?.hidden ?? false)) {
                if (component?.childrenList) {
                  return mutipleItemNode(component);
                }
                return singleItemNode(
                  component.key,
                  component.title,
                  component?.icon ?? undefined,
                  component.path,
                  location.pathname.includes(component.path),
                );
              }
              return null;
            })}
          </WrapperItem>
        </SidebarSUI>
        <SidebarSUI.Pusher>{children}</SidebarSUI.Pusher>
      </SidebarSUI.Pushable>
    </Wrapper>
  );
};

SideBar.propTypes = {
  children: PropTypes.node,
};

SideBar.defaultProps = {
  children: null,
};

export default SideBar;
