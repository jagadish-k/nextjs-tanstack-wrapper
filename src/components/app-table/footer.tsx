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
        minWidth: '32px',
        height: '32px',
        lineHeight: '32px',
      }}
    >
      Prev
    </button>

    <span>{currentPage}</span>

    <button
      style={{
        padding: '0 10px',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        minWidth: '32px',
        height: '32px',
        lineHeight: '32px',
      }}
      disabled={!enableNext}
      onClick={handleNext}
    >
      Next
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
