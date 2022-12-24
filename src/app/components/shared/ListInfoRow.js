import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Popup } from 'semantic-ui-react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 1rem;

  & .item {
    display: flex;
    flex-direction: row;
    padding-right: 0.75rem !important;
    border-right: 0.075rem solid rgba(34, 36, 38, .15);

    &:last-child {
      margin-right: 0 !important;
      padding-right: 0 !important;
      border-right: unset !important;
    }

    &-icon {
      padding: 0.75rem 0.75rem;

      & i {
        margin: unset !important;
        vertical-align: middle;
        width: unset !important;
        height: unset !important;
        line-height: 1 !important;
        
        &:before {
          font-size: 1.4rem;
        }
      }
    }

    &-content {
      display: flex;
      flex-direction: column;

      &__header {
        font-weight: 700;
        font-size: 1.125rem;
      }

      &__description {

      }
    }
  }
`;

const ListInfoRow = ({ data }) => {
  const subStringUtil = (string = '', displayLength) => {
    if (!string) {
      return null;
    }
    if (string.length <= displayLength) {
      return string;
    }
    return `${string.substr(0, displayLength / 2)}...${string.substr(
      string.length - displayLength / 2,
    )}`;
  };

  return (
    <Wrapper>
      {data
        .filter((d) => d?.content)
        .map((d) => (
          <div key={d.label} className="item">
            <div className="item-icon">
              <i className={`${d.icon} icon`} />
            </div>
            <div className="item-content">
              <div className="item-content__header">
                {d.label}
              </div>
              <div className="item-content__description">
                {typeof d?.maxLength !== 'undefined' && (
                  <Popup
                    pinned
                    content={d.content}
                    trigger={
                      <span>
                        {subStringUtil(d.content, d.maxLength)}
                      </span>
                    }
                  />
                )}
                {typeof d?.maxLength === 'undefined' && d.content}
              </div>
            </div>
          </div>
        ))
      }
    </Wrapper>
  );
};

ListInfoRow.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      label: PropTypes.string,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      maxLength: PropTypes.number,
    }),
  ).isRequired,
};

export default React.memo(ListInfoRow);
