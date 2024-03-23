import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, FormControl, IconButton, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';

interface CustomFooterProps {
  handlePrev?: () => void;
  currentPage: number;
  handleNext?: () => void;
  availablePageSizes?: number[];
  pageSize?: number;
  handlePageSizeChange?: (event: SelectChangeEvent<number>) => void;
  enableNext?: boolean;
  enablePrev?: boolean;
}

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
  <Box
    sx={{
      display: 'flex',
      padding: 0,
      width: '100%',
      alignItems: 'center',
    }}
  >
    <IconButton
      disabled={!enablePrev}
      onClick={handlePrev}
      sx={{
        padding: 0,
        border: '1px solid rgba(0, 0, 0, 0.23)',
        minWidth: '32px',
        height: '32px',
        lineHeight: '32px',
      }}
    >
      <ArrowBack />
    </IconButton>

    <Typography variant="caption" mx={'6px'}>
      {currentPage}
    </Typography>

    <IconButton disabled={!enableNext} onClick={handleNext}>
      <ArrowForward />
    </IconButton>

    <FormControl sx={{ ml: '15px', minWidth: 120 }} size="small">
      <Select labelId="demo-select-small-label" id="demo-select-small" value={pageSize} onChange={handlePageSizeChange}>
        {availablePageSizes?.map((size) => (
          <MenuItem key={size} value={size}>
            Rows per page {size}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);
