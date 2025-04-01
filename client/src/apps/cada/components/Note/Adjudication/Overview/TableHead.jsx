import React from "react";
import {
  Box,
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

export const EnhancedTableHead = ({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
}) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: "note",
      numeric: false,
      disablePadding: true,
      label: "NoteId",
    },
    {
      id: "file",
      numeric: true,
      disablePadding: true,
      label: "Filename",
    },
    {
      id: "concepts",
      numeric: true,
      disablePadding: false,
      label: "#OfConcepts",
    },
    {
      id: "annotators",
      numeric: true,
      disablePadding: false,
      label: "#OfAnnotators",
    },
    {
      id: "completed",
      numeric: true,
      disablePadding: false,
      label: "#OfCompleted",
    },
    {
      id: "agreement",
      numeric: true,
      disablePadding: false,
      label: "Agreement",
    },
    {
      id: "adjudicated",
      numeric: true,
      disablePadding: false,
      label: "IsAdjudicated",
    },
  ];

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="secondary"
            size="small"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all records",
            }}
          />
        </TableCell>
        <TableCell />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};