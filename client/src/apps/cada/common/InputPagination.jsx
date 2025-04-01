import React from "react";
import PropTypes from "prop-types";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Badge from "@mui/material/Badge";
import { Box, Input, Typography } from "@mui/material";

export const InputPagination = ({ total, page, onChange, onInput }) => {
  const handleSubmit = (e) => {
    const value = parseInt(e.target.value);
    if (
      onInput !== undefined &&
      e.key === "Enter" &&
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 1
    ) {
      onInput(value);
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Box display="flex" justifyContent="center" alignItems="center">
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
        <Typography
          variant="caption"
          ml={2}
          mr={1}
          color="1px solid rgb(120, 120, 120)"
        >
          Go to page{" "}
        </Typography>
        <Input
          disableUnderline
          onKeyDown={handleSubmit}
          sx={{
            border: "1px solid rgb(120, 120, 120)",
            borderRadius: "5px",
            paddingInline: "5px",
            height: "30px",
            width: "30px",
          }}
        />
      </Box>
    </Box>
  );
};

InputPagination.propTypes = {
  total: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
};
