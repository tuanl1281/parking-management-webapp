import React, { useMemo, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { FiSettings, FiBell } from 'react-icons/fi';
import { Menu, Icon, Dropdown, Popup } from 'semantic-ui-react';
import UserProfileButton from 'app/layout/UserProfileButton';

import { useAuth } from 'app/hooks';
// eslint-disable-next-line import/no-cycle
import componentTree, { componentKey } from 'app/utils/component-tree';

const StyledMenu = styled(Menu)`
  height: 3.5em !important;
  & .item {
    & .text {
      color: white !important;
    }
  }

  & .disable {
    & .text {
      color: rgba(0, 0, 0, 0.87) !important;
    }
  }
`;

const StyledRightMenuItem = styled(Menu.Item)`
  &:before {
    position: absolute;
    content: "";
    top: 0%;
    right: 0px;
    height: 100%;
    width: 1px;
    background: rgba(255, 255, 255, 0.08);
  }
  &:after {
    position: absolute;
    content: "";
    top: 0%;
    right: 0px;
    height: 100%;
    width: 1px;
    background: rgba(255, 255, 255, 0.08);
  }
  &:first-child {
    &:after {
      position: absolute;
      content: "";
      top: 0%;
      right: 0px;
      height: 100%;
      width: 0px;
      background: rgba(255, 255, 255, 0.08);
    }
  }
  &:last-child {
    &:after {
      position: absolute;
      content: "";
      top: 0%;
      right: 0px;
      height: 100%;
      width: 0px;
      background: rgba(255, 255, 255, 0.08);
    }
  }
`;

const TopBar = () => {
  const history = useHistory();
  const { hasPermission } = useAuth();

  const singleMenuItem = useCallback((key, title, icon, path) => {
    if (key && !hasPermission(key)) {
      return null;
    }

    return (
      <Menu.Item key={`item_${key}`} as={Link} to={path}>
        {icon ? typeof icon === 'string' ? <Icon name={icon} /> : icon : null}
        {/* <b>{title}</b> */}
        {title}
      </Menu.Item>
    );
  }, [hasPermission]);

  const multipleMenuItem = useCallback((component) => {
    const childItems = (component?.childrenList ?? [])
      .map((childComponent) => {
        if (childComponent?.key && childComponent?.title && !(childComponent?.hidden ?? false)) {
          if (childComponent?.childrenList && childComponent.childrenList.length > 0) {
            return multipleMenuItem(childComponent);
          }
          return singleMenuItem(childComponent.key, childComponent.title, undefined, childComponent.path);
        }
        return null;
      })
      .filter((item) => item);

    return childItems.length > 0 ? (
      <Dropdown item text={component?.title} key={`item_${component.key}`}>
        <Dropdown.Menu>
          {childItems}
        </Dropdown.Menu>
      </Dropdown>
    ) : null;
  }, [singleMenuItem]);

  const menuItems = useMemo(() => componentTree.map((component) => {
    if (component?.key && component?.title && !(component?.hidden ?? false)) {
      if (component?.childrenList) {
        return multipleMenuItem(component);
      }

      return singleMenuItem(
        component.key,
        component.title,
        component?.icon ?? undefined,
        component.path,
      );
    }
    return null;
  }), [singleMenuItem, multipleMenuItem]);

  return (
    <StyledMenu inverted fixed="top">
      <Menu.Item header>{window?.env?.TITLE ?? 'HRS'}</Menu.Item>
      {menuItems}
      {hasPermission(componentKey.SETTING_PAGE) && (
        <StyledRightMenuItem position="right">
          <Popup
            pinned
            hoverable
            size="mini"
            position="bottom right"
            content="Thiết lập"
            trigger={<FiSettings onClick={() => history.push('/settings')} />}
          />
        </StyledRightMenuItem>
      )}
      <StyledRightMenuItem position={!hasPermission(componentKey.SETTING_PAGE) ? 'right' : undefined}>
        <Popup pinned hoverable size="mini" position="bottom right" content="Thông báo" trigger={<FiBell />} />
      </StyledRightMenuItem>
      <StyledRightMenuItem as={UserProfileButton} />
    </StyledMenu>
  );
};

export default TopBar;
