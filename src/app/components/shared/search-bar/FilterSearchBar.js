/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FiMenu } from 'react-icons/fi';
import { Accordion, Button, Input } from 'semantic-ui-react';
import { CompactPicker } from 'app/components/shared/date-picker';

import { PICKER_TYPES } from 'app/components/shared/date-picker/CompactPicker';

const StyledAccordion = styled(Accordion)`
  box-shadow: none !important;
  .title {
    padding: 0 !important;
  }
  .content {
    margin-top: 0.5em !important;
    padding: 8px !important;
    border: 1px solid rgba(34, 36, 38, 0.15);
    border-radius: 0.25rem;
  }
`;

const StyledButton = styled(Button)`
  margin-left: 8px !important;
  margin-bottom: 8px !important;
`;

const ActionWrapper = styled.div`
  height: 41.5px;
  display: flex;

  > * {
    height: 40.5px !important;
    margin-right: 10px !important;

    & button {
      height: 40.5px !important;
    }
  }

  &:last-child {
    & .input {
      flex-grow: 1;
      height: 41.5px !important;
      margin-right: 0 !important;
    }
  }
`;

const ExpandButton = styled(Button)`
  height: 38px;
  padding: 0.5833em 0.833em !important;
`;

const FilterSearchBar = ({
  noSearch,
  placeholder,
  value,
  disabled,
  loading,
  actions,
  children,
  onChange,
  onSelecting,
  filterByDate,
  filterByDatePickers,
  onFilterByDateChange,
}) => {
  const [expand, setExpand] = useState(false);
  const [input, setInput] = useState(value || '');

  const [searched, setSearched] = useState(false);
  const [searchTimeOut, setSearchTimeOut] = useState(null);

  const search = (keyword) => {
    if (searchTimeOut) {
      clearTimeout(searchTimeOut);
    }

    setSearchTimeOut(
      setTimeout(() => {
        onChange(keyword);
        setSearched(true);
      }, 300),
    );
  };

  return (
    <StyledAccordion fluid styled>
      <Accordion.Title active={expand}>
        <ActionWrapper>
          {children && <ExpandButton basic icon={<FiMenu />} onClick={() => setExpand(!expand)} />}
          {filterByDate && <CompactPicker pickers={filterByDatePickers} onChange={onFilterByDateChange} />}
          {actions
            .filter((a) => !a?.hidden)
            .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
            .map(({ key, onChange: onChangeProps, component: Component, ...props }) => (
              <Component key={key} onChange={onChangeProps} {...props} />
            ))}
          {!noSearch && (
            <Input
              fluid
              value={input}
              placeholder={placeholder}
              onChange={(_, { value: v }) => {
                setSearched(false);
                setInput(v.toLowerCase());
              }}
              input={
                <input
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (searched && onSelecting) {
                        onSelecting();
                        return;
                      }

                      search(input);
                    }
                  }}
                />
              }
              loading={disabled || loading}
              action={
                !expand
                  ? {
                      color: 'twitter',
                      icon: 'search',
                      // labelPosition: 'right',
                      // content: 'Tìm kiếm',
                      onClick: () => search(input),
                    }
                  : null
              }
            />
          )}
        </ActionWrapper>
      </Accordion.Title>
      <Accordion.Content active={expand}>
        {children}
        <StyledButton
          color="twitter"
          labelPosition="right"
          icon="filter"
          content="Áp dụng"
          disabled={loading}
          onClick={() => search(input)}
        />
      </Accordion.Content>
    </StyledAccordion>
  );
};

FilterSearchBar.propTypes = {
  /** Hidden search */
  noSearch: PropTypes.bool,
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Value */
  value: PropTypes.string,
  /** Disabled input */
  disabled: PropTypes.bool,
  /** Checkbox callback */
  loading: PropTypes.bool,
  /** Expandable children */
  children: PropTypes.node,
  /** Actions */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      order: PropTypes.number,
      component: PropTypes.node,
      onChange: PropTypes.func,
      hidden: PropTypes.bool,
    }),
  ),
  /** Input change callback */
  onChange: PropTypes.func,
  /** Selecting callback */
  onSelecting: PropTypes.func,
  /** Fitler by date */
  filterByDate: PropTypes.bool,
  filterByDatePickers: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.instanceOf(PICKER_TYPES).isRequired,
      label: PropTypes.string,
      component: PropTypes.node,
    }),
  ),
  /** Filter by date callback */
  onFilterByDateChange: PropTypes.func,
};

FilterSearchBar.defaultProps = {
  noSearch: false,
  placeholder: 'Nhập từ khoá để tìm kiếm',
  value: undefined,
  disabled: false,
  loading: false,
  children: null,
  actions: [],
  onChange: () => {},
  onSelecting: () => {},
  filterByDate: false,
  filterByDatePickers: undefined,
  onFilterByDateChange: () => {},
};

export default React.memo(FilterSearchBar);
