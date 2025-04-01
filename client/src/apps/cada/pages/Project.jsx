import React, { useState, useEffect } from "react";
import {
  AppBar,
  Grid,
  Button,
  Dialog,
  Container,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Chip,
  Toolbar,
  Tabs,
  Tab,
  InputBase,
  FormControl,
  Box,
} from "@mui/material";
import axios from "axios";

import { styled, alpha } from "@mui/material/styles";
import { BiSearchAlt } from "react-icons/bi";
import { MdExpandMore, MdMoreVert } from "react-icons/md";
import AddForm from "../sections/Project/AddProjectDialog";
import AssignEventDialog from "../sections/Project/AssignFilesDialog";
import Detail from "../sections/Project/Detail";

import { connect } from "react-redux";
import {
  getProjects,
  addProject,
  removeProject,
  updateProject,
} from "../redux/actions";

import { createTheme } from "@mui/material/styles";
import { PlusIcon } from "../common/Icons";

const theme = createTheme();

const useStyles = {
  button: {
    paddingInline: theme.spacing(0),
    float: "right",
  },
  paper: {
    marginTop: theme.spacing(5),
    overflow: "hidden",
  },
  searchBar: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(2),
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  secondaryBar: {
    zIndex: 0,
    paddingLeft: 20,
    padding: 0,
    backgroundColor: "#192a56",
  },
  block: {
    marginLeft: theme.spacing(2),
    color: "rgba(0, 0, 0, 0.5)",
    display: "block",
  },
  content: {
    height: "450px",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  root: {
    marginInline: "auto",
  },
  card: {
    maxWidth: 500,
  },
  cardContent: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: "#2bcbba",
  },
  overflow: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    minHeight: 60,
    maxWidth: 400,
    display: "-webkit-box",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical",
  },
  noOverflow: {},
  eventCount: {
    marginLeft: 4,
    fontSize: 11,
    height: 20,
    borderRadius: 4,
    fontWeight: 900,
  },
  title: {
    paddingInline: theme.spacing(10),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
};

// ----------------------------------------------------------------------

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

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

const ProjectCard = ({
  card,
  count,
  getEventsCount,
  handleProjectDetailClick,
  handleNeedEventsClick,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const getCount = async (projectId) => {
      console.log(`/api/cada/event/count?pid=${projectId}`);
      const result = await axios(`/api/cada/event/count?pid=${projectId}`);
      getEventsCount(projectId, result.data);
    };

    if (typeof count === "undefined") {
      getCount(card.id);
    }
  }, [card, count]);

  return (
    <Card style={{ ...useStyles.card }}>
      <CardHeader
        avatar={
          <Avatar style={{ ...useStyles.avatar }}>
            {card.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton
            aria-label="settings"
            onClick={() => handleProjectDetailClick(card.id)}
          >
            <MdMoreVert />
          </IconButton>
        }
        title={card.name}
        subheader={card.title}
      />
      <CardContent>
        <Typography
          sx={
            expanded
              ? {}
              : {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minHeight: 60,
                  maxWidth: 400,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }
          }
          variant="body2"
          color="text.secondary"
          component="p"
        >
          {card.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {count ? (
          <Chip
            size="small"
            label={count}
            sx={{
              fontWeight: 900,
              ml: 1,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          />
        ) : (
          <Chip
            size="small"
            label={"Need Events!"}
            sx={{
              fontWeight: 900,
              ml: 1,
              bgcolor: "secondary.light",
              color: "secondary.contrastText",
            }}
            onClick={() => handleNeedEventsClick(card.id)}
          />
        )}

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <MdExpandMore />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            <b>Goal: </b> {card.Goal}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <b>Data: </b>
            {card.Data}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <b>IRB: </b>
            {card.IRBNumber}
          </Typography>
          {card.attributes &&
            JSON.parse(card.attributes).Buttons.map((b, i) => (
              <Button
                key={i}
                variant="contained"
                value={b.value}
                size="small"
                style={{
                  marginTop: 5,
                  marginRight: 5,
                  backgroundColor: b.color,
                  color: "#ecf0f1",
                }}
              >
                {b.name}
              </Button>
            ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

function Project(props) {
  const { projects, events, eventsCount, getProjects, getEventsCount } = props;
  const [searchKey, setSearchKey] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [openilesDialog, setOpenilesDialog] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [projectId, setProjectId] = React.useState(0);

  const handleSearch = (event) => {
    setSearchKey(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleProjectDetailClick = (id) => {
    setValue(1);
    setProjectId(id);
  };

  const handleNeedEventsDialogClose = () => {
    setOpenilesDialog(false);
  };

  const handleNeedEventsClick = (id) => {
    console.log("projectId", projectId);
    setProjectId(id);
    setOpenilesDialog(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  useEffect(() => {
    if (projects.length === 0) {
      getProjects(setLoading);
    }
  }, []);

  return (
    <div style={{ ...useStyles.root }}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={"sm"}
        aria-labelledby="form-dialog-title"
      >
        <AddForm handleClose={handleClose} />
      </Dialog>
      <Dialog
        open={openilesDialog}
        onClose={handleNeedEventsDialogClose}
        maxWidth={"xl"}
        aria-labelledby="form-dialog-title"
      >
        <AssignEventDialog
          projectId={projectId}
          handleNeedEventsDialogClose={handleNeedEventsDialogClose}
          getEventsCount={getEventsCount}
        />
      </Dialog>
      <AppBar
        component="div"
        sx={{ px: theme.spacing(1) }}
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h6" component="h1">
                Projects
              </Typography>
            </Grid>
            <Grid item>
              <Button
                style={{ ...useStyles.button }}
                variant="outlined"
                color="inherit"
                size="small"
              >
                Report
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        sx={{ px: theme.spacing(1) }}
        position="static"
        elevation={0}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Overview" />
          <Tab label="Detail" disabled={projectId === 0} />
        </Tabs>
      </AppBar>

      <Container maxWidth="lg">
        {value === 0 ? (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <AppBar
                  style={{ ...useStyles.searchBar }}
                  position="static"
                  color="inherit"
                  elevation={0}
                >
                  <Grid container spacing={3} alignItems="center">
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
                        New Project
                      </Button>
                    </Grid>
                  </Grid>
                </AppBar>
              </Grid>
            </Grid>
            <Grid container spacing={{ xs: 3 }}>
              {projects.length > 0 &&
                projects
                  .filter(
                    (data) =>
                      JSON.stringify(data)
                        .toLowerCase()
                        .indexOf(searchKey.toLowerCase()) !== -1
                  )
                  .map((card) => (
                    <Grid key={card.id} item xs={12} sm={12} md={6} lg={4}>
                      <ProjectCard
                        card={card}
                        count={eventsCount[card.id]}
                        getEventsCount={getEventsCount}
                        handleProjectDetailClick={handleProjectDetailClick}
                        handleNeedEventsClick={handleNeedEventsClick}
                      />
                    </Grid>
                  ))}
            </Grid>
          </Box>
        ) : (
          <Detail project={projects[projectId]} />
        )}
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => ({
  projects: state.cada.projects,
  eventsCount: state.cada.events_count,
  alert: state.cada.alert,
});

const mapDispatchToProps = (dispatch) => ({
  getProjects: (setLoading) => dispatch(getProjects(setLoading)),
  addProject: (payload) => dispatch(addProject(payload)),
  removeProject: (id) => dispatch(removeProject(id)),
  updateProject: (payload) => dispatch(updateProject(payload)),
  getEventsCount: (projectId, payload) =>
    dispatch({ type: "GET_EVENTS_COUNT", payload, projectId }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
