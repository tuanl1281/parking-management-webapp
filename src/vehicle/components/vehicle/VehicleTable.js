import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FiEdit3, FiRefreshCw } from 'react-icons/fi';
import { DataTable } from 'app/components/shared';
import VehicleFilter from 'vehicle/components/vehicle/VehicleFilter';

import { useQueryString } from 'app/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { selectVehicle as selectVehicleProps, getVehicles } from 'vehicle/actions/vehicle';
import { getVehicleType } from 'vehicle/utils/helpers';
import { defaultPaging } from 'app/utils/helpers';

const VehicleTable = ({ hasRegistered }) => {
  const [filter, setFilter] = useQueryString();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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
      formatter: (_) => getVehicleType(_?.type)?.text,
    },
    {
      Header: 'Đơn vị sản xuất',
      formatter: (_) => _?.brand,
    },
    {
      Header: 'Biển số đăng kí',
      formatter: (_) => _?.licenseNumber ? _.licenseNumber.replace(/(.*)-(.*)/i, '$1 - $2') : '',
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
            icon: <FiEdit3 />,
            title: 'Sửa',
            color: 'purple',
            onClick: () => {},
          },
        ]}
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
