import React, { useEffect, useState, useRef } from "react";
import { alpha } from "@mui/material/styles";
import {
  Typography,
  IconButton,
  Toolbar,
  Tooltip,
  FormControlLabel,
} from "@mui/material";
import { FilterIcon } from "../../../../common/Icons";
import { MdKeyboardArrowRight} from "react-icons/md";

export const EnhancedTableToolbar = ({ numSelected, onAdjudicateClick }) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.secondary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="body1"
          id="tableTitle"
          component="div"
        ></Typography>
      )}

      {numSelected > 0 ? (
        <FormControlLabel
          onClick={onAdjudicateClick}
          style={{ paddingRight: 10, fontSize: 10 }}
          control={
            <MdKeyboardArrowRight
              name="adj"
              value="adjudicate"
              fontSize="small"
            />
          }
          label={
            <Typography
              style={{ flex: "1 1 100%" }}
              color="inherit"
              variant="body1"
              component="div"
            >
              Adjudicate
            </Typography>
          }
          labelPlacement="start"
        />
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};