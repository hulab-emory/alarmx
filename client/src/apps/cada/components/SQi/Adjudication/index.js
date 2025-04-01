import React, { useEffect } from "react";
import {
  AppBar,
  Typography,
  Button,
  Toolbar,
  Tabs,
  Tab,
  Box,
  LinearProgress,
} from "@mui/material";
import useDidMountEffect from "../../../../../hooks/useDidMountEffect";
import { connect, useSelector } from "react-redux";
import { getAdjudicationEvents } from "../../../redux/actions";
import { NoContent } from "../../../common/NoContent";
import { Download } from "../../../common/Download";
import Overview from "./Overview";
import Selected from "./Selected";

const getAnnotatedEvents = (events) => {
  let ann = {};
  for (let i = 0; i < events.length; i++) {
    ann[events[i].id] = {};
    for (let k = 0; k < events[i].cadaAnnotations.length; k++) {
      if (
        events[i].cadaAnnotations[k].completed === true &&
        events[i].cadaAnnotations[k].cadaAnnotationValues.length > 0
      ) {
        //find last annotation value object
        let lastAnnotationValueObject =
          events[i].cadaAnnotations[k].cadaAnnotationValues[
            events[i].cadaAnnotations[k].cadaAnnotationValues.length - 1
          ];
        if (ann[events[i].id][lastAnnotationValueObject.field]) {
          // check if events[i].cadaAnnotations[k].userId already exits
          if (
            ann[events[i].id][lastAnnotationValueObject.field].includes(
              events[i].cadaAnnotations[k].userId
            )
          ) {
            continue;
          } else {
            ann[events[i].id][lastAnnotationValueObject.field].push(
              events[i].cadaAnnotations[k].userId
            );
          }
        } else {
          ann[events[i].id][lastAnnotationValueObject.field] = [
            events[i].cadaAnnotations[k].userId,
          ];
        }
      }
    }
  }
  return ann;
};

function Adjudication({ pid, getAdjudicationEvents }) {
  const [tab, setTab] = React.useState(0);
  const [selectedIds, setSelected] = React.useState([]);
  const [annotatedRecords, setAnnotatedNotes] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const events = useSelector((state) =>
    state.cada.adj_events[pid] ? state.cada.adj_events[pid] : null
  );
  const project = useSelector((state) => state.cada.userProjects[pid]);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = events.map((n) => n.id);
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

  const handleClickAdjudicate = (event) => {
    setTab(1);
  };

  useEffect(() => {
    console.log("useEffect:    ", events);
    if (events === null) {
      getAdjudicationEvents(pid);
    } else {
      events.length > 0 && setAnnotatedNotes(getAnnotatedEvents(events));
      setIsLoading(false);
    }
  }, []);

  useDidMountEffect(() => {
    console.log("useDidMountEffect:    ", events);
    setIsLoading(false);
    if (Object.keys(annotatedRecords).length === 0 && events.length > 0) {
      setAnnotatedNotes(getAnnotatedEvents(events));
    }
  }, [events]);

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  if (project && events && Object.keys(events).length > 0) {
    return (
      <>
        <AppBar component="div" sx={{ px: 1 }} position="static" elevation={0}>
          <Toolbar>
            <Typography color="inherit" variant="h6" component="h1">
              {project.name} Adjudication
            </Typography>
            <div style={{ flex: "1 1 auto" }} />
            <Download data={[]} />
            <Button variant="outlined" color="inherit" size="small">
              Report
            </Button>
          </Toolbar>
        </AppBar>
        <AppBar component="div" sx={{ px: 1 }} position="static" elevation={0}>
          <Tabs value={tab} onChange={handleChange}>
            <Tab disableRipple label="Overview" />
            {selectedIds.length > 0 && (
              <Tab disableRipple label={<>{selectedIds.length} selected</>} />
            )}
          </Tabs>
        </AppBar>
        {tab === 0 ? (
          <Overview
            events={events}
            selectedIds={selectedIds}
            annotatedRecords={annotatedRecords}
            handleSelectAllClick={handleSelectAllClick}
            handleCheckboxClick={handleCheckboxClick}
            handleClickAdjudicate={handleClickAdjudicate}
          />
        ) : (
          <Selected
            events={events
              .filter((e) => selectedIds.includes(e.id))
              .reduce(function (r, a) {
                if (a.cadaAdjudicationValues.length === 0) {
                  r[false] = r[false] || [];
                  r[false].push(a);
                } else {
                  r[true] = r[true] || [];
                  r[true].push(a);
                }
                return r;
              }, Object.create(null))}
            selectedIds={selectedIds}
            project={project}
            annotatedRecords={annotatedRecords}
          />
        )}
      </>
    );
  } else
    return (
      <NoContent
        text="There are no annotation values!"
        subtext="Have annotators start assignments."
      />
    );
}

const mapDispatchToProps = (dispatch) => ({
  getAdjudicationEvents: (userId, projectId) =>
    dispatch(getAdjudicationEvents(userId, projectId)),
});

export default connect(null, mapDispatchToProps)(Adjudication);
