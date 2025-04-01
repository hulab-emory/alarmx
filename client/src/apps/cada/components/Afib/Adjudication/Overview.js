import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import { percentageColor } from "../../../utils/adjudication_helper";
import { FilterIcon } from "../../../common/Icons";
import { MdKeyboardArrowRight, MdCheck, MdRemove } from "react-icons/md";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

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
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onAdjudicateClick } = props;

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
            <MdKeyboardArrowRight name="adj" value="adjudicate" size={25} />
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
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onAdjudicateClick: PropTypes.func.isRequired,
};

function getCompleted(annotations) {
  let completed = 0;
  for (const element of annotations) {
    if (element.completed === true) {
      completed = completed + 1;
    }
  }
  return completed;
}

function getAgreement(ann, id) {
  return (
    <span style={{ display: "inline" }}>
      {Object.keys(ann[id]).map((classifier) => (
        <span key={classifier}>
          {classifier}
          <span
            style={{
              color: "#fff",
              backgroundColor: "rgba(26, 188, 156, 0.75)",
              marginInline: 2,
              padding: "4px 4px",
              border: "1px solid",
              borderRadius: "4px",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {ann[id][classifier].length}
          </span>
        </span>
      ))}
    </span>
  );
}

function getReliability(ann) {
  let percentage = 0;
  let max = 0;
  let sum = 0;

  for (let val in ann) {
    max = ann[val].length > max ? ann[val].length : max;
  }
  sum = Object.keys(ann)
    .map((a) => ann[a].length)
    .reduce((partialSum, a) => partialSum + a, 0);
  percentage = Math.round((max / sum) * 100);
  return percentage;
}

function getAdjudicationValue(noteAdj) {
  if (noteAdj.length > 0) {
    let maxId = noteAdj.length > 0 ? noteAdj[0].id : null;

    noteAdj.forEach((adjudicationValue) => {
      if (adjudicationValue.id > maxId) {
        maxId = adjudicationValue.id;
      }
    });
    return <MdCheck style={{ color: "#079992" }} />;
  }
  return <MdRemove />;
}

function createData(
  record,
  annotators,
  completed,
  agreement,
  reliability,
  adjudicated
) {
  return {
    record,
    annotators,
    completed,
    agreement,
    reliability,
    adjudicated,
  };
}

const headCells = [
  { id: "record", numeric: false, disablePadding: true, label: "EventId" },
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
  { id: "agreement", numeric: true, disablePadding: false, label: "Agreement" },
  {
    id: "reliability",
    numeric: true,
    disablePadding: false,
    label: "Reliability",
  },
  {
    id: "adjudicated",
    numeric: true,
    disablePadding: false,
    label: "Adjudication",
  },
];

export default function Overview({
  events,
  selectedIds,
  annotatedRecords,
  handleSelectAllClick,
  handleCheckboxClick,
  handleClickAdjudicate,
}) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("note");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (e, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (e) => {
    setDense(e.target.checked);
  };

  const isSelected = (name) => selectedIds.indexOf(name) !== -1;

  if (events && Object.keys(annotatedRecords).length > 0) {
    const rows = events.map((record) =>
      createData(
        record.id,
        record.cadaAnnotations.length,
        getCompleted(record.cadaAnnotations),
        getAgreement(annotatedRecords, record.id),
        getReliability(annotatedRecords[record.id]),
        getAdjudicationValue(record.cadaAdjudicationValues)
      )
    );

    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    console.log("rows:", rows);

    return (
      <Box sx={{ flexGrow: 1 }}>
        <Paper sx={{ color: "secondary.main", m: 2 }}>
          <EnhancedTableToolbar
            numSelected={selectedIds.length}
            onAdjudicateClick={handleClickAdjudicate}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selectedIds.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.record);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.record}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell
                          onClick={(e) => handleCheckboxClick(e, row.record)}
                          padding="checkbox"
                        >
                          <Checkbox
                            color="secondary"
                            size="small"
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.record}{" "}
                        </TableCell>
                        <TableCell align="right">{row.annotators}</TableCell>
                        <TableCell align="right">{row.completed}</TableCell>
                        <TableCell align="right">{row.agreement}</TableCell>

                        <TableCell align="right">
                          {" "}
                          <span
                            style={{
                              backgroundColor: percentageColor(row.agreement)
                                .color,
                              borderRadius: "4px",
                              padding: "2px 4px",
                              color: "white",
                              display: "inline-block",
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: 12,
                              minWidth: 35,
                            }}
                          >
                            {row.reliability} %
                          </span>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            {row.adjudicated}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    sx={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={12} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <FormControlLabel
            sx={{ ml: 1, mt: 1, color: "text.secondary" }}
            control={
              <Switch
                size="small"
                color="secondary"
                checked={dense}
                onChange={handleChangeDense}
              />
            }
            label="dense"
          />
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    );
  } else return "";
}
