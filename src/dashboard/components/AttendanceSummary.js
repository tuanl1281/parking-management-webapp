import React from 'react';

import { Responsive, Grid, Header } from 'semantic-ui-react';
import AttendanceStatusChart from 'dashboard/components/chart/AttendanceStatusChart';
import AttendanceUnitChart from 'dashboard/components/chart/AttendanceUnitChart';
import AttendanceDeviceChart from 'dashboard/components/chart/AttendanceDeviceChart';
import AttendanceOverviewChart from 'dashboard/components/chart/AttendanceOverviewChart';

const AttendanceSummary = () => {
  // #region utilities
  const getWidth = () =>
    typeof window === 'undefined'
      ? Responsive.onlyTablet.minWidth
      : window.innerWidth;

  const isTablet = getWidth() <= 1024;
  // #endregion

  return (
    <Grid>
      <div>
        <Header>Chấm công</Header>
      </div>
      {isTablet
        ? (
          <>
            <Grid.Row>
              <Grid.Column>
                <AttendanceOverviewChart />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <AttendanceStatusChart />
              </Grid.Column>
            </Grid.Row>
          </>
        )
        : (
          <Grid.Row>
            <Grid.Column computer={4}>
              <AttendanceOverviewChart />
            </Grid.Column>
            <Grid.Column computer={12}>
              <AttendanceStatusChart />
            </Grid.Column>
          </Grid.Row>
        )
      }
      <Grid.Row>
        <Grid.Column computer={4}>
          <AttendanceDeviceChart />
        </Grid.Column>
        <Grid.Column computer={12}>
          <AttendanceUnitChart />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default AttendanceSummary;
