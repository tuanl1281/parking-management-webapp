import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { FiMenu } from 'react-icons/fi';
import { Accordion, Popup, Icon, Input, Dropdown, Button } from 'semantic-ui-react';
import { colors } from 'app/utils/color-utils';

const Wrapper = styled.div`
  display: flex;

  div {
    margin-right: 4px;

    &:last-child {
      margin-right: 0;
    }
  }

  & .input {
    flex: 1 1 0%;
  }
`;

const Actions = styled.div`
  display: flex;
  button {
    margin-right: 4px !important;
    
    svg {
      stroke-width: 3 !important;
    }

    &:last-child {
      margin-right: 0 !important;
    }
  }
`;

const Action = styled.button`
  cursor: pointer;
  display: inline-block;
  min-height: 1em;
  outline: none;
  border: none;
  vertical-align: baseline;
  color: rgba(0, 0, 0, 0.6);
  font-family: 'Barlow', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  background: inherit;
  margin: 0px;
  padding: 10px;
  text-transform: none;
  text-shadow: none;
  font-weight: bold;
  line-height: 1em;
  font-style: normal;
  text-align: center;
  text-decoration: none;
  border-radius: 0.25rem;
  user-select: none;

  &:hover {
    color: ${(props) => props?.color ?? 'rgba(0, 0, 0, 0.87)'};
  }

  & .wrapper {
    display: flex;
    align-items: center;

    & .content {
      padding: 0 !important;
      padding-left: 2px !important;
      margin-left: 4px;
      font-size: 13px;
      font-weight: 600;
      border: none;
      border-radius: none;
    }
  }
`;

const StyledAccordion = styled(Accordion)`
  box-shadow: none !important;
  background-color: inherit !important;

  .title {
    padding: 0 !important;
  }
  .content {
    border: 1px solid rgba(34, 36, 38, 0.15);
    border-top: none;
    border-bottom-right-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
    padding: 8px !important;
  }
`;

const StyledIcon = styled(Icon)`
  margin-right: 30px !important;
`;

