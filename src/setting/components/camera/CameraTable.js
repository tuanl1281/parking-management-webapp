import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { FiPlus, FiTrash } from 'react-icons/fi';
import { DataList } from 'app/components/shared';
import CameraModal from 'setting/components/camera/CameraModal';

import { useDispatch, useSelector } from 'react-redux';
import { getCameraOfSite, removeCameraOfSite } from 'setting/actions/site';
import { showConfirmModal } from 'app/actions/global';

const Wrapper = styled.div`
  .cddXGj {
    margin-top: 0;
  }
  .fPCFWj {
    margin: 0;
  }
`;

const CameraTable = () => {
  const [data, setData] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

  const dispatch = useDispatch();
  const {
    selectedSite,
    cameraOfSiteData,
    getCameraOfSiteLoading,
    removeCameraOfSiteLoading,
  } = useSelector((_) => _.site);

  const loading =
    getCameraOfSiteLoading ||
    removeCameraOfSiteLoading;

  const headerRender = useCallback((_) => _?.name, []);
  const contentRender = useCallback(() => '', []);

  const fetchCameras = useCallback(() => {
    if (!selectedSite?.id) {
      return;
    }

    dispatch(getCameraOfSite(selectedSite.id));
  }, [selectedSite]);
  useEffect(fetchCameras, [fetchCameras]);

  useEffect(() => {
    setData(cameraOfSiteData?.data ?? []);
  }, [cameraOfSiteData]);

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
              if (!selectedSite?.id) {
                setData((__) => __.filter((___) => ___.id !== _.id));
              }

              dispatch(removeCameraOfSite(selectedSite.id, [_.id]));
              fetchCameras();
            })),
          },
        ]}
      />

      <CameraModal
        open={openCreate}
        onChange={(_) => setData((__) => ([...__, _]))}
        onRefresh={fetchCameras}
        onClose={() => setOpenCreate(false)}
      />
    </Wrapper>
  );
};

export default CameraTable;
