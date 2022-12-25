import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import { Grid as GridSUI, Menu as MenuSUI } from 'semantic-ui-react';
import SiteTable from 'setting/components/site/SiteTable';

const Grid = styled(GridSUI)`
  & .row {
    padding: 0 !important;
  }
`;

const Menu = styled(MenuSUI)`
  width: 100% !important;
  margin-top: 1em !important;
`;

const SettingMenu = () => {
  const [selectedPage, setSelectedPage] = useState(undefined);

  const pages = useMemo(() => ([
    {
      key: 'SITE_PAGE',
      title: 'Cơ sở',
      component: <SiteTable />,
    },
  ]), []);

  return (
    <>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Menu vertical>
              {pages.map((page) => {
                const { key, title } = page;
                return (
                  <Menu.Item key={key} active={key === selectedPage?.key} onClick={() => setSelectedPage(page)}>
                    {title}
                  </Menu.Item>
                );
              })}
            </Menu>
          </Grid.Column>
          <Grid.Column width={13}>
            <div style={{ marginTop: '2em' }}>
              {selectedPage?.component}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default SettingMenu;
