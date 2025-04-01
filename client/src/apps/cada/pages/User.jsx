import React, { useState, useEffect } from "react";
import {
  AppBar,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Paper,
  TablePagination,
  Tabs,
  Tab,
  InputBase,
  FormControl,
  Toolbar,
  Typography
} from "@mui/material";

import { connect } from "react-redux";
import {
  getUsers,
  getProjects,
  addUser,
  removeUser,
  removeProjectUser,
} from "../redux/actions";
import { styled, alpha } from "@mui/material/styles";
import { BiSearchAlt } from "react-icons/bi";
import Row from "../sections/User/UserTableRow";
import NewUser from "../sections/User/NewUser";
import { PlusIcon } from "../common/Icons";

// ----------------------------------------------------------------------

const Search = styled(FormControl)(({ theme }) => ({
  position: "relative",
  fontSize: theme.typography.fontSize,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  display: "flex",
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

// ----------------------------------------------------------------------

function User({
  users,
  projects,
  getUsers,
  addUser,
  removeUser,
  getProjects,
  removeProjectUser,
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [searchKey, setSearchKey] = React.useState("");
  const [values, setValues] = useState({
    fname: "",
    lname: "",
    email: "",
    loginType: "",
    role: "",
    isBot: false,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleFormChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSearch = (event) => {
    setSearchKey(event.target.value);
  };

  const handleRemoveClick = (id) => {
    removeUser(id);
  };

  const handleRemoveRoleClick = (payload) => {
    removeProjectUser(payload);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (projects.length === 0) {
      getProjects();
    }
  }, [projects]);

  useEffect(() => {
    if (users.length === 0) {
      getUsers({ fid: 1 });
    }
  }, [users]);

  return (
    <div>
      {open && <NewUser open={open} handleClose={handleClose} />}
      <AppBar component="div" sx={{ px: 1 }} position="static" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h6" component="h1">
                Users
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="inherit" size="small">
                Report
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar sx={{ pl: 1 }} component="div" position="static" elevation={0}>
        <Tabs value={value} onChange={handleChange}>
          <Tab disableRipple label="Overview" />
        </Tabs>
      </AppBar>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppBar
              sx={{ bgcolor: "rgba(0, 0, 0, 0)", mt: 7, mb: 3 }}
              position="static"
              color="inherit"
              elevation={0}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Search>
                    <SearchIconWrapper>
                      <BiSearchAlt />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search anything"
                      value={searchKey}
                      onChange={handleSearch}
                      inputProps={{ "aria-label": "search" }}
                    />
                  </Search>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleClickOpen}
                    variant="contained"
                    color="primary"
                    startIcon={<PlusIcon />}
                  >
                    New User
                  </Button>
                </Grid>
              </Grid>
            </AppBar>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ p: 2}}>
          <Table size="small" aria-label="simple table" >
            <TableHead>
              <TableRow >
                {/* <TableCell></TableCell> */}
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>LoginType</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Detail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 &&
                users
                  .filter(
                    (data) =>
                      JSON.stringify(data)
                        .toLowerCase()
                        .indexOf(searchKey.toLowerCase()) !== -1
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <Row
                      key={row.id}
                      row={row}
                      handleRemoveClick={handleRemoveClick}
                      handleRemoveRoleClick={handleRemoveRoleClick}
                    />
                  ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 30]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => ({
  users: state.cada.users,
  projects: state.cada.projects,
});

const mapDispatchToProps = (dispatch) => ({
  getUsers: (payload) => dispatch(getUsers(payload)),
  getProjects: () => dispatch(getProjects()),
  addUser: (payload) => dispatch(addUser(payload)),
  removeUser: (id) => dispatch(removeUser(id)),
  removeProjectUser: (payload) => dispatch(removeProjectUser(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(User);
