import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FiEdit3, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { Header } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import VehicleFilter from 'vehicle/components/vehicle/VehicleFilter';
import VehicleCustomerModal from 'vehicle/components/vehicle/VehicleCustomerModal';

import { useQueryString } from 'app/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { selectVehicle as selectVehicleProps, getVehicles } from 'vehicle/actions/vehicle';
import { formatLicenseNumber, getVehicleType } from 'vehicle/utils/helpers';
import { defaultPaging } from 'app/utils/helpers';
import { VEHICLE_TYPE } from 'vehicle/utils/constants';
import { formatName } from 'customer/utils/helpers';
import VehicleModal from './VehicleModal';

const VehicleTable = ({ hasRegistered }) => {
  const [filter, setFilter] = useQueryString();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [updateVehicle, setUpdateVehicle] = useState(undefined);
  const [updateCustomer, setUpdateCustomer] = useState(undefined);

  const dispatch = useDispatch();
  const {
    selectedVehicle,
    vehicleList,
    getVehiclesLoading,
  } = useSelector((_) => _.vehicle);

  const { data, totalCounts } = vehicleList || defaultPaging;
  const loading = getVehiclesLoading;

  const columns = useMemo(() => ([
    {
      Header: 'Phương tiện',
      formatter: (_) => (
        <div>
          <Header sub>{_?.brand}</Header>
          {getVehicleType(_?.type)?.text}
        </div>
      ),
    },
    {
      Header: 'Biển số đăng kí',
      formatter: (_) => formatLicenseNumber(_?.licenseNumber),
    },
    {
      Header: 'Khách hàng',
      formatter: (_) => formatName({ firstName: _?.customer?.firstName ?? '', lastName: _?.customer?.lastName ?? '' }),
    },
  ]), []);

  const selectVehicle = useCallback((id) => {
    const vehicle = (vehicleList?.data ?? []).find((_) => _.id === id);
    dispatch(selectVehicleProps(!selectedVehicle?.id || selectedVehicle?.id !== id ? vehicle : undefined));
  }, [selectedVehicle, vehicleList]);

  const fetchVehicles = useCallback(() => {
    dispatch(getVehicles({
      ...filter,
      hasRegistered,
      pageIndex,
      pageSize,
    }));
  }, [dispatch, filter, hasRegistered, pageIndex, pageSize]);
  useEffect(fetchVehicles, [fetchVehicles]);

  return (
    <>
      <VehicleFilter
        actions={[
          {
            icon: <FiRefreshCw />,
            color: 'yellow',
            onClick: () => fetchVehicles(),
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
        onRowClick={(_) => selectVehicle(_.id)}
        actions={[
          {
            icon: <FiPlus />,
            title: 'Thêm',
            color: 'green',
            onClick: (_) => setUpdateCustomer(_),
            hidden: (_) => _?.type !== VEHICLE_TYPE.UNDEFINED,
          },
          {
            icon: <FiEdit3 />,
            title: 'Sửa',
            color: 'purple',
            onClick: (_) => setUpdateVehicle(_),
            hidden: (_) => _?.type === VEHICLE_TYPE.UNDEFINED,
          },
        ]}
      />

      <VehicleModal
        data={updateVehicle}
        onRefresh={fetchVehicles}
        onClose={() => setUpdateVehicle(undefined)}
      />

      <VehicleCustomerModal
        data={updateCustomer}
        onRefresh={fetchVehicles}
        onClose={() => setUpdateCustomer(undefined)}
      />
    </>
  );
};

VehicleTable.propTypes = {
  hasRegistered: PropTypes.bool,
};

VehicleTable.defaultProps = {
  hasRegistered: null,
};

export default VehicleTable;
