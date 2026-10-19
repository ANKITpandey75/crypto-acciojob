import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import "./styles.css"

export default function PaginationComponent({page, handlePageChange}) {

  return (
    <div className='pagination-component'>
      
      <Pagination 
      count={10} 
      page={page} 
      siblingCount={1}
      boundaryCount={1}
      showFirstButton
      showLastButton
      shape="rounded"
      onChange={(event, value) => handlePageChange(event, value)}
      sx={{
        color: "var(--white)",
        "& .MuiPaginationItem-root": {
            color: "var(--white)",
            border: "1px solid var(--gray)",
            fontWeight: 600,
            transition: "all 0.2s ease",
        },
        "& .MuiPaginationItem-root:hover": {
            backgroundColor: "rgba(58, 128, 233, 0.16)",
            borderColor: "var(--blue)",
        },
        "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "var(--blue) !important",
            color: "var(--white) !important",
            borderColor: "var(--blue) !important",
        },
        "& .MuiPaginationItem-ellipsis": {
            color: "var(--gray)",
            border: "none",
        },
        "& .MuiPaginationItem-icon": {
            color: "var(--white)",
        },
      }}
      />
    </div>
  );
}
