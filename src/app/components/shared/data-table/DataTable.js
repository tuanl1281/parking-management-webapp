/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Dimmer, Loader, Table, Grid, Header, Popup, Dropdown, Button, Label } from 'semantic-ui-react';
import { useTable, useRowSelect, usePagination, useExpanded } from 'react-table';

import {
  HeaderCheckbox,
  CellCheckbox,
  CellExpand,
  Actions,
  StyledIconButtonWrapper,
  IconButton,
  EditableCell,
} from './Elements';
import Pagination from './Pagination';

const getRowSpan = (columns) => {
  const getRow = (propColumns) => {
    if ((propColumns?.columns ?? []).length === 0) {
      return 0;
    }
    return 1 + getRowSpan(propColumns.columns);
  };

  return columns.reduce((result, column) => {
    const level = getRow(column);
    return result > level ? result : level;
  }, 0);
};

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = React.useState(0);

  React.useEffect(() => {
    const updatePosition = () => setScrollPosition(window.pageYOffset);

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
};

const dateFilterOptions = [
  {
    text: 'trong ngày',
    content: 'Trong ngày',
    value: 1,
    data: {
      from: moment().format('YYYY-MM-DD'),
      to: moment().format('YYYY-MM-DD'),
      hideDateFilter: true,
    },
  },
  {
    text: 'hôm qua',
    content: 'Hôm qua',
    value: 2,
    data: {
      from: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      to: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      hideDateFilter: true,
    },
  },
  {
    text: 'trong tuần',
    content: 'Trong tuần',
    value: 3,
    data: {
      from: moment().startOf('isoWeek').format('YYYY-MM-DD'),
      to: moment().format('YYYY-MM-DD'),
      hideDateFilter: true,
    },
  },
  {
    text: 'tuần trước',
    content: 'Tuần trước',
    value: 4,
    data: {
      from: moment().subtract(1, 'week').startOf('isoWeek').format('YYYY-MM-DD'),
      to: moment().subtract(1, 'week').endOf('isoWeek').format('YYYY-MM-DD'),
      hideDateFilter: true,
    },
  },
  {
    text: 'trong tháng',
    content: 'Trong tháng',
    value: 5,
    data: {
      from: moment().startOf('month').format('YYYY-MM-DD'),
      to: moment().format('YYYY-MM-DD'),
      hideDateFilter: true,
    },
  },
  {
    text: 'tháng trước',
    content: 'Tháng trước',
    value: 6,
    data: {
      from: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      to: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
      hideDateFilter: true,
    },
  },
  {
    text: 'tất cả',
    content: 'Tất cả',
    value: 7,
    data: { from: '', to: '', hideDateFilter: false },
  },
];

const Wrapper = styled.div`
  position: relative;
  margin-top: 16px;
`;
const StyledTable = styled(Table)`
  margin-top: 8px !important;
  .text-center {
    text-align: center !important;
  }
  .text-bold {
    font-weight: bold !important;
  }
`;
const TableWrapper = styled.div`
  overflow: visible;
  .pointer {
    cursor: pointer;
  }
  .selectable {
    th:has(.checkbox) {
      padding-top: 1.25em;
      padding-left: 1em;
    }

    td:has(.checkbox) {
      padding-top: .75em;
      padding-left: 1em;
    }
  }
`;
const ExpandCell = styled(Table.Cell)`
  background: rgba(34, 36, 38, 0.05);
  padding-left: 50px !important;
`;
const Ribbon = styled(Label)`
  left: calc(-1rem - 0.7em) !important;
`;
const HeaderContent = styled(Header.Content)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold !important;
`;

const DataTable = (props) => {
  const {
    // basic
    title,
    columns: propColumns,
    data,
    loading,
    sticky,
    celled,
    footer,
    hideGoToButton,

    // filter by date
    filterByDate,
    onFilterByDateChange,

    // selectable
    selectable,
    selectedHidden,
    defaultSelected,
    onSelectionChange,

    // sub-component
    subComponent,

    // actions
    actions,

    // editable
    editable,
    onUpdate,

    // pagination
    onPaginationChange,
    onRowClick,
    pageCount: controlledPageCount,
    totalCounts: controlledTotalCounts,
    noPaging,
  } = props;

  const [columns, setColumns] = useState([]);
  useEffect(() => {
    const tmp = [...propColumns];
    // sub-component
    if (subComponent && !propColumns.find((c) => c.id === 'expander')) {
      tmp.unshift({
        id: 'expander',
        Header: () => null,
        Cell: CellExpand,
      });
    }

    // add selection column if selection is true
    if (selectable && !propColumns.find((c) => c.id === 'selection')) {
      const rowSpan = getRowSpan(propColumns);
      tmp.unshift(
        rowSpan > 0
          ? {
              id: 'selection',
              selectedHidden,
              rowSpan: `${rowSpan + 1}`,
              Header: HeaderCheckbox,
              columns: [
                ...Array(rowSpan)
                  .fill(null)
                  .map((__, i) => ({
                    id: `selection_${i}`,
                    Header: HeaderCheckbox,
                    Cell: CellCheckbox,
                    hidden: true,
                  })),
              ],
            }
          : {
              id: 'selection',
              selectedHidden,
              Header: HeaderCheckbox,
              Cell: CellCheckbox,
            },
      );
    }

    // actions
    const rowActions = actions.filter((a) => !a.globalAction);
    if ((rowActions.length > 0 || editable) && !propColumns.find((c) => c.id === 'actions')) {
      tmp.push({
        id: 'actions',
        Header: () => null,
        Cell: (table) => Actions(table, rowActions),
      });
    }

    setColumns(tmp);
    // eslint-disable-next-line
  }, [propColumns, actions, editable, selectable, selectedHidden, subComponent]);

  const [selectedRows, setSelectedRows] = useState([]);
  const mappedSelectedIds = useMemo(
    () =>
      (data || [])
        .filter((e) => defaultSelected.includes(e.id))
        .reduce((result, id, index) => {
          // eslint-disable-next-line no-param-reassign
          result[index] = true;
          return result;
        }, {}),
    // eslint-disable-next-line
    [data]
  );

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const {
    headerGroups,
    footerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    setPageSize: setPageSizeProps,
    selectedFlatRows,
    state: { pageIndex: pageIndexProps, pageSize: pageSizeProps, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Cell: (cellProps) => EditableCell(cellProps, editable) },
      updateMyData: onUpdate,
      manualPagination: Boolean(controlledPageCount) || Boolean(controlledTotalCounts),
      pageCount: controlledPageCount || Math.ceil(controlledTotalCounts / pageSize),
      autoResetPage: false,
      // set cứng .id, no paging
      initialState: {
        selectedRowIds: mappedSelectedIds,
      },
    },
    useExpanded,
    usePagination,
    useRowSelect,
  );

  // #region pagination
  React.useEffect(() => {
    if (onPaginationChange || pageIndex !== pageIndexProps || pageSize !== pageSizeProps) {
      setPageIndex(pageIndexProps);
      setPageSize(pageSizeProps);
      onPaginationChange({ pageIndex: pageIndexProps, pageSize: pageSizeProps });
    }
    // eslint-disable-next-line
  }, [onPaginationChange, pageIndexProps, pageSizeProps]);
  // #endregion

  // #region selectable
  const selected = page
    .filter((element, index) => Object.keys(selectedRowIds).includes(`${index}`))
    .map((row) => row.original);

  React.useEffect(() => {
    if (onSelectionChange && !_(selectedFlatRows.map((row) => row.id)).xorWith(selectedRows.map((row) => row.id), _.isEqual).isEmpty()) {
      setSelectedRows(selectedFlatRows);
      onSelectionChange(selectedFlatRows.map((r) => r.original));
    }
    // eslint-disable-next-line
  }, [onSelectionChange, selectedFlatRows]);
  // #endregion

  // #region filter by date
  React.useEffect(() => {
    if (onFilterByDateChange) {
      onFilterByDateChange(dateFilterOptions[0].data);
    }
    // eslint-disable-next-line
  }, []);
  // #endregion

  // #region stick table
  const position = 56;
  const tableRef = useRef(null);
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    const thead = tableRef?.current?.children[0]?.children[0];
    if (sticky && thead != null && thead?.clientHeight && thead.clientHeight < scrollPosition) {
      thead.style.boxShadow = '0px 2px 3px 0px rgb(34 36 38 / 15%)';
    } else {
      thead.style.boxShadow = 'unset';
    }
  }, [sticky, scrollPosition]);
  // #endregion

  return (
    <Wrapper>
      <Dimmer inverted active={loading}>
        <Loader />
      </Dimmer>
      {(Boolean(title) || actions.filter((a) => a.globalAction && !a.hidden).length !== 0) && (
        <Grid>
          <Grid.Column floated="left" width={8}>
            <Header as="h3">
              <HeaderContent>
                {title}
                {filterByDate && (
                  <span>
                    {' '}
                    <Dropdown
                      as="a"
                      inline
                      style={{ color: '#4183C4' }}
                      header="Hiển thị ngày"
                      options={dateFilterOptions}
                      defaultValue={dateFilterOptions[0].value}
                      onChange={(__, { value: v }) => {
                        onFilterByDateChange(dateFilterOptions.find((e) => e.value === v).data);
                      }}
                    />
                  </span>
                )}
              </HeaderContent>
            </Header>
          </Grid.Column>
          <Grid.Column floated="right" width={8} textAlign="right">
            {actions
              .filter((a) => a.globalAction && !a.dropdown && !a.hidden)
              .map((a) => {
                if (a.content) {
                  return (
                    <Popup
                      inverted
                      size="tiny"
                      key={a.title}
                      content={a.title}
                      trigger={
                        <StyledIconButtonWrapper key={a.title}>
                          <IconButton
                            basic
                            color={a.color}
                            title={a.title}
                            disabled={a.disabled}
                            onClick={() => a.onClick(selected)}
                          >
                            <div className="wrapper">
                              {a.icon}
                              <span className="content">{a.content}</span>
                            </div>
                          </IconButton>
                        </StyledIconButtonWrapper>
                      }
                    />
                  );
                }
                return (
                  <Popup
                    inverted
                    size="tiny"
                    key={a.title}
                    content={a.title}
                    trigger={
                      <StyledIconButtonWrapper key={a.title}>
                        <IconButton
                          basic
                          color={a.color}
                          icon={a.icon}
                          title={a.title}
                          disabled={a.disabled}
                          onClick={() => a.onClick(selected)}
                        />
                      </StyledIconButtonWrapper>
                    }
                  />
                );
              })}
            {actions
              .filter((a) => a.globalAction && a.dropdown && !a.hidden)
              .map((a) => (
                <Popup
                  inverted
                  size="tiny"
                  key={a.title}
                  content={a.title}
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
                              <Dropdown.Item
                                key={ac.titleDropdown}
                                disabled={ac.dropdownDisabled}
                                onClick={ac.onDropdownClick}
                              >
                                {ac.titleDropdown}
                              </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Button.Group>
                  }
                />
              ))}
          </Grid.Column>
        </Grid>
      )}

      <TableWrapper ref={tableRef}>
        <StyledTable selectable unstackable compact="very" size="small" celled={celled}>
          <Table.Header style={sticky ? { position: 'sticky', top: `${position}px` } : {}}>
            {headerGroups.map((headerGroup) => {
              const { key: headerRowKey } = headerGroup.getHeaderGroupProps();
              return (
                <Table.Row key={headerRowKey}>
                  {headerGroup.headers.map((column) => {
                    const { key: headerCellKey } = column.getHeaderProps();
                    return (
                      <Table.HeaderCell
                        {...column.getHeaderProps()}
                        key={headerCellKey}
                        style={column?.hidden ? { display: 'none' } : {}}
                        textAlign={column?.align ?? 'left'}
                        rowSpan={`${column.rowSpan ?? 1}`}
                        className={column.columns ? 'text-center' : ''}
                        collapsing={['selection', 'expander'].includes(column.id)}
                        content={column.render('Header')}
                      />
                    );
                  })}
                </Table.Row>
              );
            })}
          </Table.Header>
          <Table.Body>
            {page.map((row) => {
              prepareRow(row);
              const { key: rowKey } = row.getRowProps();
              return (
                <React.Fragment key={rowKey}>
                  <Table.Row
                    className={
                      onRowClick.toString() === '() => {}' || onRowClick.toString() === 'function(){}' ? '' : 'pointer'
                    }
                    onClick={() => {
                      if (onRowClick && row.original) {
                        onRowClick(row.original);
                      }
                    }}
                  >
                    {row.cells.map((cell) => {
                      const { key: cellKey } = cell.getCellProps();
                      const { id } = cell?.row ?? { id: 0 };
                      return (
                        <Table.Cell
                          style={{ position: 'initial' }}
                          key={cellKey}
                          content={
                            selectedHidden
                              ? !cellKey.includes('selection') || !mappedSelectedIds[id]
                                ? cell.render('Cell')
                                : undefined
                              : cell.render('Cell')
                          }
                          textAlign={
                            cellKey.includes('actions')
                              ? 'right'
                              : cellKey.includes('selection')
                                ? 'center'
                                : cell?.column?.align ?? 'left'
                          }
                        />
                      );
                    })}
                  </Table.Row>
                  {row.isExpanded && subComponent && (
                    <Table.Row>
                      <ExpandCell colSpan={columns.length} content={subComponent(row.original)} />
                    </Table.Row>
                  )}
                </React.Fragment>
              );
            })}
          </Table.Body>
          {!noPaging && (
            <Pagination
              hideGoToButton={hideGoToButton}
              pageIndex={pageIndexProps}
              pageSize={pageSizeProps}
              pageCount={pageCount}
              gotoPage={async (n) => {
                await gotoPage(n);
                gotoPage(n);
              }}
              setPageSize={setPageSizeProps}
            />
          )}
          {footer && (
            <Table.Footer>
              {footerGroups.map((footerGroup) => {
                const { key: footerGroupKey } = footerGroup.getFooterGroupProps();
                if (
                  footerGroup.headers.some((header) => header.parent) ||
                  footerGroup.headers.some((header) => header.Footer && !header.Footer.toString().includes('()'))
                ) {
                  return (
                    <Table.Row key={footerGroupKey}>
                      {footerGroup.headers.map((column, i) => {
                        const { key: headerCellKey } = column.getFooterProps();
                        if (i === 0) {
                          return (
                            <Table.HeaderCell
                              key={headerCellKey}
                              content={<Ribbon ribbon color="green" content="Tổng" />}
                            />
                          );
                        }
                        return (
                          <Table.HeaderCell
                            {...column.getFooterProps()}
                            key={headerCellKey}
                            className={column.columns ? 'text-center text-bold' : 'text-bold'}
                            collapsing={['selection', 'expander'].includes(column.id)}
                            content={column.Footer ? column.render('Footer') : ''}
                          />
                        );
                      })}
                    </Table.Row>
                  );
                }
                return <Table.Row key={footerGroupKey} />;
              })}
            </Table.Footer>
          )}
        </StyledTable>
      </TableWrapper>
    </Wrapper>
  );
};

DataTable.propTypes = {
  /** Title of table */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

  /** Array of table's columns */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ).isRequired,

  /** Array of table's data */
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,

  /** Decide stick table */
  sticky: PropTypes.bool,

  /** Decide style */
  celled: PropTypes.bool,
  footer: PropTypes.bool,

  /** Decide if table is selectable */
  selectable: PropTypes.bool,
  selectedHidden: PropTypes.bool,
  onSelectionChange: PropTypes.func,
  defaultSelected: PropTypes.arrayOf(PropTypes.string),

  /** Indicate table's loading state */
  loading: PropTypes.bool,

  /** Row's expandable component */
  subComponent: PropTypes.func,

  /** Table actions */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
      icon: PropTypes.node,
      content: PropTypes.string,
      title: PropTypes.string,
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

  /** Decide if table is editable */
  editable: PropTypes.bool,

  hideGoToButton: PropTypes.bool,

  filterByDate: PropTypes.bool,
  onFilterByDateChange: PropTypes.func,

  /** Callback when an editable cell is blurred */
  onUpdate: PropTypes.func,

  /** on controlled pagination change (pageIndex, pageSize) */
  onPaginationChange: PropTypes.func,

  /** on row click */
  onRowClick: PropTypes.func,

  /** number of pages (controlled pagination) */
  pageCount: PropTypes.number,

  /** number of rows (controlled pagination) */
  totalCounts: PropTypes.number,

  /** No Paging flag */
  noPaging: PropTypes.bool,
};

DataTable.defaultProps = {
  title: '',
  sticky: false,
  celled: false,
  footer: false,
  selectable: false,
  selectedHidden: false,
  hideGoToButton: false,
  loading: false,
  subComponent: null,
  actions: [],
  editable: false,
  onUpdate: () => {},
  onRowClick: () => {},
  onPaginationChange: () => {},
  onSelectionChange: () => {},
  filterByDate: false,
  onFilterByDateChange: () => {},
  pageCount: 0,
  totalCounts: 0,
  noPaging: false,
  defaultSelected: [],
};

export default DataTable;
