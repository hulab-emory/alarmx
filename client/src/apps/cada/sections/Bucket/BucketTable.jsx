import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Toolbar,
  Tooltip,
  Checkbox,
  FormControlLabel,
  IconButton,
  Box,
  Input,
  Dialog,
} from "@mui/material";

import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import { FolderIcon, FileIcon } from "../../common/Icons";
import { MdFilterList, MdKeyboardArrowRight } from "react-icons/md";
import AssignDialog from "./AssignFileDialog";
import { set } from "lodash";
import axios from "axios";

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

const headCells = [
  { id: "Name", numeric: false, disablePadding: false, label: "Name" },
  { id: "Type", numeric: false, disablePadding: true, label: "Type" },
  { id: "Path", numeric: false, disablePadding: false, label: "Path" },
  { id: "Ext", numeric: false, disablePadding: false, label: "Ext" },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    fileLength,
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
            indeterminate={numSelected > 0 && numSelected < fileLength}
            checked={fileLength > 0 && numSelected === fileLength}
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
  fileLength: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onAssignClick, onFilterClick, reset } = props;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleFilterClick = () => {
    const fromInt = Number(from);
    const toInt = Number(to);
    if (!Number.isInteger(fromInt) || !Number.isInteger(toInt) || fromInt > toInt) {
      return;
    }

    console.log(fromInt, toInt);

    onFilterClick(curr => curr.slice(fromInt - 1, toInt));
  }

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
        >
          Buckets
        </Typography>
      )}

      {numSelected > 0 ? (
        <FormControlLabel
          onClick={onAssignClick}
          style={{ paddingRight: 10, fontSize: 10 }}
          control={
            <MdKeyboardArrowRight
              name="adj"
              value="adjudicate"
              size={25}
            />
          }
          label={
            <Typography
              style={{ flex: "1 1 100%" }}
              color="inherit"
              variant="body1"
              component="div"
            >
              Assign
            </Typography>
          }
          labelPlacement="start"
        />
      ) : (
        <>
          <div className="" style={{ display: "flex" }}>
            <Typography
              sx={{ lineHeight: "32px", marginRight: 1 }}
              variant="body1"
              id="tableTitle"
              component="div"
            >
              From
            </Typography>
            <Input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <Typography
              sx={{ lineHeight: "32px", marginRight: 1, marginLeft: 1 }}
              variant="body1"
              id="tableTitle"
              component="div"
            >
              to
            </Typography>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <Tooltip title="Filter list">
            <IconButton onClick={handleFilterClick}>
              <MdFilterList />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset">
            <IconButton onClick={reset}>
              <MdFilterList />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onAssignClick: PropTypes.func.isRequired,
};

function EnhancedTable({ path, paths, handleClickDir, fileLength }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("Id");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  // eslint-disable-next-line
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currPaths, setCurrPaths] = useState(paths);

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [fileType, setFileType] = useState("");
  const [fileInfo, setFileInfo] = useState("");
  const [project, setProject] = useState(1);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = currPaths.filter(p => p.type === "file").map((n, i) => i);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };

  const handleAssign = async () => {

    try {
      const selectedFiles = selected.map(i => ({
        path: `${path}/${currPaths[i].path}`,
        type: fileType, info: fileInfo,
        ext: currPaths[i].path.split(".")[1]
      }));
      const response = await axios({
        method: "post",
        url: "/api/cada/file/",
        data: { files: selectedFiles },
        headers: { "Content-Type": "application/json" },
      });
      if (response.status !== 200) {
        console.error("Error assigning files: ", response.data);
        return;
      }

      const cadaFiles = response.data;

      // add project events
      const eventReponse = await axios({
        method: "post",
        url: `/api/cada/event?pid=${project}`,
        data: { files: cadaFiles.map(f => f.id) },
      });

      if (eventReponse.status !== 200) {
        console.error("Error creating events: ", eventReponse.data);
        return;
      }
      
      setAssignDialogOpen(false);
      setSelected([]);
    } catch (err) {
      console.error("Error assigning files: ", err);
    }
  };

  useEffect(() => {
    setSelected([]);
  }, [paths]);

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, fileLength - page * rowsPerPage);

  return (
    <div>
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
      >
        <AssignDialog
          fileType={fileType}
          setFileType={setFileType}
          fileInfo={fileInfo}
          setFileInfo={setFileInfo}
          project={project}
          setProject={setProject}
          handleClose={() => setAssignDialogOpen(false)}
          handleAssign={handleAssign}
        />
      </Dialog>
      <Paper>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onAssignClick={() => setAssignDialogOpen(true)}
          onFilterClick={setCurrPaths}
          reset={() => setCurrPaths(paths)}
        />
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              fileLength={currPaths.length}
            />
            <TableBody>
              {currPaths && currPaths.length > 0 &&
                stableSort(currPaths, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(index);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => row.type === "file" ? handleClick(event, index) : handleClickDir(row.path)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            size="small"
                            checked={isItemSelected}
                            onClick={() => row.type === "file" ? {} : handleClickDir(row.path)}
                            disabled={row.type === "file" ? false : true}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            {row.type === "file" ? <FileIcon /> : <FolderIcon style={{ marginRight: 5 }} />} {row.path}
                          </div>
                        </TableCell>
                        <TableCell padding="none">{row.type === 'dir' ? 'folder' : 'file'}</TableCell>
                        <TableCell>{path}</TableCell>
                        <TableCell>{row.path.split(".")[1]} </TableCell>
                      </TableRow>
                    );
                  })
              }
              {/* {paths.dir &&
                paths.dir.length > 0 &&
                stableSort(paths.dir, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(index);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            size="small"
                            onClick={() => handleClickDir(row.path)}
                            disabled
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                            onClick={() => handleClickDir(row.path)}
                          >
                            <FolderIcon style={{ marginRight: 5 }} /> {row.path}
                          </div>
                        </TableCell>
                        <TableCell padding="none">folder</TableCell>
                        <TableCell>{path}</TableCell>
                        <TableCell>{row.path.split(".")[1]}</TableCell>
                      </TableRow>
                    );
                  })}
              {paths.file &&
                paths.file.length > 0 &&
                stableSort(paths.file, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(index);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, index)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            size="small"
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            <FileIcon /> {row.path}
                          </div>
                        </TableCell>
                        <TableCell padding="none">file</TableCell>
                        <TableCell>{path}</TableCell>
                        <TableCell>{row.path.split(".")[1]} </TableCell>
                      </TableRow>
                    );
                  })} */}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={fileLength}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <style>
        {`
        .MuiTableCell-body {
          user-select: none; 
        }

        .MuiInput-input {
          width: 40px;
          margin: 0 5px;
        }
      `}
      </style>

    </div>
  );
}

export default EnhancedTable;
