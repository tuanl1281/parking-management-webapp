import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';

import { FiPlus, FiEdit3, FiRefreshCw, FiDollarSign } from 'react-icons/fi';
import { Grid, Tab } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import CustomerFilter from 'customer/components/customer/CustomerFilter';
import CustomerModal from 'customer/components/customer/CustomerModal';
import CustomerDepositModal from 'customer/components/customer/CustomerDepositModal';
import CustomerVehicleTable from 'customer/components/customer-vechicle/CustomerVehicleTable';
import CustomerTransactionTable from 'customer/components/customer-transaction/CustomerTransactionTable';

import { useDispatch, useSelector } from 'react-redux';
import { useQueryString } from 'app/hooks';
import { getCustomers, selectCustomer as selectCustomerProps } from 'customer/actions/customer';
import { defaultPaging } from 'app/utils/helpers';
import { formatCurrency, formatName, formatPhoneNumber } from 'customer/utils/helpers';

const Wrapper = styled.div`
  .dUfEbf, .dFOoLJ {
    margin: 0 !important;
  }

  .gRXllY {
    & .WQvZl {
      margin-top: 0 !important;
    }
  }

  .table {
    &-action {
      display: flex;
      flex-direction: row;

      & .filter {
      }

      & .action {
        margin-left: auto;
      }
    }
  }
`;

const CustomerTable = () => {
  const [filter, setFilter] = useQueryString();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState(undefined);
  const [updateDeposit, setUpdateDeposit] = useState(undefined);

  const dispatch = useDispatch();
  const {
    selectedCustomer,
    customerList,
    getCustomersLoading,
  } = useSelector((_) => _.customer);

  const { data, totalCounts } = customerList || defaultPaging;
  const loading = getCustomersLoading;

  const columns = useMemo(() => ([
    {
      Header: 'H??? v?? t??n',
      formatter: (_) => formatName({ firstName: _?.firstName, lastName: _?.lastName }),
    },
    {
      Header: 'S??? ??i???n tho???i',
      formatter: (_) => formatPhoneNumber(_?.phoneNumber ?? ''),
    },
    {
      Header: '?????a ch???',
      formatter: (_) => _?.address,
    },
    {
      Header: 'S??? d??',
      formatter: (_) => formatCurrency(_?.balance ?? 0),
    },
  ]), []);

  const panes = useMemo(() => ([
    {
      menuItem: 'Ph????ng ti???n giao th??ng',
      render: () => (
        <Tab.Pane>
          <CustomerVehicleTable />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'L???ch s??? giao d???ch',
      render: () => (
        <Tab.Pane>
          <CustomerTransactionTable />
        </Tab.Pane>
      ),
    },
  ]), []);

  const selectCustomer = useCallback((id) => {
    const customer = (customerList?.data ?? []).find((_) => _.id === id);
    dispatch(selectCustomerProps(!selectedCustomer?.id || selectedCustomer?.id !== id ? customer : undefined));
  }, [selectedCustomer, customerList]);

  const fetchCustomers = useCallback(() => {
    dispatch(getCustomers({
      ...filter,
      pageIndex,
      pageSize,
    }));
  }, [filter, pageIndex, pageSize]);
  useEffect(fetchCustomers, [fetchCustomers]);

  return (
    <>
      <Wrapper>
        <Grid>
          <Grid.Row divided>
            <Grid.Column width={selectedCustomer?.id ? 10 : 16}>
              <CustomerFilter
                actions={[
                  {
                    icon: <FiRefreshCw />,
                    color: 'yellow',
                    onClick: () => fetchCustomers(),
                  },
                  {
                    icon: <FiPlus />,
                    color: 'green',
                    onClick: () => setOpenCreate(true),
                  },
                ]}
                onChange={setFilter}
              />
              <DataTable
                loading={loading}
                columns={columns}
                data={data}
                totalCounts={totalCounts}
                onPaginationChange={({ pageIndex: pi, pageSize: pe }) => {
                  setPageIndex(pe !== pageSize ? 0 : pi);
                  setPageSize(pe);
                }}
                onRowClick={(_) => selectCustomer(_.id)}
                actions={[
                  {
                    icon: <FiDollarSign />,
                    title: 'N???p ti???n',
                    color: 'teal',
                    onClick: (_) => setUpdateDeposit(_),
                  },
                  {
                    icon: <FiEdit3 />,
                    title: 'S???a',
                    color: 'purple',
                    onClick: (_) => setUpdateDetails(_),
                  },
                ]}
              />
            </Grid.Column>
            {selectedCustomer?.id && (
              <Grid.Column width={6}>
                <Tab renderActiveOnly panes={panes} />
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
      </Wrapper>

      <CustomerModal
        open={openCreate}
        data={updateDetails}
        onRefresh={fetchCustomers}
        onClose={() => {
          setOpenCreate(false);
          setUpdateDetails(undefined);
        }}
      />

      <CustomerDepositModal
        data={updateDeposit}
        onRefresh={fetchCustomers}
        onClose={() => {
          setUpdateDeposit(undefined);
        }}
      />
    </>
  );
};

export default CustomerTable;
