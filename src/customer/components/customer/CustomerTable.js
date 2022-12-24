import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';

import { FiPlus, FiEdit3, FiRefreshCw } from 'react-icons/fi';
import { Grid, Tab } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import CustomerFilter from 'customer/components/customer/CustomerFilter';
import CustomerModal from 'customer/components/customer/CustomerModal';
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
      Header: 'Họ và tên',
      formatter: (_) => formatName({ firstName: _?.firstName, lastName: _?.lastName }),
    },
    {
      Header: 'Số điện thoại',
      formatter: (_) => formatPhoneNumber(_?.phoneNumber ?? ''),
    },
    {
      Header: 'Địa chỉ',
      formatter: (_) => _?.address,
    },
    {
      Header: 'Số dư',
      formatter: (_) => formatCurrency(_?.balance ?? 0),
    },
  ]), []);

  const panes = useMemo(() => ([
    {
      menuItem: 'Phương tiện giao thông',
      render: () => (
        <Tab.Pane>
          <CustomerVehicleTable />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Lịch sử giao dịch',
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
                    icon: <FiEdit3 />,
                    title: 'Sửa',
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
    </>
  );
};

export default CustomerTable;
