import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Box,
  Tabs,
  Tab,
  Divider,
  Stack,
  IconButton,
  ButtonGroup,
  Tooltip,
} from "@mui/material";
import { updateAnnotation } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { createTheme } from "@mui/material/styles";
import DataPanel from "./Note";
import { Pages } from "../../../common/Pages";
import { ChatGptIcon } from "../../../common/Icons";

import { styled } from "@mui/material/styles";
import Label from "../../../common/Label";
import { MdInfo } from "react-icons/md";
import ScrollBar from "../../../common/ScrollBar";

const SquareIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgb(25, 195, 125)",
  width: theme.spacing(5), // Adjust the width as per your preference
  height: theme.spacing(5), // Make sure the height matches the width to create a square shape
  borderRadius: 5, // Set border radius to 0 to make it square
}));

const theme = createTheme();

const useStyle = {
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
  temp,
}) {
  const [detected] = useState("");
  const [encounter] = useState("");
  const [negated] = useState("");
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

  const [values, setValues] = React.useState({
    factuality: "",
    relevance: "",
    completeness: "",
    logicality: "",
    clarity: "",
    overallComprehensibility: "",
  });

  const handleButtonClick = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log(values);
    // Handle submission logic here
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
        value: JSON.stringify(values),
        cadaAnnotationId: events[eIdx].cadaAnnotations[0].id,
        createdAt: new Date(new Date().toUTCString()).toISOString(),
        isComplete,
      })
    );
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
        value: JSON.stringify(values),
        cadaAnnotationId: events[eIdx].cadaAnnotations[0].id,
        createdAt: new Date(new Date().toUTCString()).toISOString(),
        isComplete,
      })
    );

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
    console.log("conceptIndex", conceptIndex);
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
    setValues({
      factuality: "",
      relevance: "",
      completeness: "",
      logicality: "",
      clarity: "",
      overallComprehensibility: "",
    });

    if (col2Ref.current) {
      const height2 = col2Ref.current.offsetHeight;
      setCol1Height(`${height2}px`);
    }

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

        if (fileContent && fileContent.info) {
          const updatedFileContent = {
            ...fileContent,
            info: fileContent.info.filter((hobby) =>
              Object.keys(temp[noteFileName.split(".")[0]])
                .map(Number)
                .includes(hobby.concept_id)
            ),
          };
          console.log("updatedFileContent", updatedFileContent);
          setNoteContent(updatedFileContent);
        } else {
          console.error("Unexpected file structure:", fileContent);
        }
      } catch (error) {
        console.error("Error loading file:", error);
      }
    };

    if (noteFileName) {
      // Making sure noteFileName is defined before attempting to fetch
      fetchNote();
    }
  }, [noteFileName, setNoteContent]);

  const allValuesFilled = Object.values(values).every((value) => value !== "");

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

        {events[eIdx] &&
          noteContent &&
          temp[noteFileName.split(".")[0]][
            noteContent.info[conceptIdx].concept_id
          ] && (
            <Grid container spacing={3}>
              <Grid item sm={8}>
                <Paper style={{ height: col1Height }}>
                  <ScrollBar style={{ maxHeight: "100%" }}>
                    <DataPanel
                      concept={conceptIdx}
                      note={noteContent}
                      annotated={Object.keys(aNotes[events[eIdx].id] || [])}
                      handleHighlightClick={handleHighlightClick}
                    />
                  </ScrollBar>
                </Paper>
              </Grid>
              <Grid item sm={4}>
                <Box ref={col2Ref}>
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
                      variant="subtitle"
                      component="span"
                      gutterBottom
                    >
                      Concept:{" "}
                      <span style={{ ...useStyle.concept }}>
                        {noteContent.info[conceptIdx].concept}
                      </span>
                    </Typography>
                    <Divider sx={{ border: "none" }} />
                    <Typography
                      id="trigger"
                      variant="subtitle"
                      component="span"
                      gutterBottom
                    >
                      Trigger:{" "}
                      <span style={{ ...useStyle.trigger }}>
                        {noteContent.info[conceptIdx].trigger_word}
                      </span>
                    </Typography>
                  </Paper>

                  <>
                    <Paper
                      sx={{
                        py: 1,
                        px: 2,
                        mb: 2,
                        fontSize: "1rem",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        {(() => {
                          switch (
                            temp[noteFileName.split(".")[0]][
                              noteContent.info[conceptIdx].concept_id
                            ].type
                          ) {
                            case "detection":
                              return (
                                <Tooltip
                                  sx={{ textAlign: "center" }}
                                  title="Is the concept correctly detected by the triggerring word?"
                                >
                                  <Label color="success">
                                    {temp[noteFileName.split(".")[0]][
                                      noteContent.info[conceptIdx].concept_id
                                    ].type.toUpperCase()}
                                  </Label>
                                </Tooltip>
                              );
                            case "encounter":
                              return (
                                <Tooltip
                                  sx={{ textAlign: "center" }}
                                  title="Is it a concept being dealt within the current encounter?"
                                >
                                  <Label color="secondary">
                                    {temp[noteFileName.split(".")[0]][
                                      noteContent.info[conceptIdx].concept_id
                                    ].type.toUpperCase()}
                                  </Label>
                                </Tooltip>
                              );
                            case "negation":
                              return (
                                <Tooltip
                                  sx={{ textAlign: "center" }}
                                  title="Given the context, should term be negated?"
                                >
                                  <Label color="info">
                                    {temp[noteFileName.split(".")[0]][
                                      noteContent.info[conceptIdx].concept_id
                                    ].type.toUpperCase()}
                                  </Label>
                                </Tooltip>
                              );
                            default:
                              return "";
                          }
                        })()}
                      </Stack>

                      <Grid container direction="row" spacing={1}>
                        <Grid item xs={12}>
                          {
                            temp[noteFileName.split(".")[0]][
                              noteContent.info[conceptIdx].concept_id
                            ].Question
                          }
                        </Grid>
                        <Grid item xs={1}>
                          <SquareIconButton>
                            <ChatGptIcon />
                          </SquareIconButton>
                        </Grid>
                        <Grid item xs={11} spacing={1}>
                          {
                            temp[noteFileName.split(".")[0]][
                              noteContent.info[conceptIdx].concept_id
                            ]["GPT-4"]
                          }
                        </Grid>
                      </Grid>
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
                          <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            style={{ marginBottom: "-10px" }}
                          >
                            <Tooltip
                              sx={{ textAlign: "center" }}
                              title="Evaluate the evidence ChatGPT collects from the note based on its factuality (ranging from not factual to completely factual), its relevance (ranging from not relevant to completely relevant), and its completeness (ranging from highly incomplete to complete)."
                            >
                              <IconButton color="info">
                                <MdInfo />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                          {/* Factuality */}
                          <Typography variant="subtitle">Factuality</Typography>

                          <div style={{ paddingBottom: 5 }}></div>
                          <ButtonGroup
                            size="small"
                            fullWidth
                            aria-label="outlined primary button group"
                          >
                            {["Not factual", "Somewhat", "Completely"].map(
                              (option) => (
                                <Button
                                  key={option}
                                  onClick={() =>
                                    handleButtonClick("factuality", option)
                                  }
                                  variant={
                                    aNotes[events[eIdx].id][
                                      noteContent.info[conceptIdx].concept_id
                                    ].factuality === option
                                      ? "contained"
                                      : "outlined"
                                  }
                                >
                                  {option}
                                </Button>
                              )
                            )}
                          </ButtonGroup>

                          {/* Relevance */}
                          <Typography variant="subtitle">Relevance</Typography>

                          <div style={{ paddingBottom: 5 }}></div>
                          <ButtonGroup
                            size="small"
                            fullWidth
                            aria-label="outlined primary button group"
                          >
                            {["Not relevant", "Somewhat", "Completely"].map(
                              (option) => (
                                <Button
                                  key={option}
                                  onClick={() =>
                                    handleButtonClick("relevance", option)
                                  }
                                  variant={
                                    aNotes[events[eIdx].id][
                                      noteContent.info[conceptIdx].concept_id
                                    ].relevance === option
                                      ? "contained"
                                      : "outlined"
                                  }
                                >
                                  {option}
                                </Button>
                              )
                            )}
                          </ButtonGroup>

                          {/* Completeness */}
                          <Typography variant="subtitle">
                            Completeness
                          </Typography>

                          <div style={{ paddingBottom: 5 }}></div>
                          <ButtonGroup
                            size="small"
                            fullWidth
                            aria-label="outlined primary button group"
                          >
                            {[
                              "Highly incomplete",
                              "Somewhat",
                              "Completely",
                            ].map((option) => (
                              <Button
                                key={option}
                                onClick={() =>
                                  handleButtonClick("completeness", option)
                                }
                                variant={
                                  aNotes[events[eIdx].id][
                                    noteContent.info[conceptIdx].concept_id
                                  ].completeness === option
                                    ? "contained"
                                    : "outlined"
                                }
                              >
                                {option}
                              </Button>
                            ))}
                          </ButtonGroup>
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
                          <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            style={{ marginBottom: "-10px" }}
                          >
                            <Tooltip
                              sx={{ textAlign: "center" }}
                              title=" Evaluate the logic ChatGPT uses to reach conclusions from evidence in terms of its logicality (ranging from not logical to completely logical) and its clarity (ranging from not clear to completely clear)."
                            >
                              <IconButton color="info">
                                <MdInfo />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                          {/* Logicality */}
                          <Typography variant="subtitle">Logicality</Typography>

                          <div style={{ paddingBottom: 5 }}></div>
                          <ButtonGroup
                            size="small"
                            fullWidth
                            aria-label="outlined primary button group"
                          >
                            {["Not logical", "Somewhat", "Completely"].map(
                              (option) => (
                                <Button
                                  key={option}
                                  onClick={() =>
                                    handleButtonClick("logicality", option)
                                  }
                                  variant={
                                    aNotes[events[eIdx].id][
                                      noteContent.info[conceptIdx].concept_id
                                    ].logicality === option
                                      ? "contained"
                                      : "outlined"
                                  }
                                >
                                  {option}
                                </Button>
                              )
                            )}
                          </ButtonGroup>

                          {/* Clarity */}
                          <Typography variant="subtitle">Clarity</Typography>

                          <div style={{ paddingBottom: 5 }}></div>
                          <ButtonGroup
                            size="small"
                            fullWidth
                            aria-label="outlined primary button group"
                          >
                            {["Not clear", "Somewhat", "Completely"].map(
                              (option) => (
                                <Button
                                  key={option}
                                  onClick={() =>
                                    handleButtonClick("clarity", option)
                                  }
                                  variant={
                                    aNotes[events[eIdx].id][
                                      noteContent.info[conceptIdx].concept_id
                                    ].clarity === option
                                      ? "contained"
                                      : "outlined"
                                  }
                                >
                                  {option}
                                </Button>
                              )
                            )}
                          </ButtonGroup>
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
                          <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            style={{ marginBottom: "-10px" }}
                          >
                            <Tooltip
                              sx={{ textAlign: "center" }}
                              title="Assess the overall comprehensibility of ChatGPT's output to peer clinicians, rating it as either incomprehensible, somewhat comprehensible, or completely comprehensible."
                            >
                              <IconButton color="info">
                                <MdInfo />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                          {/* Overall Comprehensibility */}
                          <Typography variant="subtitle">
                            Overall Comprehensibility
                          </Typography>
                          <div style={{ paddingBottom: 5 }}></div>
                          <ButtonGroup
                            size="small"
                            fullWidth
                            aria-label="outlined primary button group"
                          >
                            {["Incomprehensible", "Somewhat", "Completely"].map(
                              (option) => (
                                <Button
                                  key={option}
                                  onClick={() =>
                                    handleButtonClick(
                                      "overallComprehensibility",
                                      option
                                    )
                                  }
                                  variant={
                                    aNotes[events[eIdx].id][
                                      noteContent.info[conceptIdx].concept_id
                                    ].overallComprehensibility === option
                                      ? "contained"
                                      : "outlined"
                                  }
                                >
                                  {option}
                                </Button>
                              )
                            )}
                          </ButtonGroup>
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
                        <Paper
                          sx={{
                            py: 1,
                            px: 2,
                            mb: 2,
                            fontSize: "1rem",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            style={{ marginBottom: "-10px" }}
                          >
                            <Tooltip
                              sx={{ textAlign: "center" }}
                              title="Evaluate the evidence ChatGPT collects from the note based on its factuality (ranging from not factual to completely factual), its relevance (ranging from not relevant to completely relevant), and its completeness (ranging from highly incomplete to complete)."
                            >
                              <IconButton color="info">
                                <MdInfo />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                          {/* Factuality */}
                          <Typography variant="subtitle">Factuality</Typography>

                          <div style={{ paddingBottom: 5 }}></div>
                          <ButtonGroup
                            size="small"
                            fullWidth
                            aria-label="outlined primary button group"
                          >
                            {["Not factual", "Somewhat", "Completely"].map(
                              (option) => (
                                <Button
                                  key={option}
                                  onClick={() =>
                                    handleButtonClick("factuality", option)
                                  }
                                  variant={
                                    values.factuality === option
                                      ? "contained"
                                      : "outlined"
                                  }
                                >
                                  {option}
                                </Button>
                              )
                            )}
                          </ButtonGroup>

                          {/* Relevance */}
                          <Typography variant="subtitle">Relevance</Typography>

                          <div style={{ paddingBottom: 5 }}></div>
                          <ButtonGroup
                            size="small"
                            fullWidth
                            aria-label="outlined primary button group"
                          >
                            {["Not relevant", "Somewhat", "Completely"].map(
                              (option) => (
                                <Button
                                  key={option}
                                  onClick={() =>
                                    handleButtonClick("relevance", option)
                                  }
                                  variant={
                                    values.relevance === option
                                      ? "contained"
                                      : "outlined"
                                  }
                                >
                                  {option}
                                </Button>
                              )
                            )}
                          </ButtonGroup>

                          {/* Completeness */}
                          <Typography variant="subtitle">
                            Completeness
                          </Typography>

                          <div style={{ paddingBottom: 5 }}></div>
                          <ButtonGroup
                            size="small"
                            fullWidth
                            aria-label="outlined primary button group"
                          >
                            {[
                              "Highly incomplete",
                              "Somewhat",
                              "Completely",
                            ].map((option) => (
                              <Button
                                key={option}
                                onClick={() =>
                                  handleButtonClick("completeness", option)
                                }
                                variant={
                                  values.completeness === option
                                    ? "contained"
                                    : "outlined"
                                }
                              >
                                {option}
                              </Button>
                            ))}
                          </ButtonGroup>
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
                          <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            style={{ marginBottom: "-10px" }}
                          >
                            <Tooltip
                              sx={{ textAlign: "center" }}
                              title="
Evaluate the logic ChatGPT uses to reach conclusions from evidence in terms of its logicality (ranging from not logical to completely logical) and its clarity (ranging from not clear to completely clear)."
                            >
                              <IconButton color="info">
                                <MdInfo />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                          {/* Logicality */}
                          <Typography variant="subtitle">Logicality</Typography>

                          <div style={{ paddingBottom: 5 }}></div>
                          <ButtonGroup
                            size="small"
                            fullWidth
                            aria-label="outlined primary button group"
                          >
                            {["Not logical", "Somewhat", "Completely"].map(
                              (option) => (
                                <Button
                                  key={option}
                                  onClick={() =>
                                    handleButtonClick("logicality", option)
                                  }
                                  variant={
                                    values.logicality === option
                                      ? "contained"
                                      : "outlined"
                                  }
                                >
                                  {option}
                                </Button>
                              )
                            )}
                          </ButtonGroup>

                          {/* Clarity */}
                          <Typography variant="subtitle">Clarity</Typography>

                          <div style={{ paddingBottom: 5 }}></div>
                          <ButtonGroup
                            size="small"
                            fullWidth
                            aria-label="outlined primary button group"
                          >
                            {["Not clear", "Somewhat", "Completely"].map(
                              (option) => (
                                <Button
                                  key={option}
                                  onClick={() =>
                                    handleButtonClick("clarity", option)
                                  }
                                  variant={
                                    values.clarity === option
                                      ? "contained"
                                      : "outlined"
                                  }
                                >
                                  {option}
                                </Button>
                              )
                            )}
                          </ButtonGroup>
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
                          <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            style={{ marginBottom: "-10px" }}
                          >
                            <Tooltip
                              sx={{ textAlign: "center" }}
                              title="Assess the overall comprehensibility of ChatGPT's output to peer clinicians, rating it as either incomprehensible, somewhat comprehensible, or completely comprehensible."
                            >
                              <IconButton color="info">
                                <MdInfo />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                          {/* Overall Comprehensibility */}
                          <Typography variant="subtitle">
                            Overall Comprehensibility
                          </Typography>

                          <div style={{ paddingBottom: 5 }}></div>
                          <ButtonGroup
                            size="small"
                            fullWidth
                            aria-label="outlined primary button group"
                          >
                            {["Incomprehensible", "Somewhat", "Completely"].map(
                              (option) => (
                                <Button
                                  key={option}
                                  onClick={() =>
                                    handleButtonClick(
                                      "overallComprehensibility",
                                      option
                                    )
                                  }
                                  variant={
                                    values.overallComprehensibility === option
                                      ? "contained"
                                      : "outlined"
                                  }
                                >
                                  {option}
                                </Button>
                              )
                            )}
                          </ButtonGroup>
                        </Paper>
                      </div>
                    )}
                    {allValuesFilled && (
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
                    )}
                  </>
                </Box>
              </Grid>
            </Grid>
          )}
      </Box>
      <Box sx={{ ...useStyle.pages }}>
        <Pages
          total={events.length}
          page={eIdx + 1}
          onChange={handlePageChange}
        />
      </Box>
    </>
  );
}
