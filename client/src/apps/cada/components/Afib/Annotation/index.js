import React, { useEffect } from "react";
import {
  AppBar,
  Typography,
  Button,
  Toolbar,
  Box,
  LinearProgress,
  Chip,
  Tooltip,
} from "@mui/material";
import Panel from "./Panel";
import useDidMountEffect from "../../../../../hooks/useDidMountEffect";
import { getAnnotationEvents } from "../../../redux/actions";
import { NoContent } from "../../../common/NoContent";
import { Download } from "../../../common/Download";
import { useSelector, useDispatch } from "react-redux";
import { FaRobot } from "react-icons/fa";

export default function Annotation({ pid }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const events = useSelector((state) => state.cada.ann_events[pid] ? state.cada.ann_events[pid] : null);
  const events_count = useSelector((state) => state.cada.ann_events_count[pid] ? state.cada.ann_events_count[pid] : null);

  const user = useSelector((state) => state.main.user);
  const project = useSelector((state) => state.cada.userProjects[pid]);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("useEffect: Annotation");
    if (events === null) {
      dispatch(getAnnotationEvents(pid, user.id));
    } else {
      setIsLoading(false);
    }
  }, []);

  useDidMountEffect(() => {
    console.log("useDidMountEffect: Annotation");
    setIsLoading(false);

    //if event.false is less than 5 fetch more events, sinceId is last events id
    if (events[false].length < 5 && events[false].length > 0 && events_count[0] > 10) {
      dispatch(getAnnotationEvents(pid, user.id, events[false][events[false].length - 1].id));
    } 
  }, [events]);

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <>
      {project && events && Object.keys(events).length > 0 && (
        <>
          <AppBar
            component="div"
            sx={{ pl: 1 }}
            position="static"
            elevation={0}
          >
            <Toolbar>
              <Typography color="inherit" variant="h6" component="h1">
                {project.name} Annotation
              </Typography>
              <div style={{ flex: "1 1 auto" }} />
              <Download
                data={events[true]
                  .filter(
                    (e) => e.cadaAnnotations[0].cadaAnnotationValues.length > 0
                  )
                  .map((e) => {
                    let latestElement =
                      e.cadaAnnotations[0].cadaAnnotationValues.length > 0
                        ? e.cadaAnnotations[0].cadaAnnotationValues.sort(
                            (a, b) => b.id - a.id
                          )[0]
                        : null;
                    return {
                      user: user.email,
                      file: e.cadaFile.path,
                      field: latestElement.field,
                      createAt: latestElement.createdAt,
                      value: latestElement.value,
                    };
                  })}
              />
              <Button variant="outlined" color="inherit" size="small">
                Report
              </Button>

              <Tooltip title="Afib detection model avialable ">
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  sx={{ marginLeft: 1 }}
                >
                  Auto annotate
                  <FaRobot
                    size={15}
                    color="rgb(26, 188, 156)"
                    style={{ marginLeft: 6, marginBottom: 1 }}
                  />
                </Button>
              </Tooltip>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                sx={{ marginLeft: 1 }}
              >
                Fine tune
                <Tooltip title="Fine tune model with new 3 annotations">
                  <Chip
                    label="3"
                    size="small"
                    sx={{ ml: 1, bgcolor: "#b2bec3" }}
                  />
                </Tooltip>
              </Button>
            </Toolbar>
          </AppBar>
          <AppBar
            component="div"
            sx={{ px: 1, height: 10 }}
            position="static"
            elevation={0}
          />
          <Panel events={events} events_count={events_count} user={user} project={project} />
        </>
      )}
      {project && events && Object.keys(events).length === 0 && (
        <NoContent
          text="There are no assignments!"
          subtext="Contact your admin for assignments!"
        />
      )}
    </>
  );
}
