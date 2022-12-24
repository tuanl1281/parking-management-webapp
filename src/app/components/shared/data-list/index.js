import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Dimmer, Loader, Button, List, Header, Grid } from 'semantic-ui-react';
import InstantSearchBar from 'app/components/shared/SearchBar';
import RowCheckbox from 'app/components/shared/data-list/RowCheckbox';
import Pagination from 'app/components/shared/data-list/Pagination';

import { deburr } from 'app/utils/helpers';

const Wrapper = styled.div`
  position: relative;
  margin-top: 16px;
`;
const StyledHeader = styled(Header)`
  margin-top: 0;
  margin-bottom: 8px;
  margin-right: auto;
`;
const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;
const ListActionButton = styled(Button)`
  display: flex;
  padding: 11px !important;
  margin-right: 0 !important;
  margin-left: 9px !important;
  height: ${(props) => (props.search === 'true' ? 'auto' : '36px')};
`;
const StyledSearchBar = styled(InstantSearchBar)`
  flex: 1 1 0%;
`;
const IconButton = styled(Button)`
  line-height: 0 !important;
  margin-left: 3px !important;
  margin-top: 2px !important;
  margin-right: 0 !important;
  padding: 10px !important;
`;
const BorderedList = styled(List)`
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-radius: 5px;
`;
const ItemWrapper = styled(List.Item)`
  display: flex !important;
  align-items: center !important;
`;
const ActionWrapper = styled(List.Content)`
  display: inherit !important;
  margin-left: auto;
`;
const CheckBoxWrapper = styled(List.Content)`
  padding: 0.625em !important;
  padding-left: 0.125em !important;
  margin-right: 0 !important;
`;

