import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';

import { FiPlus, FiEdit3, FiRefreshCw } from 'react-icons/fi';
import { Grid, Tab } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import SiteFilter from 'setting/components/site/SiteFilter';
import SiteModal from 'setting/components/site/SiteModal';
import CameraTable from 'setting/components/camera/CameraTable';

import { useDispatch, useSelector } from 'react-redux';
import { useQueryString } from 'app/hooks';
import { getSites, selectSite as selectSiteProps } from 'setting/actions/site';
import { defaultPaging } from 'app/utils/helpers';
import { formatCurrency } from 'customer/utils/helpers';

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

const SiteTable = () => {
  const [filter, setFilter] = useQueryString();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState(undefined);

  const dispatch = useDispatch();
  const {
    selectedSite,
    siteList,
    getSitesLoading,
  } = useSelector((_) => _.site);

  const { data, totalCounts } = siteList || defaultPaging;
  const loading = getSitesLoading;

  const columns = useMemo(() => ([
    {
      Header: 'Tên',
      formatter: (_) => _?.name,
    },
    {
      Header: 'Địa chỉ',
      formatter: (_) => _?.address,
    },
    {
      Header: 'Phí',
      formatter: (_) => formatCurrency(_?.fee ?? 0),
    },
  ]), []);

  const panes = useMemo(() => ([
    {
      menuItem: 'Camera',
      render: () => (
        <Tab.Pane>
          <CameraTable />
        </Tab.Pane>
      ),
    },
  ]), []);

  const selectSite = useCallback((id) => {
    const site = (siteList?.data ?? []).find((_) => _.id === id);
    dispatch(selectSiteProps(!selectedSite?.id || selectedSite?.id !== id ? site : undefined));
  }, [selectedSite, siteList]);

  const fetchSites = useCallback(() => {
    dispatch(getSites({
      ...filter,
      pageIndex,
      pageSize,
    }));
  }, [filter, pageIndex, pageSize]);
  useEffect(fetchSites, [fetchSites]);

  return (
    <>
      <Wrapper>
        <Grid>
          <Grid.Row divided>
            <Grid.Column width={selectedSite?.id ? 10 : 16}>
              <SiteFilter
                actions={[
                  {
                    icon: <FiRefreshCw />,
                    color: 'yellow',
                    onClick: () => fetchSites(),
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
                onRowClick={(_) => selectSite(_.id)}
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
            {selectedSite?.id && (
              <Grid.Column width={6}>
                <Tab renderActiveOnly panes={panes} />
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
      </Wrapper>

      <SiteModal
        open={openCreate}
        data={updateDetails}
        onRefresh={fetchSites}
        onClose={() => {
          setOpenCreate(false);
          setUpdateDetails(undefined);
        }}
      />
    </>
  );
};

export default SiteTable;
