import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { Popup, Dropdown } from 'semantic-ui-react';
import {
  FiInfo,
  FiUser,
  FiLogOut,
} from 'react-icons/fi';

import { useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';

import packageJson from '../../../package.json';

const DropdownWrapper = styled.div`
  height: 100%;
  & .dropdown {
    height: 100% !important;
    &:before {
      position: absolute;
      content: '';
      top: 0%;
      left: 0px;
      height: 100%;
      width: 1px;
      background: rgba(34, 36, 38, 0.1);
    }
    & .menu {
      z-index: 2000;
    }
  }
`;
const IconWrapper = styled.span`
  margin-right: 8px;
  vertical-align: middle;
`;

const UserProfileButton = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const {
    userInfo,
    loginLoading,
    getUserInfoLoading,
  } = useSelector((state) => state.auth);

  const fullName = useMemo(() => userInfo?.fullname ?? 'Loading...', [userInfo]);

  return (
    <Popup
      pinned
      hoverable
      size="mini"
      position="bottom right"
      content={fullName}
      trigger={
        <DropdownWrapper>
          <Dropdown
            className="link item"
            icon={<FiUser style={{ marginLeft: 8 }} />}
            text={`${fullName.substring(0, 10)}...`}
            loading={
              loginLoading || getUserInfoLoading
            }
          >
            <Dropdown.Menu>
              <Dropdown.Item
                className="disable"
                onClick={() => {
                  logout();
                  setTimeout(() => {
                    history.push('/');
                    window.location.reload();
                  }, 0);
                }}
                content="Đăng xuất"
                icon={(
                  <IconWrapper>
                    <FiLogOut />
                  </IconWrapper>
                )}
              />
              <Dropdown.Divider />
              <Dropdown.Item
                disabled
                className="disable"
                content={packageJson.version}
                icon={(
                  <IconWrapper>
                    <FiInfo />
                  </IconWrapper>
                )}
              />
            </Dropdown.Menu>
          </Dropdown>
        </DropdownWrapper>
      }
    />
  );
};

export default React.memo(UserProfileButton);
