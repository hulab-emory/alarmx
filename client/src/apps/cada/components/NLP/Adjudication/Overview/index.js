import React, { useEffect, useState, useRef } from "react";
import { alpha } from "@mui/material/styles";
import {
  AppBar,
  Typography,
  Paper,
  Grid,
  Button,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Collapse,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Switch,
  TableSortLabel,
} from "@mui/material";

import {
  MdFilterList as FilterList,
  MdKeyboardArrowRight as KeyboardArrowRight,
  MdCheck,
  MdExpandLess,
  MdExpandMore,
  MdRemove,
} from "react-icons/md";
import { connect, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import useDidMountEffect from "../../../../../../hooks/useDidMountEffect";
import { visuallyHidden } from "@mui/utils";
import { percentageColor } from "../../../../utils/adjudication_helper";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();

const notes = require("../../../../assets/data.json");

const useStyles = {
  root: {
    padding: theme.spacing(0),
  },
  overview: {
    padding: theme.spacing(2),
  },
  detail: {
    padding: theme.spacing(2),
  },
  paper: {
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  secondaryBar: {
    zIndex: 0,
    paddingLeft: 20,
    padding: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing(0),
  },
  iconButtonAvatar: {
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover": {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
  paper1: {
    position: "sticky",
    top: "1rem",
    minWidth: "275",
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  highlight1: {
    color: "rgba(0, 0, 0, 0.70)",
    fontSize: "18px",
    lineHeight: "2em",
    borderBottomStyle: "solid",
    borderBottomWidth: "4px",
    borderBottomColor: "#f57c00",
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
  },
  highlight2: {
    backgroundColor: "#1abc9c",
    borderRadius: "5px",
    padding: "1px 4px",
    color: "white",
  },
  highlight3: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "5px",
    padding: "0px 6px",
    color: "white",
  },
  download: {
    border: "none",
    top: 5,
    borderRadius: 20,
    paddingInline: 10,
    paddingBlock: 8,
  },
  pages: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  customBadge: {
    backgroundColor: "#2ecc71",
  },
  footer: {
    position: "fixed",
    padding: theme.spacing(2),
    left: 0,
    bottom: 0,
    right: 0,
  },
  avatar: {
    color: "white",
  },
  noteDropdpwn: {
    minWidth: 100,
    paddingLeft: theme.spacing(1),
  },
  formControl: {
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
  row: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: "#f39c12",
    color: theme.palette.common.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  spacer: {
    flex: "1 1 auto",
  },
};

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
    if (order !== 0) return order;
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
            <KeyboardArrowRight name="adj" value="adjudicate" size={25} />
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
            <FilterList />
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

function getConcepts(annotations) {
  let concepts = {};
  let temp = {};
  for (const element of annotations) {
    let annotationObj = element.cadaAnnotationValues;
    if (annotationObj.length > 0) {
      for (const val of annotationObj) {
        if (temp[val.field]) {
          if (temp[val.field][element.userId]) {
            temp[val.field][element.userId] =
              temp[val.field][element.userId][val.id] > val.id
                ? temp[val.field][element.userId]
                : { id: val.id, value: val.value };
          } else {
            temp[val.field][element.userId] = {
              id: val.id,
              value: val.value,
            };
          }
        } else {
          temp[val.field] = {
            [element.userId]: { id: val.id, value: val.value },
          };
        }
      }
    }
  }
  concepts["annotationDetail"] = Object.keys(temp).map((c) => ({
    conceptId: c,
    value: temp[c],
  }));
  return concepts;
}

function calculateNoteAgreement(note) {
  let percentage = 0;
  let temp = [];
  let average = (array) => array.reduce((a, b) => a + b) / array.length;
  if (Object.keys(note).length === 0) {
    percentage = 0;
  } else {
    for (let con in note) {
      temp.push(note[con][1]);
    }
    percentage = average(temp);
  }

  return parseInt(percentage, 10);
}

function isAdjudicated(noteAdj) {
  if (noteAdj.length > 0) {
    return <MdCheck style={{ color: "#079992" }} />;
  }
  return <MdRemove />;
}

function getConceptValueRows(values, agreement) {
  return (
    <React.Fragment>
      <TableCell align="right">
        {Object.keys(values.isDetected).map((q, i) =>
          q === "" ? (
            ""
          ) : (
            <span key={i}>
              {q}
              <span
                style={{
                  color: "#fff",
                  backgroundColor: "rgba(26, 188, 156, 0.7)",
                  marginLeft: 1,
                  marginRight: 5,
                  paddingInline: "4px",
                  border: "1px solid",
                  borderRadius: "5px",
                  fontSize: 12,
                }}
              >
                {values.isDetected[q]}
              </span>
            </span>
          )
        )}
      </TableCell>
      <TableCell align="right">
        {Object.keys(values.isEncounter).map((q, i) =>
          q === "" ? (
            ""
          ) : (
            <span key={i}>
              {q}
              <span
                style={{
                  color: "#fff",
                  backgroundColor: "rgba(26, 188, 156, 0.7)",
                  marginLeft: 1,
                  marginRight: 5,
                  paddingInline: "4px",
                  border: "1px solid",
                  borderRadius: "5px",
                  fontSize: 12,
                }}
              >
                {values.isEncounter[q]}
              </span>
            </span>
          )
        )}
      </TableCell>
      <TableCell align="right">
        {Object.keys(values.isNegated).map((q, i) =>
          q === "" ? (
            ""
          ) : (
            <span key={i}>
              {q}
              <span
                style={{
                  color: "#fff",
                  backgroundColor: "rgba(26, 188, 156, 0.7)",
                  marginLeft: 1,
                  marginRight: 5,
                  paddingInline: "4px",
                  border: "1px solid",
                  borderRadius: "5px",
                  fontSize: 12,
                }}
              >
                {values.isNegated[q]}
              </span>
            </span>
          )
        )}
      </TableCell>
      <TableCell align="right">{agreement} %</TableCell>
    </React.Fragment>
  );
}

function createData(
  note,
  file,
  concepts,
  annotators,
  completed,
  agreement,
  adjudicated,
  processedConcepts
) {
  return {
    note,
    file,
    concepts,
    annotators,
    completed,
    agreement,
    adjudicated,
    ...processedConcepts,
  };
}

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

function Overview({
  events,
  project,
  selectedIds,
  setSelected,
  handleClickAdjudicate,
}) {
  const params = useParams();

  const [annotatedNotes, setAnnotatedNotes] = React.useState({});
  const [adjudicatedNotes, setAdjudicatedNotes] = React.useState({});
  const [annotatedConcept, setAnnotatedConcept] = React.useState({});
  const [annotationResult, setAnnotationResult] = React.useState({});
  const [noteIdx, setNote] = React.useState(0);
  const [conceptIdx, setConcept] = React.useState(0);
  const [detected, setDetected] = React.useState("");
  const [encounter, setEncounter] = React.useState("");
  const [negated, setNegated] = React.useState("");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("note");
  const [expanded, setExpanded] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tab, setTab] = React.useState(0);

  const annotators = useSelector((state) =>
    state.cada.annotators ? state.cada.annotators : null
  );

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  const handleRequestSort = (e, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = events.map((n, i) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (e, name) => {
    const selectedIndex = selectedIds.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected.sort());
  };

  const handleExpandClick = (e, name) => {
    const selectedIndex = expanded.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(expanded, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(expanded.slice(1));
    } else if (selectedIndex === expanded.length - 1) {
      newSelected = newSelected.concat(expanded.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        expanded.slice(0, selectedIndex),
        expanded.slice(selectedIndex + 1)
      );
    }

    setExpanded(newSelected);
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
  const isExpanded = (name) => expanded.indexOf(name) !== -1;

  useDidMountEffect(() => {
    console.log("useDidMountEffect:    ", annotators);
  }, [annotators]);

  console.log("Overview:    ", events);
  const rows = events.map((note) =>
    createData(
      note.id,
      note.cadaFile.path.split("/").pop(),
      notes[noteIdx] && notes[noteIdx].info.length,
      note.cadaAnnotations.length,
      getCompleted(note.cadaAnnotations),
      calculateNoteAgreement(annotationResult),
      isAdjudicated(note.cadaAdjudicationValues),
      getConcepts(note.cadaAnnotations)
    )
  );
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div style={{ ...useStyles.overview }}>
      <Paper style={{ ...useStyles.paper }}>
        <EnhancedTableToolbar
          numSelected={selectedIds.length}
          onAdjudicateClick={handleClickAdjudicate}
        />
        <TableContainer>
          <Table
            style={{ ...useStyles.table }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
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
                  const isItemSelected = isSelected(row.note);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <React.Fragment>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.note}
                        selected={isItemSelected}
                      >
                        <TableCell
                          onClick={(event) =>
                            handleCheckboxClick(event, row.note)
                          }
                          padding="checkbox"
                        >
                          <Checkbox
                            size="small"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={(event) =>
                              handleExpandClick(event, row.note)
                            }
                          >
                            {isExpanded(row.note) ? (
                              <MdExpandLess />
                            ) : (
                              <MdExpandMore />
                            )}
                          </IconButton>
                        </TableCell>

                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.note}
                        </TableCell>
                        <TableCell align="right">{row.file}</TableCell>
                        <TableCell align="right">{row.concepts}</TableCell>
                        <TableCell align="right">{row.annotators}</TableCell>
                        <TableCell align="right">{row.completed}</TableCell>
                        <TableCell align="right">
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
                            {row.agreement} %
                          </span>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            {row.adjudicated}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={12}
                        >
                          <Collapse
                            in={isExpanded(row.note)}
                            timeout="auto"
                            mountOnEnter
                            unmountOnExit
                          >
                            <Box margin={2}>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>concept</TableCell>
                                    <TableCell>trigger</TableCell>
                                    <TableCell align="right">
                                      isDetected
                                    </TableCell>
                                    <TableCell align="right">
                                      isEncounter
                                    </TableCell>
                                    <TableCell align="right">
                                      isNegated
                                    </TableCell>
                                    <TableCell align="right">
                                      Agreement
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {notes[row.file.split(".")[0]] &&
                                    notes[row.file.split(".")[0]].info.map(
                                      (conceptRow, i) => (
                                        <TableRow key={i}>
                                          <TableCell component="th" scope="row">
                                            {conceptRow.concept}{" "}
                                          </TableCell>
                                          <TableCell>
                                            {conceptRow.trigger_word}
                                          </TableCell>
                                          {annotationResult[row.note] &&
                                          annotationResult[row.note][i] ? (
                                            getConceptValueRows(
                                              annotationResult[row.note][i][0],
                                              annotationResult[row.note][i][1]
                                            )
                                          ) : (
                                            <React.Fragment>
                                              <TableCell align="right">
                                                {"-"}
                                              </TableCell>
                                              <TableCell align="right">
                                                {"-"}
                                              </TableCell>
                                              <TableCell align="right">
                                                {"-"}
                                              </TableCell>
                                              <TableCell align="right">
                                                {"-"}
                                              </TableCell>
                                            </React.Fragment>
                                          )}
                                        </TableRow>
                                      )
                                    )}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <FormControlLabel
          style={{ marginLeft: 5, marginTop: 15 }}
          control={
            <Switch size="small" checked={dense} onChange={handleChangeDense} />
          }
          label="dense"
        />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default Overview;