const DataList = (props) => {
  const {
    data,
    loading,
    search,
    selectable,
    selectedRows,
    title,
    listActions,
    itemActions,
    itemIconRender,
    itemHeaderRender,
    itemContentRender,
    onRowClick,
    getRowKey,
    onMultipleSelect,
    toggle,
    noPaging,
    totalCounts,
    onPaginationChange
  } = props;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);

  const [searchValue, setSearchValue] = useState('');
  const [selecting, setSelecting] = useState(undefined);
  const [multipleSelect, setMultipleSelect] = useState([]);

  const filteredData = useMemo(() => {
    if (searchValue) {
      const result = data.filter((r) => {
        const found = Object.values(r).find((v) => deburr(`${v}`).toLowerCase().includes(searchValue.toLowerCase()));
        return found;
      });

      if (!noPaging) {
        setPageCount(Math.ceil((result || []).length / pageSize));
        return result.length > pageSize ? result.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize) : result;
      }

      return result;
    }

    if (!noPaging) {
      setPageCount(Math.ceil((totalCounts || data.length) / pageSize));
      return data.length > pageSize ? data.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize) : data;
    }
    return data;
  }, [data, searchValue, noPaging, pageIndex, pageSize, totalCounts]);

  // #region search
  const searchBar = useMemo(() => {
    if (search) {
      return (
        <StyledSearchBar
          size="small"
          onChange={(value) => {
            setSearchValue(value);
          }}
        />
      );
    }
    return null;
  }, [search, setSearchValue]);
  // #endregion

  // #region pagination
  const gotoPage = useCallback(
    (page) => {
      setPageIndex(page);
      if (onPaginationChange) {
        onPaginationChange({ pageIndex: page, pageSize: pageSize || 10 });
      }
    },
    [pageSize, onPaginationChange]
  );
  const changePageSize = useCallback(
    (size) => {
      setPageSize(size);
      if (onPaginationChange) {
        onPaginationChange({ pageIndex: pageIndex || 0, pageSize: size });
      }
    },
    [pageIndex, onPaginationChange]
  );
  const paginationNode = useMemo(
    () =>
      !noPaging && (
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={pageCount || Math.ceil((totalCounts || data.length) / pageSize)}
          totalCounts={totalCounts || data.length}
          gotoPage={gotoPage}
          setPageSize={changePageSize}
        />
      ),
    [data, noPaging, pageIndex, pageSize, pageCount, totalCounts, gotoPage, changePageSize]
  );
  // #endregion

  // #region select & multiple select
  const multipleSelecting = useCallback(
    (d, b) => {
      const key = getRowKey(d);
      const selectedList = multipleSelect;
      if (b) {
        selectedList.push(d);
      } else {
        selectedList.filter((o) => getRowKey(o) !== key);
      }
      setMultipleSelect(selectedList);
      onMultipleSelect(selectedList);
      // eslint-disable-next-line
    },
    [getRowKey, onMultipleSelect, multipleSelect]
  );
  // #endregion

  return (
    <Wrapper>
      <Dimmer inverted active={loading}>
        <Loader />
      </Dimmer>

      <Grid>
        <Grid.Column width={16}>
          {search && <StyledHeader as="h3">{title}</StyledHeader>}
          <FlexWrapper>
            {search && searchBar}
            {!search && <StyledHeader as="h3">{title}</StyledHeader>}
            {listActions
              ?.filter((action) => !action?.hidden)
              .map((action) => (
                <ListActionButton
                  icon
                  basic
                  search={`${search}`}
                  key={`${action.title}-${action.color}`}
                  title={action.title}
                  color={action.color}
                  content={action.icon}
                  disabled={action.disabled || loading}
                  onClick={action.onClick}
                />
              ))}
          </FlexWrapper>

          <BorderedList selection celled verticalAlign="middle">
            {filteredData.map((d) => (
              <ItemWrapper
                key={getRowKey(d)}
                active={selecting === getRowKey(d)}
                onClick={() => {
                  onRowClick(d);
                  if (toggle) {
                    if (selecting === getRowKey(d)) {
                      setSelecting(undefined);
                    } else {
                      setSelecting(getRowKey(d));
                    }
                  }
                }}>
                {selectable && (
                  <CheckBoxWrapper floated="left">
                    <RowCheckbox
                      checked={Boolean((selectedRows || []).find((o) => getRowKey(o) === getRowKey(d)))}
                      onChange={(b) => multipleSelecting(d, b)}
                    />
                  </CheckBoxWrapper>
                )}
                {itemIconRender?.(d)}
                <List.Content>
                  <List.Header>{itemHeaderRender(d)}</List.Header>
                  {itemContentRender?.(d)}
                </List.Content>
                {(itemActions || []).length !== 0 && (
                  <ActionWrapper>
                    {itemActions?.map((action) => {
                      const hidden = typeof action.hidden === 'function' ? action.hidden(d) : action?.hidden ?? false;
                      if (hidden)
                        return null;
                      
                      return (
                        <IconButton
                          icon
                          basic
                          key={`${action.title}-${action.color}`}
                          color={action.color}
                          title={action.title}
                          content={action.icon}
                          disabled={loading}
                          hidden={hidden}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(d);
                          }}
                        />
                      );
                    })}
                  </ActionWrapper>
                )}
              </ItemWrapper>
            ))}
          </BorderedList>
          {paginationNode}
        </Grid.Column>
      </Grid>
    </Wrapper>
  );
};

DataList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  getRowKey: PropTypes.func.isRequired,
  itemIconRender: PropTypes.func,
  itemHeaderRender: PropTypes.func.isRequired,
  itemContentRender: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  search: PropTypes.bool,
  toggle: PropTypes.bool,
  selectable: PropTypes.bool,
  selectedRows: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  listContentStyle: PropTypes.object,
  listActions: PropTypes.arrayOf(PropTypes.shape({})),
  itemActions: PropTypes.arrayOf(PropTypes.shape({})),
  onRowClick: PropTypes.func,
  onMultipleSelect: PropTypes.func,
  noPaging: PropTypes.bool,
  totalCounts: PropTypes.number,
  onPaginationChange: PropTypes.func
};

DataList.defaultProps = {
  itemIconRender: () => {},
  loading: false,
  search: false,
  toggle: false,
  selectable: false,
  selectedRows: [],
  title: '',
  listActions: [],
  itemActions: [],
  onRowClick: () => {},
  onMultipleSelect: () => {},
  noPaging: false,
  totalCounts: 0,
  onPaginationChange: () => {}
};

export default DataList;
