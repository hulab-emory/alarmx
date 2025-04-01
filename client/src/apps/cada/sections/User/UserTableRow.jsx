import { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  Typography,
  TableRow,
  Box,
  Dialog,
  IconButton,
  Collapse,
  Toolbar,
  styled,
  TableCell,
  Avatar as MuiAvatar,
  Stack,
  tableCellClasses,
} from "@mui/material";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { FaRobot } from "react-icons/fa";
import { GoX } from "react-icons/go";
import { MdOutlineLibraryAddCheck } from "react-icons/md";
import AddRoleDailog from "./AddProjectUserDialog";
import { useSelector, useDispatch } from "react-redux";
import AssignRecordsDailog from "./AssignRecordsDialog";
import Avatar, { genConfig } from "react-nice-avatar";
import { MdDriveFileRenameOutline, MdDeleteForever } from "react-icons/md";
import PopConfirm from "../../../../common/PopConfirm";
import axios from "axios";
import EditUser from "./EditUser";
import Label from "../../common/Label";

// ----------------------------------------------------------------------

async function removeProjectRole(projectId, userId, role) {
  console.log(`/api/cada/project/${projectId}/users/${userId}?role=${role}`);
  return fetch(`/api/cada/project/${projectId}/users/${userId}?role=${role}`, {
    method: "DELETE",
    mode: "cors", //include this to fetch without body
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((data) => data.json());
}

// ----------------------------------------------------------------------

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// ----------------------------------------------------------------------

function UserRowCollapse({ open, row }) {
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [assignRecordsOpen, setAssignRecordsOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const dispatch = useDispatch();

  const userProjectRoles = useSelector((state) =>
    state.cada.userProjectRoles[row.id]
      ? state.cada.userProjectRoles[row.id]
      : null
  );

  const handleAddRoleClick = () => {
    setAddRoleOpen(true);
  };
  const handleAddRoleClose = () => {
    setAddRoleOpen(false);
  };

  const handleAssignRecordsClick = (event, id) => {
    console.log("handleAssignRecordsClick", id);
    setCurrentProject(id);
    setAssignRecordsOpen(true);
  };
  const handleAssignRecordsClose = () => {
    setCurrentProject(null);
    setAssignRecordsOpen(false);
  };

  const handleRemoveRoleClick = async (pUser) => {
    const userRole = await removeProjectRole(
      pUser.cadaProjectId,
      pUser.userId,
      pUser.role
    );
    if (userRole) {
      let userProjects = [];
      let project = userProjectRoles.find(
        (project) => project.id === parseInt(pUser.cadaProjectId, 10)
      );
      if (project) {
        userProjects = userProjectRoles.map((p) =>
          p.id === parseInt(pUser.cadaProjectId, 10)
            ? {
                ...p,
                cadaProjectUsers: p.cadaProjectUsers.filter(
                  (u) => u.id !== pUser.id
                ),
              }
            : p
        );
      }
      dispatch({
        type: "ADD_PROJECT_USER",
        userId: pUser.userId,
        payload: userProjects,
      });
    }
  };

  useEffect(() => {
    if (userProjectRoles === null) {
      axios({
        method: "get",
        url: `/api/cada/project/users/${row.id}`,
      }).then((res) => {
        dispatch({
          type: "ADD_PROJECT_USER",
          userId: row.id,
          payload: res.data,
        });
      });
    }
  }, []);

  // useEffect(() => {
  //   if (userProjectRoles === null) {
  //     axios({
  //       method: "get",
  //       url: `/api/cada/project/users/${row.id}`,
  //     }).then((res) => {
  //       dispatch({
  //         type: "ADD_PROJECT_USER",
  //         userId: row.id,
  //         payload: res.data,
  //       });
  //     });
  //   }
  // }, [row]);

  let annotatorProjects = [];

  return (
    <>
      {userProjectRoles && (
        <Dialog open={addRoleOpen} onClose={handleAddRoleClose} maxWidth={"lg"}>
          <AddRoleDailog
            userId={row.id}
            userProjectRoles={userProjectRoles}
            handleClose={handleAddRoleClose}
          />
        </Dialog>
      )}

      {currentProject && (
        <Dialog
          open={assignRecordsOpen}
          onClose={handleAssignRecordsClose}
          maxWidth={"lg"}
        >
          <AssignRecordsDailog
            userId={row.id}
            projectId={currentProject}
            handleClose={handleAssignRecordsClose}
          />
        </Dialog>
      )}
      <TableRow>
        <TableCell sx={{ pb: 2 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box m={2} display="flex" flexDirection="column">
              <Toolbar disableGutters={true}>
                <Typography>Project roles </Typography>
                <div style={{ flex: "1 1 auto" }} />
                <Button onClick={handleAddRoleClick}> Add role </Button>
              </Toolbar>

              <Table size="small" aria-label="purchases">
                <TableBody>
                  {userProjectRoles &&
                    userProjectRoles.map((userProjectRole, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell component="th" scope="row">
                          {userProjectRole.name}
                        </StyledTableCell>

                        {["annotator", "adjudicator"].map((role) => {
                          let projectUser =
                            userProjectRole.cadaProjectUsers.find(
                              (x) => x.role === role
                            );

                          console.log("userProjectRole: ", userProjectRole.id);
                          // console.log("projectUser: ", projectUser);
                          // console.log("annotatorProjects: ", annotatorProjects);

                          if (role === "annotator" && projectUser) {
                            annotatorProjects.push({
                              [userProjectRole.id]: userProjectRole.name,
                            });
                          }
                          return (
                            <StyledTableCell key={role} align="right">
                              {projectUser ? (
                                <>
                                  {projectUser.role}
                                  <GoX
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: 5,
                                      marginBottom: -3,
                                      color: "#e74c3c",
                                    }}
                                    onClick={() =>
                                      handleRemoveRoleClick(projectUser)
                                    }
                                  />
                                </>
                              ) : (
                                "-"
                              )}
                            </StyledTableCell>
                          );
                        })}

                        <StyledTableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(event) =>
                              handleAssignRecordsClick(
                                event,
                                userProjectRole.id
                              )
                            }
                          >
                            <MdOutlineLibraryAddCheck />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function UserTableRow({ row, handleRemoveClick }) {
  const [open, setOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);

  const handleConfirmDelete = () => {
    handleRemoveClick(row.id);
  };

  const handleEditUser = () => {
    setEditUserOpen(false);
  };

  console.log("row: ", row);

  return (
    <>
      {editUserOpen && (
        <EditUser
          userData={row}
          open={editUserOpen}
          handleClose={handleEditUser}
        />
      )}

      <TableRow>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            {row.avatar ? (
              <MuiAvatar>
                <Avatar
                  style={{ width: "29px", height: "29px" }}
                  {...genConfig(JSON.parse(row.avatar))}
                />
              </MuiAvatar>
            ) : (
              <MuiAvatar
                sx={{ bgcolor: row.isBot ? "success.main" : "secondary.main" }}
              >
                {row.isBot ? (
                  <FaRobot size={15} color="white" />
                ) : (
                  row.firstName.charAt(0).toUpperCase() +
                  row.lastName.charAt(0).toUpperCase()
                )}
              </MuiAvatar>
            )}
            <Typography variant="body2" noWrap>
              {row.firstName + " " + row.lastName}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Label
            color={
              (row.featureUsers[0]?.role === "user" && "info") || "success"
            }
          >
            {row.featureUsers[0]?.role}
          </Label>
        </TableCell>
        <TableCell>{row.username} </TableCell>

        <TableCell>{row.loginType} </TableCell>

        <TableCell>
          <IconButton
            color="info"
            size="small"
            onClick={() => setEditUserOpen(!editUserOpen)}
          >
            <MdDriveFileRenameOutline />
          </IconButton>
          <PopConfirm
            message="Are you sure, delete? "
            onConfirm={handleConfirmDelete}
          >
            <IconButton size="small" color="success">
              <MdDeleteForever />
            </IconButton>
          </PopConfirm>
        </TableCell>
        {/* <TableCell>
          <MoreVert sx={{ cursor: "pointer", ml: 1, color: "grey" }} />
        </TableCell> */}
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <MdExpandLess /> : <MdExpandMore />}
          </IconButton>
        </TableCell>
      </TableRow>
      {open && <UserRowCollapse open={open} row={row} />}
    </>
  );
}
