import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { FiPlus, FiTrash } from 'react-icons/fi';
import { DataList } from 'app/components/shared';
import CustomerVehicleModal from 'customer/components/customer-vechicle/CustomerVehicleModal';

import { useDispatch, useSelector } from 'react-redux';
import { getVehicleOfCustomer, removeVehicleOfCustomer } from 'customer/actions/customer';
import { showConfirmModal } from 'app/actions/global';
import { formatLicenseNumber } from 'vehicle/utils/helpers';

const Wrapper = styled.div`
  > div {
    margin-top: 0;
  }
`;

const CustomerVehicleTable = () => {
  const [data, setData] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

  const dispatch = useDispatch();
  const {
    selectedCustomer,
    vehicleOfCustomerData,
    getVehicleOfCustomerLoading,
    removeVehicleOfCustomerLoading,
  } = useSelector((_) => _.customer);

  const loading =
    getVehicleOfCustomerLoading ||
    removeVehicleOfCustomerLoading;

  const headerRender = useCallback((_) => formatLicenseNumber(_?.licenseNumber), []);
  const contentRender = useCallback((_) => `${_?.brand}${_?.name ? ` ${_.name}` : ''}`, []);

  const fetchCustomerVehicles = useCallback(() => {
    if (!selectedCustomer?.id) {
      return;
    }

    dispatch(getVehicleOfCustomer(selectedCustomer.id));
  }, [selectedCustomer]);
  useEffect(fetchCustomerVehicles, [fetchCustomerVehicles]);

  useEffect(() => {
    setData(vehicleOfCustomerData?.data ?? []);
  }, [vehicleOfCustomerData]);

  return (
    <Wrapper>
      <DataList
        search
        data={data}
        loading={loading}
        getRowKey={(_) => _.id}
        itemHeaderRender={headerRender}
        itemContentRender={contentRender}
        listActions={[
          {
            icon: <FiPlus />,
            title: 'Đăng kí',
            color: 'green',
            onClick: () => setOpenCreate(true),
          },
        ]}
        itemActions={[
          {
            icon: <FiTrash />,
            title: 'Xoá',
            color: 'red',
            onClick: (_) => dispatch(showConfirmModal('Bạn có chắc muốn xoá?', () => {
              if (!selectedCustomer?.id) {
                setData((__) => __.filter((___) => ___.id !== _.id));
              }

              dispatch(removeVehicleOfCustomer(selectedCustomer.id, [_.id]));
              fetchCustomerVehicles();
            })),
          },
        ]}
      />

      <CustomerVehicleModal
        open={openCreate}
        onChange={(_) => setData((__) => ([...__, _]))}
        onRefresh={fetchCustomerVehicles}
        onClose={() => setOpenCreate(false)}
      />
    </Wrapper>
  );
};

export default CustomerVehicleTable;
