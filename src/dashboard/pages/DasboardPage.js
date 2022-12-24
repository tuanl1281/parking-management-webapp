import React, { useCallback } from 'react';

import { Grid, Segment, Header } from 'semantic-ui-react';

import { useAuth } from 'app/hooks';

const DashboardPage = () => {
  const { isAdmin, isLeader, isEmployee } = useAuth();

  // eslint-disable-next-line camelcase
  const jsx_dashboard = useCallback(() => {
    if (isEmployee()) {
      return (
        <Segment style={{ padding: '2em 0em' }} vertical />
      );
    }

    if (isAdmin() || isLeader()) {
      return (
        <Segment vertical style={{ padding: '2em 0em' }} />
      );
    }

    return (
      <Segment style={{ padding: '2em 0em' }} vertical>
        <Grid stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>
              <Header
                as="h3"
                style={{ fontSize: '2em' }}
                content="👋 Xin chào"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }, [isEmployee, isLeader, isAdmin]);

  return <>{jsx_dashboard()}</>;
};

export default DashboardPage;
