import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { FiArrowLeftCircle } from 'react-icons/fi';
import { Button } from 'semantic-ui-react';

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const Message = styled.p`
  font-size: 20px;
`;

const Icon = styled(FiArrowLeftCircle)`
  margin-right: 8px;
`;

const DevelopmentPage = () => {
  const history = useHistory();

  return (
    <Wrapper>
      <Message>Chức năng đang được phát triển. Xin vui lòng quay lại sau</Message>
      <Button
        primary
        content="Trở lại"
        icon={<Icon />}
        onClick={() => history.push('/')}
      />
    </Wrapper>
  );
};

export default DevelopmentPage;
