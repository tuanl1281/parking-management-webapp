import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

import { Accordion, Menu, Icon } from 'semantic-ui-react';

const Wrapper = styled.div`
  & .accordion {
    border-top: 1px solid rgb(232, 232, 233);
  }
  & .title {
    padding: 0.7235em 1.125em !important;
    font-weight: ${(props) => (props?.visible ?? '').includes('true') ? '700' : '500'};
    &:hover { 
      font-weight: 700;
      border-left: ${(props) => (props?.visible ?? '').includes('true') ? '0px' : '2px'} solid;
    }
    & .dropdown {
      float: right !important;
      margin: 0.25rem 0rem 0rem 0rem !important;
    }
  }
  & .content {
    margin: 0 !important;
    padding: 0 !important;
    border-top: 1px solid rgb(232, 232, 233);
    &__item {
      &-active {
        font-weight: 700;
        border-left: 2px solid;
      }
    }
  }
`;

const CollapseItems = ({ data }) => {
  const { title, icon, childrenList } = data;

  const location = useLocation();
  const isActive = useMemo(() => childrenList.find((c) => location.pathname.includes(c.path)),
  [childrenList, location]);

  const [visible, setVisible] = useState(isActive || false);

  const singleItemNode = useCallback((keyItem, titleItem, pathItem, active = false) => (
    <Menu.Item
      key={`item_${keyItem}`}
      as={Link}
      to={pathItem}
      content={titleItem}
      className={active && 'content__item-active'}
    />
  ),
  []);

  return (
    <Wrapper visible={visible.toString()}>
      <Accordion>
        <Accordion.Title
          active={visible}
          content={(
            <>
              {icon ? (typeof icon === 'string' ? <Icon name={icon} /> : icon) : null}
              {title}
            </>
          )}
          onClick={() => setVisible(!visible)}
        />
        <Accordion.Content active={visible}>
          {childrenList.map((component) => {
            if (component?.key && component?.title && !(component?.hidden ?? false)) {
              return singleItemNode(
                component.key,
                component.title,
                component.path,
                location.pathname.includes(component.path),
              );
            }
            return null;
          })}
        </Accordion.Content>
      </Accordion>
    </Wrapper>
  );
};

CollapseItems.propTypes = {
  data: PropTypes.shape({
    icon: PropTypes.string,
    title: PropTypes.string.isRequired,
    childrenList: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
};

export default CollapseItems;
