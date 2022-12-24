import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Accordion as AccordionSUI, Button, Icon } from 'semantic-ui-react';

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center !important;
  height: 30px !important;
`;
const LeftFlex = styled.div``;
const RightFlex = styled.div`
  margin-left: auto;
`;

const StyledAccordionSUITitle = styled(AccordionSUI.Title)`
  padding: 0.75rem 0.75rem !important;
`;
const StyledAccordionSUIContent = styled(AccordionSUI.Content)`
  padding: 0.5em 1em 0.5em !important;
`;

const Accordion = ({
  active,
  title,
  children,
  editable: editableProps,
  onChange: onChangeProps,
  onEditableChange: onEditableChangeProps,
}) => {
  const [expand, setExpand] = useState(active);
  const [editable, setEditable] = useState(false);

  return (
    <AccordionSUI styled fluid>
      <StyledAccordionSUITitle active={expand}>
        <FlexWrapper>
          <LeftFlex onClick={() => setExpand(!expand)}>
            <Icon name="dropdown" />
            <strong>{title}</strong>
          </LeftFlex>
          {editableProps && (
            <RightFlex>
              {editable ? (
                <>
                  <Button
                    positive
                    basic
                    size="mini"
                    content="Lưu"
                    onClick={async () => {
                      await onChangeProps();
                      onEditableChangeProps(false);
                      setEditable(false);
                    }}
                  />
                  <Button
                    negative
                    basic
                    size="mini"
                    content="Huỷ"
                    onClick={() => {
                      onEditableChangeProps(false);
                      setEditable(false);
                    }}
                  />
                </>
              ) : (
                <Button
                  primary
                  basic
                  size="mini"
                  content="Sửa"
                  onClick={() => {
                    onEditableChangeProps(true);
                    setEditable(true);
                  }}
                />
              )}
            </RightFlex>
          )}
        </FlexWrapper>
      </StyledAccordionSUITitle>
      <StyledAccordionSUIContent active={expand}>{children}</StyledAccordionSUIContent>
    </AccordionSUI>
  );
};

Accordion.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
  editable: PropTypes.bool,
  onChange: PropTypes.func,
  onEditableChange: PropTypes.func,
};

Accordion.defaultProps = {
  active: false,
  title: '',
  children: null,
  editable: false,
  onChange: () => {},
  onEditableChange: () => {},
};

export default Accordion;
