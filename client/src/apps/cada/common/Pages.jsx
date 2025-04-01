import React from "react";
import PropTypes from "prop-types";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Badge from "@mui/material/Badge";

export const Pages = ({ total, page, onChange }) => {
  return (
    <Pagination
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      color="primary"
      size="small"
      count={total}
      page={page}
      showFirstButton
      showLastButton
      boundaryCount={2}
      onChange={onChange}
      renderItem={(item) =>
        item.type === "page" ? (
          <Badge variant="dot">
            <PaginationItem {...item} />
          </Badge>
        ) : (
          <PaginationItem {...item} />
        )
      }
    />
  );
};

Pages.propTypes = {
  total: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

