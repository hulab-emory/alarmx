import React, { useEffect, useState } from "react";
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
  TextField,
  IconButton,
} from "@mui/material";
import { updateAnnotation } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { createTheme } from "@mui/material/styles";
import DataPanel from "./Note";
import { Pages } from "../../../common/Pages";
import { ChatGptIcon } from "../../../common/Icons";
import { MdDone, MdClear } from "react-icons/md";
import { styled } from "@mui/material/styles";

const SquareIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgb(25, 195, 125)",
  width: theme.spacing(5), // Adjust the width as per your preference
  height: theme.spacing(5), // Make sure the height matches the width to create a square shape
  borderRadius: 5, // Set border radius to 0 to make it square
}));

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
    borderRadius: "4px",
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

function removeStartsWith(str, substringToRemove) {
  while (str.startsWith(substringToRemove)) {
    str = str.substring(substringToRemove.length);
  }
  return str;
}

export default function NlpNotes({
  events,
  project,
  aNotes,
  setAnnotatedNotes,
}) {
  const [detected, setDetected] = useState("");
  const [encounter, setEncounter] = useState("");
  const [negated, setNegated] = useState("");
  const [customEncounter, setCustomEncounter] = useState("");
  const [customNegated, setCustomNegated] = useState("");
  const [completedTab, setCompletedTab] = useState(false);
  const [eIdx, setEIdx] = useState(0);
  const [conceptIdx, setConcept] = useState(0);
  const [noteContent, setNoteContent] = useState(null);
  const [noteFileName, setNoteFileName] = useState(
    events[eIdx].cadaFile.path.split("/").pop()
  );

  const dispatch = useDispatch();

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
        ...aNotes[events[eIdx].id],
        [conceptIdx]: {
          isDetected: detected,
          isEncounter: encounter,
          isNegated: negated,
        },
      }).map(Number),
      noteContent.info.length
    );

    dispatch(
      updateAnnotation(project.id, events[eIdx].id, completedTab, {
        field: noteContent.info[conceptIdx].concept_id,
        value: JSON.stringify({
          isDetected: detected,
          isEncounter:
            encounter === "custom -> "
              ? "custom -> " + customEncounter
              : encounter,
          isNegated:
            negated === "custom -> " ? "custom -> " + customNegated : negated,
        }),
        cadaAnnotationId: events[eIdx].cadaAnnotations[0].id,
        createdAt: new Date(new Date().toUTCString()).toISOString(),
        isComplete,
      })
    );

    setAnnotatedNotes({
      ...aNotes,
      [events[eIdx].id]: {
        ...aNotes[[events[eIdx].id]],
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
        ...aNotes[events[eIdx].id],
        [conceptIdx]: {
          isDetected: detected,
          isEncounter: encounter,
          isNegated: negated,
        },
      }).map(Number),
      noteContent.info.length
    );

    dispatch(
      updateAnnotation(project.id, events[eIdx].id, completedTab, {
        field: noteContent.info[conceptIdx].concept_id,
        value: JSON.stringify({
          isDetected: detected,
          isEncounter:
            encounter === "custom -> "
              ? "custom -> " + customEncounter
              : encounter,
          isNegated:
            negated === "custom -> " ? "custom -> " + customNegated : negated,
        }),
        cadaAnnotationId: events[eIdx].cadaAnnotations[0].id,
        createdAt: new Date(new Date().toUTCString()).toISOString(),
        isComplete,
      })
    );

    setAnnotatedNotes({
      ...aNotes,
      [events[eIdx].id]: {
        ...aNotes[[events[eIdx].id]],
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
    let temp = Object.assign({}, aNotes);
    delete temp[events[eIdx].id][noteContent.info[conceptIdx].concept_id];
    setAnnotatedNotes(temp);
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

  const chipsData = [
    { icon: <MdDone fontSize="small" />, color: "primary" },
    { icon: <MdClear fontSize="small" />, color: "default" },
  ];

  const [activeChipIndex, setActiveChipIndex] = useState(0);

  const handleNextChip = () => {
    setActiveChipIndex((prevIndex) => (prevIndex + 1) % chipsData.length);
  };

  const chips = {
    "Factual Accuracy": ["Not factual", "somewhat", "completely"],
    Relevance: ["Not relevant", "somewhat", "completely"],
    Completeness: ["Highly incomplete", "somewhat", "completely"],
    Logic: ["Not logical", "somewhat ", "completely"],
    Clarity: ["Not clear", "somewhat", " completely"],
  };

  const [selectedChips, setSelectedChips] = useState({});

  const handleChipClick = (category, label) => {
    setSelectedChips((prevSelectedChips) => ({
      ...prevSelectedChips,
      [category]: label,
    }));
  };

  useEffect(() => {
    setDetected("");
    setEncounter("");
    setNegated("");
    // Add/Remove event listener for keydown event
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [conceptIdx, eIdx, noteContent, aNotes]);

  useEffect(() => {
    const fetchNote = async () => {
      console.log("Fetching note ... ", noteFileName);
      try {
        const fileContent = await import(`../../../assets/${noteFileName}`);
        setNoteContent(fileContent);
      } catch (error) {
        console.error("Error loading file:", error);
      }
    };

    fetchNote();
  }, [noteFileName]);

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
            <Grid item xs>
              <DataPanel
                concept={conceptIdx}
                note={noteContent}
                annotated={Object.keys(aNotes[events[eIdx].id] || [])}
                handleHighlightClick={handleHighlightClick}
              />
            </Grid>
            <Grid item>
              <Box
                position="relative"
                sx={{ position: "sticky", top: "5rem", width: 550 }}
              >
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
                </Paper>
                {aNotes[events[eIdx].id] &&
                aNotes[events[eIdx].id][
                  noteContent.info[conceptIdx].concept_id
                ] ? (
                  <div>
                    <Paper
                      sx={{
                        py: 1,
                        px: 2,
                        mb: 2,
                        fontSize: "1rem",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      <Typography variant="body2" component="span" gutterBottom>
                        Is the concept correctly detected by the triggerring
                        word? <br />
                        <Radio
                          size="small"
                          checked={
                            aNotes[events[eIdx].id][
                              noteContent.info[conceptIdx].concept_id
                            ].isDetected === "yes"
                          }
                          onChange={handleDetected}
                          value="yes"
                          disabled
                          name="radio-button-demo"
                        />
                        yes
                        <Radio
                          size="small"
                          checked={
                            aNotes[events[eIdx].id][
                              noteContent.info[conceptIdx].concept_id
                            ].isDetected === "no"
                          }
                          onChange={handleDetected}
                          value="no"
                          disabled
                          name="radio-button-demo"
                        />
                        no
                      </Typography>
                    </Paper>

                    {aNotes[events[eIdx].id][
                      noteContent.info[conceptIdx].concept_id
                    ].isDetected === "yes" && (
                      <div>
                        <Paper
                          sx={{
                            py: 1,
                            px: 2,
                            mb: 2,
                            fontSize: "1rem",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          <Typography
                            variant="body2"
                            component="span"
                            gutterBottom
                          >
                            Is it a concept being dealt within the current
                            encounter?
                            <br />
                            (regardless if it is the condition of the patient)?
                            <br />
                            <Radio
                              size="small"
                              checked={
                                aNotes[events[eIdx].id][
                                  noteContent.info[conceptIdx].concept_id
                                ].isEncounter ===
                                "yes, concept is new condition "
                              }
                              onChange={handleEncounter}
                              value="yes, concept is new condition "
                              disabled
                            />
                            yes, concept is new condition
                            <br />
                            <Radio
                              size="small"
                              checked={
                                aNotes[events[eIdx].id][
                                  noteContent.info[conceptIdx].concept_id
                                ].isEncounter ===
                                "yes, exacerbation of a chronic condition"
                              }
                              onChange={handleEncounter}
                              value="yes, exacerbation of a chronic condition"
                              disabled
                            />
                            yes, exacerbation of a chronic condition
                            <br />
                            <Radio
                              size="small"
                              checked={
                                aNotes[events[eIdx].id][
                                  noteContent.info[conceptIdx].concept_id
                                ].isEncounter ===
                                "yes, presumed- part of differential diagnosis (assessment findings)"
                              }
                              onChange={handleEncounter}
                              value="yes, presumed- part of differential diagnosis (assessment findings)"
                              disabled
                            />
                            yes, presumed- part of differential diagnosis
                            (assessment findings)
                            <br />
                            <Radio
                              size="small"
                              checked={
                                aNotes[events[eIdx].id][
                                  noteContent.info[conceptIdx].concept_id
                                ].isEncounter ===
                                "no, stable past medical history/ mention of chronic condition/ denying symptom"
                              }
                              onChange={handleEncounter}
                              value="no, stable past medical history/ mention of chronic condition/ denying symptom"
                              disabled
                            />
                            no, stable past medical history/ mention of chronic
                            condition/ denying symptom
                            <br />
                            {aNotes[events[eIdx].id][
                              noteContent.info[conceptIdx].concept_id
                            ].isEncounter.startsWith("custom -> ") && (
                              <>
                                <Radio size="small" checked={true} disabled />
                                {removeStartsWith(
                                  aNotes[events[eIdx].id][
                                    noteContent.info[conceptIdx].concept_id
                                  ].isEncounter,
                                  "custom -> "
                                )}
                              </>
                            )}
                          </Typography>
                        </Paper>
                        <Paper
                          sx={{
                            py: 1,
                            px: 2,
                            mb: 2,
                            fontSize: "1rem",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          <Typography
                            variant="body2"
                            component="span"
                            gutterBottom
                          >
                            Given the context, should term be negated?
                            <br />
                            <Radio
                              size="small"
                              checked={
                                aNotes[events[eIdx].id][
                                  noteContent.info[conceptIdx].concept_id
                                ].isNegated ===
                                "no, concept is current to the overall note"
                              }
                              onChange={handleNegated}
                              value="no, concept is current to the overall note"
                              disabled
                            />
                            no, concept is current to the overall note
                            <br />
                            <Radio
                              size="small"
                              checked={
                                aNotes[events[eIdx].id][
                                  noteContent.info[conceptIdx].concept_id
                                ].isNegated ===
                                "yes, concept is about another person (not patient)"
                              }
                              onChange={handleNegated}
                              value="yes, concept is about another person (not patient)"
                              disabled
                            />
                            yes, concept is about another person (not patient)
                            <br />
                            <Radio
                              size="small"
                              checked={
                                aNotes[events[eIdx].id][
                                  noteContent.info[conceptIdx].concept_id
                                ].isNegated ===
                                "yes, concept ruled out as diagnosis/part of assessment"
                              }
                              onChange={handleNegated}
                              value="yes, concept ruled out as diagnosis/part of assessment"
                              disabled
                            />
                            yes, concept ruled out as diagnosis/part of
                            assessment
                            <br />
                            <Radio
                              size="small"
                              checked={
                                aNotes[events[eIdx].id][
                                  noteContent.info[conceptIdx].concept_id
                                ].isNegated ===
                                "yes, concept has been completely resolved"
                              }
                              onChange={handleNegated}
                              value="yes, concept has been completely resolved"
                              disabled
                            />
                            yes, concept has been completely resolved
                            <br />
                            <Radio
                              size="small"
                              checked={
                                aNotes[events[eIdx].id][
                                  noteContent.info[conceptIdx].concept_id
                                ].isNegated ===
                                "unsure, concept status unknown/ not quantifiable example: pain decreased, but unknown if fully resolved"
                              }
                              onChange={handleNegated}
                              value="unsure, concept status unknown/ not quantifiable example: pain decreased, but unknown if fully resolved"
                              disabled
                            />
                            unsure, concept status unknown/ not quantifiable
                            example: pain decreased, but unknown if fully
                            resolved
                            <br />
                            {aNotes[events[eIdx].id][
                              noteContent.info[conceptIdx].concept_id
                            ].isNegated.startsWith("custom -> ") && (
                              <>
                                <Radio size="small" checked={true} disabled />
                                {removeStartsWith(
                                  aNotes[events[eIdx].id][
                                    noteContent.info[conceptIdx].concept_id
                                  ].isNegated,
                                  "custom -> "
                                )}
                              </>
                            )}
                          </Typography>
                        </Paper>
                      </div>
                    )}

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
                    <Paper
                      sx={{
                        py: 1,
                        px: 2,
                        mb: 2,
                        fontSize: "1rem",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      <Typography
                        id="concept"
                        variant="body2"
                        component="span"
                        gutterBottom
                      >
                        Is the concept correctly detected by the triggerring
                        word? <br />
                        <Radio
                          size="small"
                          checked={detected === "yes"}
                          onChange={handleDetected}
                          value="yes"
                          name="radio-button-demo"
                        />
                        yes
                        <Radio
                          size="small"
                          checked={detected === "no"}
                          onChange={handleDetected}
                          value="no"
                          name="radio-button-demo"
                        />
                        no
                      </Typography>
                    </Paper>

                    {detected === "yes" ? (
                      <div>
                        <Paper
                          sx={{
                            py: 1,
                            px: 2,
                            mb: 2,
                            fontSize: "1rem",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          <Typography
                            id="concept"
                            variant="body2"
                            component="span"
                            gutterBottom
                          >
                            Is it a concept being dealt within the current
                            encounter?
                            <br />
                            (regardless if it is the condition of the patient)
                            <br />
                            <Radio
                              size="small"
                              checked={
                                encounter === "yes, concept is new condition "
                              }
                              onChange={handleEncounter}
                              value="yes, concept is new condition "
                            />
                            yes, concept is new condition
                            <br />
                            <Radio
                              size="small"
                              checked={
                                encounter ===
                                "yes, exacerbation of a chronic condition"
                              }
                              onChange={handleEncounter}
                              value="yes, exacerbation of a chronic condition"
                            />
                            yes, exacerbation of a chronic condition
                            <br />
                            <Radio
                              size="small"
                              checked={
                                encounter ===
                                "yes, presumed- part of differential diagnosis (assessment findings)"
                              }
                              onChange={handleEncounter}
                              value="yes, presumed- part of differential diagnosis (assessment findings)"
                            />
                            yes, presumed- part of differential diagnosis
                            (assessment findings)
                            <br />
                            <Radio
                              size="small"
                              checked={
                                encounter ===
                                "no, stable past medical history/ mention of chronic condition/ denying symptom"
                              }
                              onChange={handleEncounter}
                              value="no, stable past medical history/ mention of chronic condition/ denying symptom"
                            />
                            no, stable past medical history/ mention of chronic
                            condition/ denying symptom
                            <br />
                            <Radio
                              size="small"
                              checked={encounter === "custom -> "}
                              onChange={handleEncounter}
                              value="custom -> "
                            />
                            <TextField
                              InputProps={{
                                sx: {
                                  fontSize: 14,
                                  minWidth: 400,
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  fontSize: 12,
                                },
                              }}
                              size="small"
                              disabled={encounter !== "custom -> "}
                              id="outlined-multiline-flexible"
                              label="custom label"
                              helperText="create additional category if you feel absolutely necessary."
                              multiline
                              value={customEncounter}
                              maxRows={4}
                              onChange={(event) => {
                                setCustomEncounter(event.target.value);
                              }}
                            />
                          </Typography>
                        </Paper>
                        <Paper
                          sx={{
                            py: 1,
                            px: 2,
                            mb: 2,
                            fontSize: "1rem",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          <Typography
                            id="concept"
                            variant="body2"
                            component="span"
                            gutterBottom
                          >
                            Given the context, should term be negated?
                            <br />
                            <Radio
                              size="small"
                              checked={
                                negated ===
                                "no, concept is current to the overall note"
                              }
                              onChange={handleNegated}
                              value="no, concept is current to the overall note"
                            />
                            no, concept is current to the overall note
                            <br />
                            <Radio
                              size="small"
                              checked={
                                negated ===
                                "yes, concept is about another person (not patient)"
                              }
                              onChange={handleNegated}
                              value="yes, concept is about another person (not patient)"
                            />
                            yes, concept is about another person (not patient)
                            <br />
                            <Radio
                              size="small"
                              checked={
                                negated ===
                                "yes, concept ruled out as diagnosis/part of assessment"
                              }
                              onChange={handleNegated}
                              value="yes, concept ruled out as diagnosis/part of assessment"
                            />
                            yes, concept ruled out as diagnosis/part of
                            assessment
                            <br />
                            <Radio
                              size="small"
                              checked={
                                negated ===
                                "yes, concept has been completely resolved"
                              }
                              onChange={handleNegated}
                              value="yes, concept has been completely resolved"
                            />
                            yes, concept has been completely resolved
                            <br />
                            <Radio
                              size="small"
                              checked={
                                negated ===
                                "unsure, concept status unknown/ not quantifiable example: pain decreased, but unknown if fully resolved"
                              }
                              onChange={handleNegated}
                              value="unsure, concept status unknown/ not quantifiable example: pain decreased, but unknown if fully resolved"
                            />
                            unsure, concept status unknown/ not quantifiable
                            example: pain decreased, but unknown if fully
                            resolved
                            <br />
                            <Radio
                              size="small"
                              checked={negated === "custom -> "}
                              onChange={handleNegated}
                              value="custom -> "
                            />
                            <TextField
                              InputProps={{
                                sx: {
                                  fontSize: 14,
                                  minWidth: 400,
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  fontSize: 12,
                                },
                              }}
                              size="small"
                              disabled={negated !== "custom -> "}
                              id="outlined-multiline-flexible"
                              label="custom label"
                              helperText="create additional category if you feel absolutely necessary."
                              multiline
                              value={customNegated}
                              maxRows={4}
                              onChange={(event) => {
                                setCustomNegated(event.target.value);
                              }}
                            />
                          </Typography>
                        </Paper>
                      </div>
                    ) : (
                      ""
                    )}

                    {detected === "no" ||
                    (detected !== "" && encounter !== "" && negated !== "") ? (
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
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </Box>
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