const SearchBar = (props) => {
  const {
    sections,
    actions,
    children,
    isCloseFilter,
    placeholder,
    loading,
    value,
    onEnter,
    onChange,
    disabled,
    checkbox,
    onCheckboxChange,
    deburr,
    onDeburr,
  } = props;

  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (event) => {
    const { value: val } = event.target;
    setSearchValue(val);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(
      setTimeout(() => {
        onChange(val.toLowerCase());
      }, 300),
    );
  };

  const [expand, setExpand] = useState(false);
  useEffect(() => {
    if (expand && isCloseFilter) {
      setExpand(false);
    }
    // eslint-disable-next-line
  }, [isCloseFilter]);

  const [isDeburr, setIsDeburr] = useState(true);
  useEffect(() => onDeburr(isDeburr), [isDeburr, onDeburr]);

  const [isCheckbox, setIsCheckbox] = useState(false);
  useEffect(() => onCheckboxChange(isCheckbox), [isCheckbox, onCheckboxChange]);

  return (
    <StyledAccordion fluid styled>
      <Accordion.Title active={expand}>
        <Wrapper>
          {sections
            .filter((a) => !a?.hidden)
            .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
            .map(({ key, onChange: onChangeProps, component: Component, ...prop }) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <Component key={key} onChange={onChangeProps} {...prop} />
            ))
          }
          <Input
            icon={
              <>
                {deburr && (
                  <StyledIcon
                    name={isDeburr ? 'toggle on' : 'toggle off'}
                    link
                    onClick={() => setIsDeburr(!isDeburr)}
                  />
                )}
                {checkbox && (
                  <StyledIcon
                    name={isCheckbox ? 'square check outline' : 'square outline'}
                    link
                    onClick={() => setIsCheckbox(!isCheckbox)}
                  />
                )}
                <Icon name="search" />
              </>
            }
            placeholder={placeholder}
            value={value === '' ? value : searchValue}
            onChange={handleChange}
            input={
              <input
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onEnter(e.target.value.toLowerCase());
                  }
                }}
              />
            }
            loading={disabled || loading}
            label={
              children
                ? {
                    basic: true,
                    content: <FiMenu />,
                    onClick: () => setExpand(!expand),
                  }
                : null
            }
          />
          <Actions>
            {actions
            .filter((action) => !action.dropdown && !action.hidden)
            .map((action) => (
              <Action
                color={colors[action.color]}
                onClick={() => action.onClick()}
              >
                <div className="wrapper">
                  {action.icon}
                  {action?.content && actions.length < 3 && (
                    <span className="content">{action.content}</span>
                  )}
                </div>
              </Action>
            ))}
            {actions
            .filter((a) => a.dropdown && !a.hidden)
            .map((a) => (
              <Popup
                inverted
                size="tiny"
                key={a.content}
                content={a.content}
                trigger={
                  <Button.Group basic color={a.color} style={{ border: 'none' }}>
                    <Dropdown
                      button
                      icon={a.icon}
                      className="icon"
                      disabled={a.disabled}
                      style={{
                        padding: '8px 7px 6px 7px',
                        marginLeft: '4px',
                      }}
                    >
                      <Dropdown.Menu>
                        {a.dropdownActions
                          .filter((ac) => !ac.dropdownHidden)
                          .map((ac) => (
                            <Dropdown.Item key={ac.titleDropdown} disabled={ac.dropdownDisabled} onClick={ac.onDropdownClick}>
                              {ac.titleDropdown}
                            </Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Button.Group>
                }
              />
            ))}
          </Actions>
        </Wrapper>
      </Accordion.Title>
      <Accordion.Content active={expand}>{children}</Accordion.Content>
    </StyledAccordion>
  );
};

SearchBar.propTypes = {
  /** Sections */
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      order: PropTypes.number,
      component: PropTypes.node,
      onChange: PropTypes.func,
      hidden: PropTypes.bool,
    }),
  ),
  /** Actions */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
      icon: PropTypes.node,
      content: PropTypes.string,
      onClick: PropTypes.func,
      color: PropTypes.oneOf([
        'facebook',
        'google plus',
        'vk',
        'twitter',
        'linkedin',
        'instagram',
        'youtube',
        'red',
        'orange',
        'yellow',
        'olive',
        'green',
        'teal',
        'blue',
        'violet',
        'purple',
        'pink',
        'brown',
        'grey',
        'black',
      ]),
      globalAction: PropTypes.bool,
      dropdown: PropTypes.bool,
      dropdownActions: PropTypes.arrayOf(
        PropTypes.shape({
          onDropdownClick: PropTypes.func,
          titleDropdown: PropTypes.string,
          dropdownHidden: PropTypes.bool,
          dropdownDisabled: PropTypes.bool,
        }),
      ),
      disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
      hidden: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    }),
  ),
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Placeholder */
  value: PropTypes.string,
  /** Input change callback */
  onChange: PropTypes.func,
  /** Disabled input */
  disabled: PropTypes.bool,
  /** Checkbox callback */
  onCheckboxChange: PropTypes.func,
  /** Checkbox input */
  checkbox: PropTypes.bool,
  /** Loading input */
  loading: PropTypes.bool,
  /** Expandable children */
  children: PropTypes.node,
  /** Deburr input */
  deburr: PropTypes.bool,
  /** Close filter */
  isCloseFilter: PropTypes.bool,
  /** Deburr callback */
  onDeburr: PropTypes.func,
  /** Enter callback */
  onEnter: PropTypes.func,
};

SearchBar.defaultProps = {
  sections: [],
  actions: [],
  children: null,
  isCloseFilter: false,
  placeholder: 'Search',
  loading: false,
  value: ' ',
  onEnter: () => {},
  onChange: () => {},
  disabled: false,
  checkbox: false,
  onCheckboxChange: () => {},
  deburr: false,
  onDeburr: () => {},
};

export default SearchBar;
