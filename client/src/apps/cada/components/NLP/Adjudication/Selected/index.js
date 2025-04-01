import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Paper,
  Grid,
  Radio,
  Button,
  Chip,
  Box,
  Tabs,
  Tab,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Avatar,
  AvatarGroup,
  SnackbarContent,
} from "@mui/material";
import {
  updateAdjudication,
  getAnnotators,
} from "../../../../redux/actions";

import { teal } from "@mui/material/colors";
import useDidMountEffect from "../../../../../../hooks/useDidMountEffect";
import { useSelector, useDispatch } from "react-redux";
import DataPanel from "../../Annotation/Note";
import { Pages } from "../../../../common/Pages";

import { createTheme } from "@mui/material/styles";
import ScrollBar from "../../../../common/ScrollBar";

const theme = createTheme();

const useStyles = {
  trigger: {
    color: "rgba(0, 0, 0, 0.70)",
    fontSize: "18px",
    lineHeight: "2em",
    borderBottomStyle: "solid",
    borderBottomWidth: "4px",
    borderBottomColor: "#f57c00",
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
  },
  concept: {
    color: "white",
    borderRadius: "3px",
    fontWeight: "600",
    paddingInline: ".4em",
    backgroundColor: "#f57c00",
  },
  pages: {
    position: "relative",
    zIndex: 0,
    padding: theme.spacing(2),
    left: 0,
    right: 0,
  },
  paper1: {
    top: "1rem",
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
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
};

function isAssigmentComplete(fieldIdsSet, target) {
  const fieldIdsArray = Array.from(fieldIdsSet);
  const sortedFieldIdsArray = fieldIdsArray.sort((a, b) => a - b);

  let isContinuous = true;
  for (let i = 0; i < sortedFieldIdsArray.length - 1; i++) {
    if (sortedFieldIdsArray[i] + 1 !== sortedFieldIdsArray[i + 1]) {
      isContinuous = false;
      break;
    }
  }
  return isContinuous && fieldIdsArray.length === target;
}

export default function Selected({
  events,
  project,
  selectedIds,
  aNotes,
  adjNotes,
  annotationResult,
  setAdjudicationNotes,
}) {
  const [detected, setDetected] = useState("");
  const [encounter, setEncounter] = useState("");
  const [negated, setNegated] = useState("");
  const [completedTab, setCompletedTab] = useState(false);
  const [eIdx, setEIdx] = useState(0);
  const [conceptIdx, setConcept] = useState(0);

  const [noteContent, setNoteContent] = useState(null);
  const [noteFileName, setNoteFileName] = useState(
    events[eIdx].cadaFile.path.split("/").pop()
  );

  const col2Ref = useRef(null);
  const [col1Height, setCol1Height] = React.useState("auto");

  const dispatch = useDispatch();
  const user = useSelector((state) =>
    state.main.user ? state.main.user : null
  );
  const annotators = useSelector((state) =>
    Object.keys(state.cada.annotators).length > 0 ? state.cada.annotators : null
  );

  const handleTabChange = (e, newValue) => {
    if (newValue === false) {
      setCompletedTab(false);
      setNoteFileName(events[0].cadaFile.path.split("/").pop());
      setEIdx(0);
      setConcept(0);
    } else {
      setCompletedTab(true);
      setNoteFileName(events[0].cadaFile.path.split("/").pop());
      setEIdx(0);
      setConcept(0);
    }
  };

  const handleSave = () => {
    let isComplete = isAssigmentComplete(
      Object.keys({
        ...adjNotes[events[eIdx].id],
        [conceptIdx]: {
          isDetected: detected,
          isEncounter: encounter,
          isNegated: negated,
        },
      }).map(Number),
      noteContent.info.length
    );

    dispatch(
      updateAdjudication(project.id, events[eIdx].id, user.id, completedTab, {
        field: noteContent.info[conceptIdx].concept_id,
        value: JSON.stringify({
          isDetected: detected,
          isEncounter: encounter,
          isNegated: negated,
        }),
        userId: user.id,
        cadaEventId: events[eIdx].id,
        createdAt: new Date(new Date().toUTCString()).toISOString(),
      })
    );

    setAdjudicationNotes({
      ...adjNotes,
      [events[eIdx].id]: {
        ...adjNotes[events[eIdx].id],
        [conceptIdx]: {
          isDetected: detected,
          isEncounter: encounter,
          isNegated: negated,
        },
      },
    });
  };

  const handleSaveAndNextConcept = () => {
    let isComplete = isAssigmentComplete(
      Object.keys({
        ...adjNotes[events[eIdx].id],
        [conceptIdx]: {
          isDetected: detected,
          isEncounter: encounter,
          isNegated: negated,
        },
      }).map(Number),
      noteContent.info.length
    );

    dispatch(
      updateAdjudication(project.id, events[eIdx].id, user.id, completedTab, {
        field: noteContent.info[conceptIdx].concept_id,
        value: JSON.stringify({
          isDetected: detected,
          isEncounter: encounter,
          isNegated: negated,
        }),
        userId: user.id,
        cadaEventId: events[eIdx].id,
        createdAt: new Date(new Date().toUTCString()).toISOString(),
      })
    );

    setAdjudicationNotes({
      ...adjNotes,
      [events[eIdx].id]: {
        ...adjNotes[events[eIdx].id],
        [conceptIdx]: {
          isDetected: detected,
          isEncounter: encounter,
          isNegated: negated,
        },
      },
    });

    if (noteContent.info.length === conceptIdx + 1) {
      setConcept(0);
      if (events.length >= eIdx + 1) {
        setEIdx(eIdx + 1);
        setNoteFileName(events[eIdx + 1].cadaFile.path.split("/").pop());
      }
    } else {
      setConcept(conceptIdx + 1);
    }
  };

  const handleHighlightClick = (conceptIndex) => {
    setConcept(conceptIndex);
  };

  const handleEdit = () => {
    let temp = Object.assign({}, adjNotes);
    delete temp[events[eIdx].id][noteContent.info[conceptIdx].concept_id];
    setAdjudicationNotes(temp);
  };

  const handleNextConcept = () => {
    if (noteContent.info.length === conceptIdx + 1) {
      setConcept(0);
      if (events.length >= eIdx + 1) {
        setEIdx(eIdx + 1);
        setNoteFileName(events[eIdx + 1].cadaFile.path.split("/").pop());
      }
    } else {
      setConcept(conceptIdx + 1);
    }
  };

  const handlePrevConcept = () => {
    setConcept(conceptIdx - 1);
  };

  const handleDetected = (e) => {
    setDetected(e.target.value);
  };

  const handleEncounter = (e) => {
    setEncounter(e.target.value);
  };

  const handleNegated = (e) => {
    setNegated(e.target.value);
  };

  const handlePageChange = (e, page) => {
    setNoteFileName(events[page - 1].cadaFile.path.split("/").pop());
    setEIdx(page - 1);
    setConcept(0);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 37) {
      // Left arrow key pressed
      if (conceptIdx === 0) {
        setConcept(noteContent.info.length - 1);
        if (eIdx > 0) {
          setEIdx(eIdx - 1);
          setNoteFileName(events[eIdx - 1].cadaFile.path.split("/").pop());
        }
      } else {
        setConcept(conceptIdx - 1);
      }
    } else if (e.keyCode === 39) {
      // Right arrow key pressed
      if (noteContent.info.length === conceptIdx + 1) {
        setConcept(0);
        if (events.length >= eIdx + 1) {
          setEIdx(eIdx + 1);
          setNoteFileName(events[eIdx + 1].cadaFile.path.split("/").pop());
        }
      } else {
        setConcept(conceptIdx + 1);
      }
    }
  };

  useEffect(() => {
    console.log("useEffect:    ", events);
    if (annotators === null) {
      dispatch(getAnnotators(selectedIds));
    }

    if (col2Ref.current) {
      console.log("col2Ref.current: ", col2Ref.current.offsetHeight);
      const height2 = col2Ref.current.offsetHeight;
      setCol1Height(`${height2}px`);
    }
  }, []);

  useDidMountEffect(() => {
    console.log("useDidMountEffect:   annotator ", annotators);
  }, [annotators]);

  useEffect(() => {
    setDetected("");
    setEncounter("");
    setNegated("");

    if (col2Ref.current) {
      const height2 = col2Ref.current.offsetHeight;
      setCol1Height(`${height2}px`);
      console.log("height: ", col2Ref.current.offsetHeight);
    }
    // Add/Remove event listener for keydown event
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [conceptIdx, eIdx, noteContent, adjNotes]);

  useEffect(() => {
    const fetchNote = async () => {
      console.log("Fetching note ... ", noteFileName);
      try {
        const fileContent = await import(`../../../../assets/${noteFileName}`);
        setNoteContent(fileContent);
      } catch (error) {
        console.error("Error loading file:", error);
      }
    };

    fetchNote();
  }, [noteFileName]);

  console.log("col: ", col2Ref.current?.offsetHeight);
  return (
    <>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Tabs
          textColor="primary"
          value={completedTab}
          onChange={handleTabChange}
        >
          <Tab
            disableRipple
            textColor="primary"
            disabled={events.length === 0}
            value={false}
            label={
              <div>
                Assigned
                <Chip
                  color="primary"
                  size="small"
                  sx={{ ml: 1 }}
                  label={events.length}
                />
              </div>
            }
          />
        </Tabs>

        {events[eIdx] && noteContent && (
          <Grid container spacing={3}>
            <Grid item sm={8}>
              <Paper style={{ height: col1Height }}>
                <ScrollBar style={{ maxHeight: "100%" }}>
                  <DataPanel
                    concept={conceptIdx}
                    note={noteContent}
                    annotated={Object.keys(adjNotes[events[eIdx].id]) || []}
                    handleHighlightClick={handleHighlightClick}
                  />
                </ScrollBar>
              </Paper>
            </Grid>
            <Grid item sm={4}>
              <Paper ref={col2Ref}>
                <ScrollBar style={{ maxHeight: "100%" }}>
                  <Paper
                    sx={{
                      py: 1,
                      px: 2,
                      mb: 2,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      <Typography id="concept">
                        <span>{conceptIdx + 1}</span>
                        {" of " + noteContent.info.length}
                      </Typography>
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                    <Typography
                      id="concept"
                      variant="body2"
                      component="span"
                      gutterBottom
                    >
                      Concept:{" "}
                      <span style={{ ...useStyles.concept }}>
                        {noteContent.info[conceptIdx].concept}
                      </span>
                    </Typography>
                    <Divider sx={{ border: "none" }} />
                    <Typography
                      id="trigger"
                      variant="body2"
                      component="span"
                      gutterBottom
                    >
                      Trigger:{" "}
                      <span style={{ ...useStyles.trigger }}>
                        {noteContent.info[conceptIdx].trigger_word}
                      </span>
                    </Typography>
                    <Divider sx={{ border: "none" }} />
                    {(() => {
                      if (
                        annotationResult[events[eIdx].id] &&
                        annotationResult[events[eIdx].id][
                          noteContent.info[conceptIdx].concept_id
                        ]
                      ) {
                        return (
                          <Typography
                            id="trigger"
                            variant="body2"
                            component="span"
                            gutterBottom
                          >
                            Agreement:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {annotationResult[events[eIdx].id][
                                noteContent.info[conceptIdx].concept_id
                              ][1] + "%"}
                            </span>
                          </Typography>
                        );
                      }

                      return null;
                    })()}

                    <Typography variant="body2">
                      {" "}
                      note_id: {noteFileName.split(".")[0]}{" "}
                    </Typography>
                    <Typography variant="body2">
                      {" "}
                      concept_Id: {noteContent.info[conceptIdx].concept_id}{" "}
                    </Typography>
                  </Paper>

                  {adjNotes[events[eIdx].id] &&
                  adjNotes[events[eIdx].id][
                    noteContent.info[conceptIdx].concept_id
                  ] ? (
                    <div>
                      <Paper style={{ ...useStyles.paper1 }}>
                        {(() => {
                          if (
                            annotationResult[events[eIdx].id] &&
                            annotationResult[events[eIdx].id][
                              noteContent.info[conceptIdx].concept_id
                            ]
                          ) {
                            let temp =
                              annotationResult[events[eIdx].id][
                                noteContent.info[conceptIdx].concept_id
                              ][2];

                            let userAnswer = {};

                            for (let user in temp) {
                              let userData = JSON.parse(temp[user].value);
                              for (let classifier in userData) {
                                if (
                                  userAnswer[classifier] &&
                                  classifier !== ""
                                ) {
                                  if (
                                    userAnswer[classifier][userData[classifier]]
                                  ) {
                                    userAnswer[classifier][
                                      userData[classifier]
                                    ].push(user);
                                  } else {
                                    userAnswer[classifier][
                                      userData[classifier]
                                    ] = [user];
                                  }
                                } else if (classifier !== "") {
                                  userAnswer[classifier] = {};
                                  userAnswer[classifier][userData[classifier]] =
                                    [];
                                  userAnswer[classifier][userData[classifier]] =
                                    [user];
                                }
                              }
                            }

                            return (
                              <FormControl fullWidth>
                                <FormLabel id="encounter-controlled-radio-buttons-group">
                                  {" "}
                                  Is the concept correctly detected by the
                                  triggerring word?
                                </FormLabel>
                                <RadioGroup
                                  aria-labelledby="encounter-controlled-radio-buttons-group"
                                  name="controlled-radio-buttons-group"
                                  value={
                                    adjNotes[events[eIdx].id][
                                      noteContent.info[conceptIdx].concept_id
                                    ].isDetected
                                  }
                                  onChange={handleDetected}
                                >
                                  {["yes", "no"]
                                    .concat(
                                      userAnswer.isDetected
                                        ? Object.keys(
                                            userAnswer.isDetected
                                          ).filter(
                                            (elem) =>
                                              !["yes", "no"].includes(elem)
                                          )
                                        : []
                                    )
                                    .map((k, i) => (
                                      <SnackbarContent
                                        sx={{
                                          border:
                                            adjNotes[events[eIdx].id][
                                              noteContent.info[conceptIdx]
                                                .concept_id
                                            ].isDetected === k
                                              ? "2px solid rgba(26, 188, 156, 0.2)"
                                              : "2px solid rgba(127, 140, 141, 0.2)",
                                          backgroundColor:
                                            adjNotes[events[eIdx].id][
                                              noteContent.info[conceptIdx]
                                                .concept_id
                                            ].isDetected === k
                                              ? "rgba(26, 188, 156, 0.2)"
                                              : "Background",
                                          color:
                                            adjNotes[events[eIdx].id][
                                              noteContent.info[conceptIdx]
                                                .concept_id
                                            ].isDetected === k
                                              ? "rgba(26, 188, 156, 1.0)"
                                              : "rgba(127, 140, 141, 0.8)",
                                          boxShadow: "none",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                        message={
                                          <div>
                                            <Radio
                                              value={k}
                                              key={i}
                                              sx={{
                                                paddingBlock: 0,
                                                color:
                                                  adjNotes[events[eIdx].id][
                                                    noteContent.info[conceptIdx]
                                                      .concept_id
                                                  ].isDetected === k
                                                    ? teal[200]
                                                    : "rgba(127, 140, 141, 0.5)",
                                                "&.Mui-checked": {
                                                  color: teal[400],
                                                },
                                              }}
                                            ></Radio>
                                            {k}
                                          </div>
                                        }
                                        action={
                                          userAnswer.isDetected && (
                                            <AvatarGroup
                                              max={5}
                                              style={{ marginTop: -3 }}
                                            >
                                              {userAnswer.isDetected[k] &&
                                                userAnswer.isDetected[k].map(
                                                  (user, i) => (
                                                    <Avatar
                                                      key={i}
                                                      style={{
                                                        backgroundColor:
                                                          "#f39c12",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {annotators &&
                                                      annotators[user]
                                                        ? annotators[
                                                            user
                                                          ].firstName
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                          annotators[
                                                            user
                                                          ].lastName
                                                            .charAt(0)
                                                            .toUpperCase()
                                                        : user}
                                                    </Avatar>
                                                  )
                                                )}
                                            </AvatarGroup>
                                          )
                                        }
                                      />
                                    ))}
                                </RadioGroup>
                              </FormControl>
                            );
                          }
                          return null;
                        })()}
                      </Paper>

                      <Paper style={{ ...useStyles.paper1 }}>
                        {(() => {
                          if (
                            annotationResult[events[eIdx].id] &&
                            annotationResult[events[eIdx].id][
                              noteContent.info[conceptIdx].concept_id
                            ]
                          ) {
                            let temp =
                              annotationResult[events[eIdx].id][
                                noteContent.info[conceptIdx].concept_id
                              ][2];

                            let userAnswer = {};

                            let options = [
                              "yes, concept is new condition ",
                              "yes, exacerbation of a chronic condition",
                              "yes, presumed- part of differential diagnosis (assessment findings)",
                              "no, stable past medical history/ mention of chronic condition/ denying symptom",
                            ];

                            for (let user in temp) {
                              let userData = JSON.parse(temp[user].value);
                              for (let classifier in userData) {
                                if (
                                  userAnswer[classifier] &&
                                  userData[classifier] !== ""
                                ) {
                                  if (
                                    userAnswer[classifier][userData[classifier]]
                                  ) {
                                    userAnswer[classifier][
                                      userData[classifier]
                                    ].push(user);
                                  } else {
                                    userAnswer[classifier][
                                      userData[classifier]
                                    ] = [user];
                                  }
                                } else if (userData[classifier] !== "") {
                                  userAnswer[classifier] = {};
                                  userAnswer[classifier][userData[classifier]] =
                                    [];
                                  userAnswer[classifier][userData[classifier]] =
                                    [user];
                                }
                              }
                            }

                            console.log("userAnswer: ", userAnswer);

                            return (
                              <FormControl fullWidth>
                                <FormLabel id="encounter-controlled-radio-buttons-group">
                                  Is it a concept being dealt within the current
                                  encounter?
                                </FormLabel>
                                <RadioGroup
                                  aria-labelledby="encounter-controlled-radio-buttons-group"
                                  name="controlled-radio-buttons-group"
                                  value={
                                    adjNotes[events[eIdx].id][
                                      noteContent.info[conceptIdx].concept_id
                                    ].isEncounter
                                  }
                                  onChange={handleEncounter}
                                >
                                  {options
                                    .concat(
                                      userAnswer.isEncounter
                                        ? Object.keys(
                                            userAnswer.isEncounter
                                          ).filter(
                                            (elem) => !options.includes(elem)
                                          )
                                        : []
                                    )
                                    .map((k) => (
                                      <SnackbarContent
                                        sx={{
                                          border:
                                            adjNotes[events[eIdx].id][
                                              noteContent.info[conceptIdx]
                                                .concept_id
                                            ].isEncounter === k
                                              ? "2px solid rgba(26, 188, 156, 0.2)"
                                              : "2px solid rgba(127, 140, 141, 0.2)",
                                          backgroundColor:
                                            adjNotes[events[eIdx].id][
                                              noteContent.info[conceptIdx]
                                                .concept_id
                                            ].isEncounter === k
                                              ? "rgba(26, 188, 156, 0.2)"
                                              : "Background",
                                          color:
                                            adjNotes[events[eIdx].id][
                                              noteContent.info[conceptIdx]
                                                .concept_id
                                            ].isEncounter === k
                                              ? "rgba(26, 188, 156, 1.0)"
                                              : "rgba(127, 140, 141, 0.8)",
                                          boxShadow: "none",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                        message={
                                          <div>
                                            <Radio
                                              value={k}
                                              sx={{
                                                paddingBlock: 0,
                                                color:
                                                  adjNotes[events[eIdx].id][
                                                    noteContent.info[conceptIdx]
                                                      .concept_id
                                                  ].isEncounter === k
                                                    ? teal[200]
                                                    : "rgba(127, 140, 141, 0.5)",
                                                "&.Mui-checked": {
                                                  color: teal[400],
                                                },
                                              }}
                                            ></Radio>
                                            {k}
                                          </div>
                                        }
                                        action={
                                          userAnswer.isEncounter && (
                                            <AvatarGroup
                                              max={5}
                                              style={{ marginTop: -3 }}
                                            >
                                              {userAnswer.isEncounter[k] &&
                                                userAnswer.isEncounter[k].map(
                                                  (user) => (
                                                    <Avatar
                                                      style={{
                                                        backgroundColor:
                                                          "#f39c12",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {annotators &&
                                                      annotators[user]
                                                        ? annotators[
                                                            user
                                                          ].firstName
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                          annotators[
                                                            user
                                                          ].lastName
                                                            .charAt(0)
                                                            .toUpperCase()
                                                        : user}
                                                    </Avatar>
                                                  )
                                                )}
                                            </AvatarGroup>
                                          )
                                        }
                                      />
                                    ))}
                                </RadioGroup>
                              </FormControl>
                            );
                          }
                          return null;
                        })()}
                      </Paper>

                      <Paper style={{ ...useStyles.paper1 }}>
                        {(() => {
                          if (
                            annotationResult[events[eIdx].id] &&
                            annotationResult[events[eIdx].id][
                              noteContent.info[conceptIdx].concept_id
                            ]
                          ) {
                            let temp =
                              annotationResult[events[eIdx].id][
                                noteContent.info[conceptIdx].concept_id
                              ][2];

                            let userAnswer = {};
                            let options = [
                              "no, concept is current to the encounter",
                              "yes, concept is about another person (not patient)",
                              "yes, concept ruled out as diagnosis/part of assessment",
                              "yes, concept has been completely resolved",
                              "unsure, concept status unknown/ not quantifiable",
                            ];

                            for (let user in temp) {
                              let userData = JSON.parse(temp[user].value);
                              for (let classifier in userData) {
                                if (
                                  userAnswer[classifier] &&
                                  userData[classifier] !== ""
                                ) {
                                  if (
                                    userAnswer[classifier][userData[classifier]]
                                  ) {
                                    userAnswer[classifier][
                                      userData[classifier]
                                    ].push(user);
                                  } else {
                                    userAnswer[classifier][
                                      userData[classifier]
                                    ] = [user];
                                  }
                                } else if (userData[classifier] !== "") {
                                  userAnswer[classifier] = {};
                                  userAnswer[classifier][userData[classifier]] =
                                    [];
                                  userAnswer[classifier][userData[classifier]] =
                                    [user];
                                }
                              }
                            }

                            return (
                              <FormControl fullWidth>
                                <FormLabel id="encounter-controlled-radio-buttons-group">
                                  {" "}
                                  Is the concept correctly detected by the
                                  triggerring word?
                                </FormLabel>
                                <RadioGroup
                                  aria-labelledby="encounter-controlled-radio-buttons-group"
                                  name="controlled-radio-buttons-group"
                                  value={
                                    adjNotes[events[eIdx].id][
                                      noteContent.info[conceptIdx].concept_id
                                    ].isNegated
                                  }
                                  onChange={handleNegated}
                                >
                                  {options
                                    .concat(
                                      userAnswer.isNegated
                                        ? Object.keys(
                                            userAnswer.isNegated
                                          ).filter(
                                            (elem) => !options.includes(elem)
                                          )
                                        : []
                                    )
                                    .map((k) => (
                                      <SnackbarContent
                                        sx={{
                                          border:
                                            adjNotes[events[eIdx].id][
                                              noteContent.info[conceptIdx]
                                                .concept_id
                                            ].isNegated === k
                                              ? "2px solid rgba(26, 188, 156, 0.2)"
                                              : "2px solid rgba(127, 140, 141, 0.2)",
                                          backgroundColor:
                                            adjNotes[events[eIdx].id][
                                              noteContent.info[conceptIdx]
                                                .concept_id
                                            ].isNegated === k
                                              ? "rgba(26, 188, 156, 0.2)"
                                              : "Background",
                                          color:
                                            adjNotes[events[eIdx].id][
                                              noteContent.info[conceptIdx]
                                                .concept_id
                                            ].isNegated === k
                                              ? "rgba(26, 188, 156, 1.0)"
                                              : "rgba(127, 140, 141, 0.8)",
                                          boxShadow: "none",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                        message={
                                          <div>
                                            <Radio
                                              value={k}
                                              sx={{
                                                paddingBlock: 0,
                                                color:
                                                  adjNotes[events[eIdx].id][
                                                    noteContent.info[conceptIdx]
                                                      .concept_id
                                                  ].isNegated === k
                                                    ? teal[200]
                                                    : "rgba(127, 140, 141, 0.5)",
                                                "&.Mui-checked": {
                                                  color: teal[400],
                                                },
                                              }}
                                            ></Radio>
                                            {k}
                                          </div>
                                        }
                                        action={
                                          userAnswer.isNegated && (
                                            <AvatarGroup
                                              max={5}
                                              style={{ marginTop: -3 }}
                                            >
                                              {userAnswer.isNegated[k] &&
                                                userAnswer.isNegated[k].map(
                                                  (user) => (
                                                    <Avatar
                                                      style={{
                                                        backgroundColor:
                                                          "#f39c12",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {annotators &&
                                                      annotators[user]
                                                        ? annotators[
                                                            user
                                                          ].firstName
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                          annotators[
                                                            user
                                                          ].lastName
                                                            .charAt(0)
                                                            .toUpperCase()
                                                        : user}
                                                    </Avatar>
                                                  )
                                                )}
                                            </AvatarGroup>
                                          )
                                        }
                                      />
                                    ))}
                                </RadioGroup>
                              </FormControl>
                            );
                          }
                        })()}
                      </Paper>

                      {conceptIdx === 0 ? (
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          alignItems="flex-start"
                          spacing={1}
                        >
                          <Button
                            onClick={() => handleEdit()}
                            size="small"
                            variant="contained"
                            color="primary"
                            component="span"
                          >
                            EDIT
                          </Button>
                          <Button
                            onClick={() => handleNextConcept()}
                            size="small"
                            variant="contained"
                            color="primary"
                            component="span"
                          >
                            NEXT CONCEPT
                          </Button>
                        </Stack>
                      ) : (
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          alignItems="flex-start"
                          spacing={1}
                        >
                          <Button
                            onClick={() => handlePrevConcept()}
                            size="small"
                            variant="contained"
                            color="primary"
                            component="span"
                          >
                            PREV CONCEPT
                          </Button>
                          <Button
                            onClick={() => handleEdit()}
                            size="small"
                            variant="contained"
                            color="primary"
                            component="span"
                          >
                            EDIT
                          </Button>
                          <Button
                            onClick={() => handleNextConcept()}
                            size="small"
                            variant="contained"
                            color="primary"
                            component="span"
                          >
                            NEXT CONCEPT
                          </Button>
                        </Stack>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Paper style={{ ...useStyles.paper1 }}>
                        {(() => {
                          if (
                            annotationResult[events[eIdx].id] &&
                            annotationResult[events[eIdx].id][
                              noteContent.info[conceptIdx].concept_id
                            ]
                          ) {
                            let temp =
                              annotationResult[events[eIdx].id][
                                noteContent.info[conceptIdx].concept_id
                              ][2];

                            let userAnswer = {};
                            for (let user in temp) {
                              let userData = JSON.parse(temp[user].value);
                              for (let classifier in userData) {
                                if (
                                  userAnswer[classifier] &&
                                  userData[classifier] !== ""
                                ) {
                                  if (
                                    userAnswer[classifier][userData[classifier]]
                                  ) {
                                    userAnswer[classifier][
                                      userData[classifier]
                                    ].push(user);
                                  } else {
                                    userAnswer[classifier][
                                      userData[classifier]
                                    ] = [user];
                                  }
                                } else if (userData[classifier] !== "") {
                                  userAnswer[classifier] = {};
                                  userAnswer[classifier][userData[classifier]] =
                                    [];
                                  userAnswer[classifier][userData[classifier]] =
                                    [user];
                                }
                              }
                            }

                            return (
                              <FormControl fullWidth>
                                <FormLabel id="encounter-controlled-radio-buttons-group">
                                  Is the concept correctly detected by the
                                  triggerring word?
                                </FormLabel>
                                <RadioGroup
                                  aria-labelledby="encounter-controlled-radio-buttons-group"
                                  name="controlled-radio-buttons-group"
                                  value={detected}
                                  onChange={handleDetected}
                                >
                                  {["yes", "no"]
                                    .concat(
                                      userAnswer.isDetected
                                        ? Object.keys(
                                            userAnswer.isDetected
                                          ).filter(
                                            (elem) =>
                                              !["yes", "no"].includes(elem)
                                          )
                                        : []
                                    )
                                    .map((k) => (
                                      <SnackbarContent
                                        sx={{
                                          border:
                                            detected === k
                                              ? "2px solid rgba(26, 188, 156, 0.2)"
                                              : "2px solid rgba(127, 140, 141, 0.2)",
                                          backgroundColor:
                                            detected === k
                                              ? "rgba(26, 188, 156, 0.2)"
                                              : "Background",
                                          color:
                                            detected === k
                                              ? "rgba(26, 188, 156, 1.0)"
                                              : "rgba(127, 140, 141, 0.8)",
                                          boxShadow: "none",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                        message={
                                          <div>
                                            <Radio
                                              value={k}
                                              sx={{
                                                paddingBlock: 0,
                                                color:
                                                  detected === k
                                                    ? teal[200]
                                                    : "rgba(127, 140, 141, 0.5)",
                                                "&.Mui-checked": {
                                                  color: teal[400],
                                                },
                                              }}
                                            ></Radio>
                                            {k}
                                          </div>
                                        }
                                        action={
                                          userAnswer.isDetected && (
                                            <AvatarGroup
                                              max={5}
                                              style={{ marginTop: -3 }}
                                            >
                                              {userAnswer.isDetected[k] &&
                                                userAnswer.isDetected[k].map(
                                                  (user) => (
                                                    <Avatar
                                                      style={{
                                                        backgroundColor:
                                                          "#f39c12",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {annotators &&
                                                      annotators[user]
                                                        ? annotators[
                                                            user
                                                          ].firstName
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                          annotators[
                                                            user
                                                          ].lastName
                                                            .charAt(0)
                                                            .toUpperCase()
                                                        : user}
                                                    </Avatar>
                                                  )
                                                )}
                                            </AvatarGroup>
                                          )
                                        }
                                      />
                                    ))}
                                </RadioGroup>
                              </FormControl>
                            );
                          }
                          return null;
                        })()}
                      </Paper>

                      <Paper style={{ ...useStyles.paper1 }}>
                        {(() => {
                          if (
                            annotationResult[events[eIdx].id] &&
                            annotationResult[events[eIdx].id][
                              noteContent.info[conceptIdx].concept_id
                            ]
                          ) {
                            let temp =
                              annotationResult[events[eIdx].id][
                                noteContent.info[conceptIdx].concept_id
                              ][2];

                            let userAnswer = {};
                            let options = [
                              "yes, concept is new condition ",
                              "yes, exacerbation of a chronic condition",
                              "yes, presumed- part of differential diagnosis (assessment findings)",
                              "no, stable past medical history/ mention of chronic condition/ denying symptom",
                            ];

                            for (let user in temp) {
                              let userData = JSON.parse(temp[user].value);
                              for (let classifier in userData) {
                                if (
                                  userAnswer[classifier] &&
                                  userData[classifier] !== ""
                                ) {
                                  if (
                                    userAnswer[classifier][userData[classifier]]
                                  ) {
                                    userAnswer[classifier][
                                      userData[classifier]
                                    ].push(user);
                                  } else {
                                    userAnswer[classifier][
                                      userData[classifier]
                                    ] = [user];
                                  }
                                } else if (userData[classifier] !== "") {
                                  userAnswer[classifier] = {};
                                  userAnswer[classifier][userData[classifier]] =
                                    [];
                                  userAnswer[classifier][userData[classifier]] =
                                    [user];
                                }
                              }
                            }

                            return (
                              <FormControl fullWidth>
                                <FormLabel id="encounter-controlled-radio-buttons-group">
                                  Is it a concept being dealt within the current
                                  encounter?
                                </FormLabel>
                                <RadioGroup
                                  aria-labelledby="encounter-controlled-radio-buttons-group"
                                  name="controlled-radio-buttons-group"
                                  value={encounter}
                                  onChange={handleEncounter}
                                >
                                  {options
                                    .concat(
                                      userAnswer.isEncounter
                                        ? Object.keys(
                                            userAnswer.isEncounter
                                          ).filter(
                                            (elem) => !options.includes(elem)
                                          )
                                        : []
                                    )
                                    .map((k) => (
                                      <SnackbarContent
                                        sx={{
                                          border:
                                            encounter === k
                                              ? "2px solid rgba(26, 188, 156, 0.2)"
                                              : "2px solid rgba(127, 140, 141, 0.2)",
                                          backgroundColor:
                                            encounter === k
                                              ? "rgba(26, 188, 156, 0.2)"
                                              : "Background",
                                          color:
                                            encounter === k
                                              ? "rgba(26, 188, 156, 1.0)"
                                              : "rgba(127, 140, 141, 0.8)",
                                          boxShadow: "none",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                        message={
                                          <div>
                                            <Radio
                                              value={k}
                                              sx={{
                                                paddingBlock: 0,
                                                color:
                                                  encounter === k
                                                    ? teal[200]
                                                    : "rgba(127, 140, 141, 0.5)",
                                                "&.Mui-checked": {
                                                  color: teal[400],
                                                },
                                              }}
                                            ></Radio>
                                            {k}
                                          </div>
                                        }
                                        action={
                                          userAnswer.isEncounter && (
                                            <AvatarGroup
                                              max={5}
                                              style={{ marginTop: -3 }}
                                            >
                                              {userAnswer.isEncounter[k] &&
                                                userAnswer.isEncounter[k].map(
                                                  (user) => (
                                                    <Avatar
                                                      style={{
                                                        backgroundColor:
                                                          "#f39c12",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {annotators &&
                                                      annotators[user]
                                                        ? annotators[
                                                            user
                                                          ].firstName
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                          annotators[
                                                            user
                                                          ].lastName
                                                            .charAt(0)
                                                            .toUpperCase()
                                                        : user}
                                                    </Avatar>
                                                  )
                                                )}
                                            </AvatarGroup>
                                          )
                                        }
                                      />
                                    ))}
                                </RadioGroup>
                              </FormControl>
                            );
                          }
                          return null;
                        })()}
                      </Paper>

                      <Paper style={{ ...useStyles.paper1 }}>
                        {(() => {
                          if (
                            annotationResult[events[eIdx].id] &&
                            annotationResult[events[eIdx].id][
                              noteContent.info[conceptIdx].concept_id
                            ]
                          ) {
                            let temp =
                              annotationResult[events[eIdx].id][
                                noteContent.info[conceptIdx].concept_id
                              ][2];

                            let userAnswer = {};
                            let options = [
                              "no, concept is current to the encounter",
                              "yes, concept is about another person (not patient)",
                              "yes, concept ruled out as diagnosis/part of assessment",
                              "yes, concept has been completely resolved",
                              "unsure, concept status unknown/ not quantifiable",
                            ];

                            for (let user in temp) {
                              let userData = JSON.parse(temp[user].value);
                              for (let classifier in userData) {
                                if (
                                  userAnswer[classifier] &&
                                  userData[classifier] !== ""
                                ) {
                                  if (
                                    userAnswer[classifier][userData[classifier]]
                                  ) {
                                    userAnswer[classifier][
                                      userData[classifier]
                                    ].push(user);
                                  } else {
                                    userAnswer[classifier][
                                      userData[classifier]
                                    ] = [user];
                                  }
                                } else if (userData[classifier] !== "") {
                                  userAnswer[classifier] = {};
                                  userAnswer[classifier][userData[classifier]] =
                                    [];
                                  userAnswer[classifier][userData[classifier]] =
                                    [user];
                                }
                              }
                            }

                            return (
                              <FormControl fullWidth>
                                <FormLabel id="encounter-controlled-radio-buttons-group">
                                  Given the context, should term be negated?
                                </FormLabel>
                                <RadioGroup
                                  aria-labelledby="encounter-controlled-radio-buttons-group"
                                  name="controlled-radio-buttons-group"
                                  value={negated}
                                  onChange={handleNegated}
                                >
                                  {options
                                    .concat(
                                      userAnswer.isNegated
                                        ? Object.keys(
                                            userAnswer.isNegated
                                          ).filter(
                                            (elem) => !options.includes(elem)
                                          )
                                        : []
                                    )
                                    .map((k) => (
                                      <SnackbarContent
                                        sx={{
                                          border:
                                            negated === k
                                              ? "2px solid rgba(26, 188, 156, 0.2)"
                                              : "2px solid rgba(127, 140, 141, 0.2)",
                                          backgroundColor:
                                            negated === k
                                              ? "rgba(26, 188, 156, 0.2)"
                                              : "Background",
                                          color:
                                            negated === k
                                              ? "rgba(26, 188, 156, 1.0)"
                                              : "rgba(127, 140, 141, 0.8)",
                                          boxShadow: "none",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                        message={
                                          <div>
                                            <Radio
                                              value={k}
                                              sx={{
                                                paddingBlock: 0,
                                                color:
                                                  negated === k
                                                    ? teal[200]
                                                    : "rgba(127, 140, 141, 0.5)",
                                                "&.Mui-checked": {
                                                  color: teal[400],
                                                },
                                              }}
                                            ></Radio>
                                            {k}
                                          </div>
                                        }
                                        action={
                                          userAnswer.isNegated && (
                                            <AvatarGroup
                                              max={5}
                                              style={{ marginTop: -3 }}
                                            >
                                              {userAnswer.isNegated[k] &&
                                                userAnswer.isNegated[k].map(
                                                  (user) => (
                                                    <Avatar
                                                      style={{
                                                        backgroundColor:
                                                          "#f39c12",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {annotators &&
                                                      annotators[user]
                                                        ? annotators[
                                                            user
                                                          ].firstName
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                          annotators[
                                                            user
                                                          ].lastName
                                                            .charAt(0)
                                                            .toUpperCase()
                                                        : user}
                                                    </Avatar>
                                                  )
                                                )}
                                            </AvatarGroup>
                                          )
                                        }
                                      />
                                    ))}
                                </RadioGroup>
                              </FormControl>
                            );
                          }
                          return null;
                        })()}
                      </Paper>

                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-start"
                        spacing={1}
                      >
                        <Button
                          onClick={() => handleSave()}
                          size="small"
                          variant="contained"
                          color="primary"
                          component="span"
                        >
                          SAVE
                        </Button>
                        <Button
                          onClick={() => handleSaveAndNextConcept()}
                          size="small"
                          variant="contained"
                          color="primary"
                          component="span"
                        >
                          SAVE & NEXT CONCEPT
                        </Button>
                      </Stack>
                    </div>
                  )}
                </ScrollBar>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      <Box sx={{ ...useStyles.pages }}>
        <Pages
          total={events.length}
          page={eIdx + 1}
          onChange={handlePageChange}
        />
      </Box>
    </>
  );
}
