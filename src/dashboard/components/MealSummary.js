import React from 'react';

import { Responsive, Grid, Header } from 'semantic-ui-react';
import MealOverviewChart from 'dashboard/components/chart/MealOverviewChart';

const MealSummary = () => {
  // #region utilities
  // eslint-disable-next-line no-unused-vars
  const getWidth = () =>
    typeof window === 'undefined'
      ? Responsive.onlyTablet.minWidth
      : window.innerWidth;
  // #endregion

  return (
    <Grid>
      <div>
        <Header>Suất cơm</Header>
      </div>
      <Grid.Row>
        <Grid.Column>
          <MealOverviewChart />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default MealSummary;
