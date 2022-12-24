import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FiMoreHorizontal, FiChevronsLeft, FiChevronsRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Segment, Pagination as SemanticPagination, Select } from 'semantic-ui-react';

const Wrapper = styled(Segment)`
  display: flex;
  padding: 0.5rem !important;
  box-shadow: none !important;
  background: #f9fafb !important;
  text-align: inherit;
  vertical-align: middle;
  color: rgba(0, 0, 0, 0.87);
  margin: 8px 0 !important;
  & .pagination {
    box-shadow: none;
  }
`;
const RightWrapper = styled.div`
  margin-left: auto;
`;
// const StyledCurrentCount = styled.div`
//   line-height: 36px;
//   font-size: 16px;
//   font-weight: bold;
//   padding: 0.25rem;
// `;

const StyledSelect = styled(Select)`
  min-width: 8em !important;
`;

const Pagination = ({ pageIndex, pageSize, pageCount, totalCounts, gotoPage, setPageSize }) => (
  <Wrapper>
    <SemanticPagination
      size="mini"
      activePage={pageIndex + 1}
      totalPages={pageCount || Math.ceil(totalCounts / pageSize)}
      ellipsisItem={{ content: <FiMoreHorizontal />, icon: true }}
      firstItem={{ content: <FiChevronsLeft />, icon: true }}
      lastItem={{ content: <FiChevronsRight />, icon: true }}
      prevItem={{ content: <FiChevronLeft />, icon: true }}
      nextItem={{ content: <FiChevronRight />, icon: true }}
      onPageChange={(event, data) => gotoPage(data.activePage - 1)}
    />
    <RightWrapper>
      {/* {totalCount !== 0 && (
        <StyledCurrentCount>{`Tổng: ${totalCount}`}</StyledCurrentCount>
      )} */}
      <StyledSelect
        value={pageSize}
        options={[10, 20, 30, 40, 50].map((o) => ({
          value: o,
          text: `Hiển thị: ${o}`,
        }))}
        onChange={(event, data) => setPageSize(data.value)}
      />
    </RightWrapper>
  </Wrapper>
);
Pagination.propTypes = {
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  pageCount: PropTypes.number,
  totalCounts: PropTypes.number,
  gotoPage: PropTypes.func,
  setPageSize: PropTypes.func,
};

Pagination.defaultProps = {
  pageIndex: 0,
  pageSize: 10,
  pageCount: 0,
  totalCounts: 0,
  gotoPage: () => {},
  setPageSize: () => {},
};

export default Pagination;
