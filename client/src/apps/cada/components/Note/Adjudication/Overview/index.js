import React, { useState } from "react";
import {
  Paper,
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
} from "@mui/material";
import { overviewStyles } from "../styles";
import { MdCheck, MdExpandLess, MdExpandMore, MdRemove } from "react-icons/md";
import { EnhancedTableHead } from "./TableHead";
import { calculateNoteAgreement, createData, getComparator, getCompleted, getConcepts, isAdjudicated, percentageColor, stableSort } from "./utils";
import { EnhancedTableToolbar } from "./TableToolBar";
import { sortPaths } from "../../../../../../utils/fileFunctions";

const notes = require("../../../../assets/data.json");

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

export default function Overview({ project, events, selectedIds, setSelectedIds, handleClickAdjudicate }) {
  // const [annotatedNotes, setAnnotatedNotes] = useState({});
  // const [adjudicatedNotes, setAdjudicatedNotes] = useState({});
  // const [annotatedConcept, setAnnotatedConcept] = useState({});
  const [annotationResult, setAnnotationResult] = useState({});
  const [noteIdx, setNote] = useState(0);
  // const [conceptIdx, setConcept] = useState(0);
  // const [detected, setDetected] = useState("");
  // const [encounter, setEncounter] = useState("");
  // const [negated, setNegated] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("note");
  const [expanded, setExpanded] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tab, setTab] = useState(0);

  // const annotators = useSelector((state) =>
  //   state.cada.annotators ? state.cada.annotators : null
  // );

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = events.map((n, i) => n.id);
      setSelectedIds(newSelecteds);
      return;
    }
    setSelectedIds([]);
  };

  const handleRequestSort = (e, property) => {

    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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

    setSelectedIds(newSelected.sort());
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

  const rows = events.map((note) =>
    createData(
      note.id,
      note.cadaFile.path.split("/").pop(),
      notes[noteIdx]?.info?.length || '-',
      note.cadaAnnotations.length,
      getCompleted(note.cadaAnnotations),
      calculateNoteAgreement(annotationResult),
      isAdjudicated(note.cadaAdjudicationValues),
      getConcepts(note.cadaAnnotations)
    )
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div style={{ ...overviewStyles.overview }}>
      <Paper style={{ ...overviewStyles.paper }}>
        <EnhancedTableToolbar
          numSelected={selectedIds.length}
          onAdjudicateClick={handleClickAdjudicate}
        />
        <TableContainer>
          <Table
            style={{ ...overviewStyles.table }}
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
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                .map((row, index) => {
                  const isItemSelected = isSelected(row.note);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <React.Fragment key={index}>
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
                        <TableCell align="right">
                          {row.concepts}
                        </TableCell>
                        <TableCell align="right">
                          {row.annotators}
                        </TableCell>
                        <TableCell align="right">
                          {row.completed}
                        </TableCell>
                        <TableCell align="right">
                          <span
                            style={{
                              backgroundColor: percentageColor(
                                row.agreement
                              ).color,
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
                              <Table
                                size="small"
                                aria-label="purchases"
                              >
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
                                  {notes[row.file.split(".")[0]]
                                    && notes[row.file.split(".")[0]].info.map((conceptRow, i) => (
                                      <TableRow key={i}>
                                        <TableCell
                                          component="th"
                                          scope="row"
                                        >
                                          {conceptRow.concept}{" "}
                                        </TableCell>
                                        <TableCell>
                                          {conceptRow.trigger_word}
                                        </TableCell>
                                        {annotationResult[row.note] &&
                                          annotationResult[row.note][i] ? (
                                          getConceptValueRows(
                                            annotationResult[row.note][
                                            i
                                            ][0],
                                            annotationResult[row.note][
                                            i
                                            ][1]
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
                                    ))}
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
                <TableRow
                  style={{ height: (dense ? 33 : 53) * emptyRows }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <FormControlLabel
          style={{ marginLeft: 5, marginTop: 15 }}
          control={
            <Switch
              size="small"
              checked={dense}
              onChange={handleChangeDense}
            />
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
  )
}
