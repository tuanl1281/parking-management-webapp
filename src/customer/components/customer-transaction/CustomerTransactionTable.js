import React, { useEffect, useCallback } from 'react';
import moment from 'moment';
import styled from 'styled-components';

import { Dimmer, Loader } from 'semantic-ui-react';
import { DataList } from 'app/components/shared';

import { useDispatch, useSelector } from 'react-redux';
import { getTransactionOfCustomer } from 'customer/actions/customer';
import { formatCurrency } from 'customer/utils/helpers';
import { TRANSACTION_TYPE } from 'transaction/utils/constant';
import { formatDate, formatSystemDate } from 'app/utils/time-utils';
import { defaultPayload } from 'app/utils/helpers';

const Wrapper = styled.div`
  position: relative;
  > div {
    margin-top: 0;
  }
  & .content {
    width: 100%;
  }
  & .column {
    > div {
      &:first-child: {
        margin-top: 0;
      }
    }
    & .list {
      margin-top: 0.5rem;
    }

`;

const CustomerTransactionTable = () => {
  const dispatch = useDispatch();
  const {
    selectedCustomer,
    transactionOfCustomerData,
    getTransactionOfCustomerLoading,
  } = useSelector((_) => _.customer);

  const { data } = transactionOfCustomerData || { data: [] };
  const loading = getTransactionOfCustomerLoading;

  const headerRender = useCallback((_) => (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 'bold' }}>{_?.description}</div>
        <div style={{ marginTop: '4px' }}>{formatDate(_?.time, 'HH:mm | DD-MM-YYYY')}</div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', color: (_?.type === TRANSACTION_TYPE.ADD) ? 'green' : 'red' }}>{`${(_?.type === TRANSACTION_TYPE.ADD) ? '+' : '-'}${formatCurrency(_?.amount ?? 0)}`}</span>
      </div>
    </div>
  ), []);
  const contentRender = useCallback(() => undefined, []);

  const fetchCustomerTransactions = useCallback(() => {
    if (selectedCustomer?.id) {
      dispatch(getTransactionOfCustomer(selectedCustomer.id, {
        ...defaultPayload,
        fromDate: formatSystemDate(moment().startOf('month')),
        toDate: formatSystemDate(moment().endOf('month')),
      }));
    }
  }, [selectedCustomer, dispatch]);
  useEffect(fetchCustomerTransactions, [fetchCustomerTransactions]);

  return (
    <Wrapper>
      <Dimmer inverted active={loading} style={{ paddingTop: (data || []).length < 1 ? '0px' : '64px' }}>
        <Loader />
      </Dimmer>
      {(!loading && (data || []).length < 1) && (
        <>
          <center>Không có dữ liệu</center>
        </>
      )}
      {(data || []).length > 0 && (
        <DataList
          data={data}
          getRowKey={(_) => _.id}
          itemHeaderRender={headerRender}
          itemContentRender={contentRender}
        />
      )}
    </Wrapper>
  );
};

export default CustomerTransactionTable;
