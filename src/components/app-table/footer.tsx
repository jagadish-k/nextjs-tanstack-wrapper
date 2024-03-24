import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';

import { CustomFooterProps } from './types';

export const CustomFooter: React.FC<CustomFooterProps> = ({
  handlePrev,
  currentPage,
  handleNext,
  availablePageSizes,
  pageSize = 15,
  handlePageSizeChange,
  enableNext = true,
  enablePrev = true,
}) => (
  <div
    style={{
      display: 'flex',
      padding: 0,
      width: '100%',
      alignItems: 'center',
    }}
  >
    <button
      disabled={!enablePrev}
      onClick={handlePrev}
      style={{
        padding: '0 10px',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '50%',
        minWidth: '40px',
        height: '40px',
        lineHeight: '40px',
        margin: '0 15px',
      }}
    >
      <VscChevronLeft />
    </button>

    <span
      style={{
        margin: '0 5px',
      }}
    >
      {currentPage}
    </span>

    <button
      style={{
        borderRadius: '50%',
        padding: '0 10px',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        minWidth: '40px',
        height: '40px',
        lineHeight: '40px',
        margin: '0 15px',
      }}
      disabled={!enableNext}
      onClick={handleNext}
    >
      <VscChevronRight />
    </button>

    <select id="demo-select-small" value={pageSize} onChange={handlePageSizeChange} name="num-rows-selector">
      {availablePageSizes?.map((size) => (
        <option key={size} value={size}>
          Rows per page {size}
        </option>
      ))}
    </select>
  </div>
);
