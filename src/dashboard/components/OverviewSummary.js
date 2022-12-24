import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Card } from 'semantic-ui-react';
import CardChart from 'dashboard/components/chart/CardChart';

const Wrapper = styled.div`
  width: 100% !important;
  height: 0 !important;
`;

const OverviewSummary = () => {
  // #region card
  const cards = useMemo(() => ([
  ]), []);
  // #endregion

  return (
    <Wrapper>
      <Card.Group itemsPerRow={cards.length}>
        {cards.map(({ key, loading, color, label, value }) => (
          <CardChart key={key} loading={loading} color={color} label={label} value={value} />
        ))}
      </Card.Group>
    </Wrapper>
  );
};

export default OverviewSummary;
