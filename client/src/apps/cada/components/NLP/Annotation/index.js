import React, { useEffect, useState } from "react";
import {
  AppBar,
  Typography,
  Button,
  Toolbar,
  Box,
  LinearProgress,
} from "@mui/material";
import Panel from "./Panel";
import useDidMountEffect from "../../../../../hooks/useDidMountEffect";
import { getAnnotationEvents } from "../../../redux/actions";
import { NoContent } from "../../../common/NoContent";
import { Download } from "../../../common/Download";
import { useSelector, useDispatch } from "react-redux";

export default function Annotation({ pid }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [annotatedNotes, setAnnotatedNotes] = React.useState({});

  const events = useSelector((state) =>
    state.cada.ann_events[pid] ? state.cada.ann_events[pid] : null
  );
  const user = useSelector((state) => state.main.user);
  const project = useSelector((state) => state.cada.userProjects[pid]);

  const dispatch = useDispatch();

  const formSchema = [
    { label: "Name", type: "text", name: "name" },
    { label: "Age", type: "number", name: "age" },
    { label: "Email", type: "email", name: "email" },
    {
      label: "Favorite Colors",
      type: "multi-select",
      name: "favoriteColors",
      options: [
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
        { label: "Green", value: "green" },
      ],
    },
    {
      label: "Country",
      type: "select",
      name: "country",
      options: [
        { label: "USA", value: "usa" },
        { label: "UK", value: "uk" },
      ],
    },
    {
      label: "State",
      type: "select",
      name: "state",
      parentSelect: "country",
      optionsMap: {
        usa: [
          { label: "New York", value: "new_york" },
          { label: "California", value: "california" },
        ],
        uk: [
          { label: "England", value: "england" },
          { label: "Scotland", value: "scotland" },
        ],
      },
    },
    {
      label: "City",
      type: "select",
      name: "city",
      parentSelect: "state",
      optionsMap: {
        new_york: [
          { label: "New York City", value: "new_york_city" },
          { label: "Buffalo", value: "buffalo" },
        ],
        california: [
          { label: "Los Angeles", value: "los_angeles" },
          { label: "San Francisco", value: "san_francisco" },
        ],
        england: [
          { label: "London", value: "london" },
          { label: "Manchester", value: "manchester" },
        ],
        scotland: [
          { label: "Edinburgh", value: "edinburgh" },
          { label: "Glasgow", value: "glasgow" },
        ],
      },
    },
  ];

  const handleSubmit = (formData) => {
    console.log("Form Data:", formData);
  };

  useEffect(() => {
    console.log("useEffect: Annotation");
    if (events === null) {
      dispatch(getAnnotationEvents(pid, user.id));
    } else {
      setIsLoading(false);
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
  }, []);

  useDidMountEffect(() => {
    console.log("useDidMountEffect: Annotation, event changed", events);
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
      {events && Object.keys(events).length > 0 ? (
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
            events={[...events[true], ...events[false]].sort((a, b) =>
              a.id < b.id ? -1 : a.id > b.id ? 1 : 0
            )}
            user={user}
            project={project}
            aNotes={annotatedNotes}
            setAnnotatedNotes={setAnnotatedNotes}
          />
        </>
      ) : (
        <NoContent
          text="There are no assignments!"
          subtext="Contact your admin for assignments!"
        />
      )}
    </>
  );
}
