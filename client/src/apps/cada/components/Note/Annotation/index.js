import React, { useState, useEffect } from "react";
import {
  AppBar,
  Typography,
  Button,
  Toolbar,
  Box,
  LinearProgress,
  createTheme,
} from "@mui/material";
import useDidMountEffect from "../../../../../hooks/useDidMountEffect";
import { getAnnotationEvents, getProjects } from "../../../redux/actions";
import { NoContent } from "../../../common/NoContent";
import { Download } from "../../../common/Download";
import { useSelector, useDispatch } from "react-redux";
import Panel from "./Panel";
import { InputPagination } from "../../../common/InputPagination";

const theme = createTheme();

const useStyles = {
  pages: {
    position: "relative",
    zIndex: 0,
    padding: theme.spacing(2),
    left: 0,
    right: 0,
  },
};

export default function Annotation({ pid }) {

  const [isLoading, setIsLoading] = useState(true);
  const [annotatedNotes, setAnnotatedNotes] = useState({});

  const events = useSelector((state) =>
    state.cada.ann_events[pid] ? state.cada.ann_events[pid] : null
  );
  const user = useSelector((state) => state.main.user);
  const project = useSelector((state) => state.cada.userProjects[pid]);

  const dispatch = useDispatch();

  const [eIdx, setEIdx] = useState(0);

  useEffect(() => {
    if (!project) {
      dispatch(getProjects());
    }
    if (!events) {
      dispatch(getAnnotationEvents(pid, user.id, null, true));
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, setIsLoading, pid, user]);

  useDidMountEffect(() => {
    // console.log("useDidMountEffect: Annotation, event changed", events);
    setIsLoading(false);
    if (Object.keys(events).length > 0) {
      let ann = {};
      let temp = [...events[true], ...events[false]]
        .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
        .filter((e) => e.cadaAnnotations[0].cadaAnnotationValues.length > 0)
        .map((event) => {
          const groupedByField =
            event.cadaAnnotations[0].cadaAnnotationValues.reduce((acc, obj) => {
              const field = obj.field;

              if (!acc[field] || obj.id > acc[field].id) {
                acc[field] = obj;
              }

              return acc;
            }, {});

          return {
            ...event,
            cadaAnnotations: [
              {
                cadaAnnotationValues: Object.values(groupedByField),
                userId: event.cadaAnnotations[0].userId,
                id: event.cadaAnnotations[0].id,
                cadaEventId: event.cadaAnnotations[0].cadaEventId,

              },
            ],
          };
        });

      for (let i = 0; i < temp.length; i++) {
        ann[temp[i].id] = {};
        for (let k = 0; k < temp[i].cadaAnnotations.length; k++) {
          if (temp[i].cadaAnnotations[k].cadaAnnotationValues.length > 0) {
            for (
              let j = 0;
              j < temp[i].cadaAnnotations[k].cadaAnnotationValues.length;
              j++
            ) {
              ann[temp[i].id][
                temp[i].cadaAnnotations[k].cadaAnnotationValues[j].field
              ] = {
                ...JSON.parse(
                  temp[i].cadaAnnotations[k].cadaAnnotationValues[j].value
                ),
                userId: temp[i].cadaAnnotations[k].userId,
              };
            }
          }
        }
      }
      setAnnotatedNotes(ann);
    }
  }, [events, setIsLoading, setAnnotatedNotes]);

  const handlePageChange = (e, page) => {
    setEIdx(page - 1);
  };

  const handleInputPage = (page) => {
    if (page <= 1) {
      setEIdx(0);
      return;
    }
    if (page > events.false.length + events.true.length) {
      setEIdx(events.false.length + events.true.length - 1);
      return;
    }
    setEIdx(page - 1);
  };

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }


  return (
    <>
      {events && Object.keys(events).length > 0 ? (
        <div style={{ height: "calc(100vh - 250px)" }}>
          <AppBar
            component="div"
            sx={{ pl: 1 }}
            position="static"
            elevation={0}
          >
            <Toolbar>
              <Typography color="inherit" variant="h6" component="h1">
                {project?.name} Annotation
              </Typography>
              <div style={{ flex: "1 1 auto" }} />
              <Download
                data={[...events[true], ...events[false]]
                  .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
                  .filter(
                    (e) => e.cadaAnnotations[0].cadaAnnotationValues.length > 0
                  )
                  .map((event) => {
                    const groupedByField =
                      event.cadaAnnotations[0].cadaAnnotationValues.reduce(
                        (acc, obj) => {
                          const field = obj.field;

                          // Check if the field already exists in the accumulator
                          if (!acc[field] || obj.id > acc[field].id) {
                            acc[field] = obj; // Replace with the current object if it has a higher id or does not exist in the accumulator
                          }

                          return acc;
                        },
                        {}
                      );

                    return Object.values(groupedByField).map((item) => ({
                      user: user.email,
                      file: event.cadaFile.path,
                      field: item.field,
                      createAt: item.createdAt,
                      value: item.value,
                    }));
                  })}
              />
              <Button variant="outlined" color="inherit" size="small">
                Report
              </Button>
            </Toolbar>
          </AppBar>
          <AppBar
            component="div"
            sx={{ px: 1, height: 10 }}
            position="static"
            elevation={0}
          />
          <Panel
            events={[...events[true], ...events[false]].sort((a, b) => {
              const getNumber = (path) => {
                // Extract the numeric part from the file path
                const match = path.match(/(\d+)\.json$/);
                return match ? parseInt(match[1], 10) : 0; // Default to 0 if no match
              };
            
              const numA = getNumber(a.cadaFile.path);
              const numB = getNumber(b.cadaFile.path);
            
              return numA - numB;
            })}
            eIdx={eIdx}
            setEIdx={setEIdx}
            user={user}
            project={project}
            aNotes={annotatedNotes}
            setAnnotatedNotes={setAnnotatedNotes}
          />
          <Box sx={{ ...useStyles.pages }}>
            <InputPagination
              total={events.false.length + events.true.length}
              page={eIdx + 1}
              onChange={handlePageChange}
              onInput={handleInputPage}
            />
          </Box>
        </div>
      ) : (
        <NoContent
          text="There are no assignments!"
          subtext="Contact your admin for assignments!"
        />
      )}
    </>
  )
}
