import {
  Typography,
  Paper,
  Grid,
  Radio,
  Button,
  Box,
  Stack,
  FormControl,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from 'react';
import { createTheme } from "@mui/material/styles";
import DataPanel from "./Data";
import axios from "axios";
import { patternSort } from "../../../utils/cot_helper";
import { filterMostRecentByField } from "../../../utils/annotation_helper";
import { useDispatch } from "react-redux";
import { updateAnnotation } from "../../../redux/actions";
import { isEqual } from "../../../../../utils/objectFunctions";

const theme = createTheme();

// const getTokenColor = (token) => {
//   if (token.toLowerCase().includes("high") || token.toLowerCase().slice(-2) === "_h" || token.includes("+")) {
//     return "success";
//   }

//   if (token.toLowerCase().includes("low") || token.toLowerCase().slice(-2) === "_l" || token.includes("-")) {
//     return "error";
//   }

//   return "info";
// }

const CHOICES = ["Pattern A", "Pattern B", "Both A and B", "Neither A nor B"];

const QUESTIONS = [
  {
    label: "surprising",
    question: "Which pattern is more surprising?",
    expectedResults: CHOICES,
  },
  {
    label: "specific",
    question: "Which pattern is more specific to patients developing ARDS?",
    expectedResults: CHOICES,
  },
  {
    label: "actionable",
    question: "Which pattern is more actionable?",
    expectedResults: CHOICES,
  },
  {
    label: "comments",
    question: "Comments",
    expectedResults: "text",
  }
];


export default function Panel({ user, project, events, eIdx, setEIdx }) {

  const [pair, setPair] = useState({});
  const [patterns, setPatterns] = useState([]);

  const [annotationValues, setAnnotationValues] = useState({});
  const [originalAnnotationValues, setOriginalAnnotationValues] = useState({});

  const dispatch = useDispatch();

  const canSave = () => {
    return Object.values(annotationValues).splice(0, 3).every(value => value !== null && value !== undefined) && Object.keys(annotationValues).splice(0, 3).length === QUESTIONS.length - 1 && !isEqual(annotationValues, originalAnnotationValues);
  }

  useEffect(() => {
    setAnnotationValues({});
    setOriginalAnnotationValues({});
    const filePath = events[eIdx].cadaFile.path;
    axios({
      method: "get",
      url: `/api/cada/file/json?filename=${encodeURIComponent(filePath)}`,
    }).then(res => {
      setPair(res.data);
      const annotations = filterMostRecentByField(events[eIdx].cadaAnnotations[0].cadaAnnotationValues);
      console.log(annotations)
      for (let annotationValues of annotations) {
        const value = JSON.parse(annotationValues.value);
        for (const key in value) {
          // check if key is in an obj.label in QUESTIONS
          if (!QUESTIONS.some(q => q.label === key)) {
            delete value[key];
          }
        }
        setAnnotationValues(JSON.parse(JSON.stringify(value)));
        setOriginalAnnotationValues(JSON.parse(JSON.stringify(value)));
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eIdx]);

  useEffect(() => {
    const getTokens = async () => {
      if (pair.patterns) {
        const patternResults = [];
        for (const patternName of pair.patterns) {
          const pattern = await axios({
            method: "get",
            url: `/api/cada/file/json?filename=${encodeURIComponent(patternName)}`,
          });
          patternResults.push(pattern.data);
        }
        const patternSorted = patternSort(patternResults[0], patternResults[1]);
        setPatterns(patternSorted);
      }
    }

    getTokens();
  }, [pair]);

  const handleChange = (field, label) => (e) => {
    setAnnotationValues(curr => {
      return {
        ...curr,
        [label]: field === "text" ? e.target.value : field,
      };
    });
  };

  const handleSave = () => {
    if (canSave()) {
      const isComplete = Object.values(annotationValues).every(value => value !== null && value !== undefined) && Object.keys(annotationValues).length === QUESTIONS.length;

      dispatch(
        updateAnnotation(project.id, events[eIdx].id, true,
          {
            field: "0",
            value: JSON.stringify(annotationValues),
            cadaAnnotationId: events[eIdx].cadaAnnotations[0].id,
            createdAt: new Date(new Date().toUTCString()).toISOString(),
            isComplete,
          }
        )
      );

      setOriginalAnnotationValues(annotationValues);
    }

  };

  const handleNext = () => {
    handleSave();
    setEIdx(curr => curr + 1);
  };

  const handlePrevious = () => {
    handleSave();
    setEIdx(curr => curr > 0 ? curr - 1 : curr);
  }

  return (
    <Grid container columns={1} width="100%">
      <Grid item xs={1}>
        <DataPanel
          patterns={patterns}
          annotationValues={annotationValues}
        />
      </Grid>
      <Grid item xs={1}>
        <Box
        // position="relative"
        // sx={{ position: "sticky", top: "50px", width: "100%" }}
        >
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              py: 1,
              px: 2,
              mb: 2,
              color: theme.palette.text.secondary,
            }}
          >
            <Stack
              display="flex"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>
                <span>{eIdx + 1} of {events.length}</span>
              </Typography>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-start"
                spacing={1}
                mr={1.5}
              >
                {eIdx > 0 && <Button
                  onClick={handlePrevious}
                  size="small"
                  variant="contained"
                  color="secondary"
                  component="span"
                >
                  PREVIOUS
                </Button>}
                {canSave() &&
                  <Button
                    onClick={handleSave}
                    size="small"
                    variant="contained"
                    color="primary"
                    component="span"
                  >
                    SAVE
                  </Button>}
                {eIdx < events.length - 1 && <Button
                  onClick={handleNext}
                  size="small"
                  variant="contained"
                  color="primary"
                  component="span"
                >
                  {canSave() && "SAVE & "}NEXT
                </Button>}
              </Stack>
            </Stack>
          </Paper>
          {QUESTIONS.map((q, idx) => (
            <Paper
              key={idx}
              sx={{
                display: "flex",
                flexDirection: "column",
                py: 1,
                px: 4,
                mb: 2,
                color: theme.palette.text.secondary,
              }}
            >
              <Typography
                variant="body2"
                component="span"
                fontSize="0.9rem"
                gutterBottom
              >
                {q.question} <br />
                <FormControl sx={{width: "100%", maxWidth: "800px", marginTop: "10px"}}>
                  {Array.isArray(q.expectedResults) && <RadioGroup row>
                    {Array.isArray(q.expectedResults) && q.expectedResults.map((choice, idx) => (
                      <FormControlLabel
                        key={idx}
                        control={
                          <Radio
                            size="small"
                            value="0"
                            name="radio-button-demo"
                            checked={annotationValues[q.label] === choice}
                            onChange={handleChange(choice, q.label)}
                          />
                        }
                        label={choice}
                        componentsProps={{ typography: { fontSize: "0.9rem" } }}
                      />
                    ))}
                  </RadioGroup>}
                  {q.expectedResults === "text" &&
                  <TextField
                    key={idx}
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={5}
                    value={annotationValues[q.label] || ""}
                    onChange={handleChange("text", q.label)}
                  />}
                </FormControl>
              </Typography>
            </Paper>
          ))}


          {/* {eIdx !== 0 && !saved ? <Typography variant="caption" align="right" sx={{ width: "100%" }}>
            Clicking on "previous" {!saved && surprising !== null && why !== "" ? "" : 'or "next" '}will not save your changes
          </Typography> : null}
          {pairIdx === 0 && !saved && (surprising === null || why === "") ? <Typography variant="caption" align="right" sx={{ width: "100%" }}>
            Clicking on "next" will not save your changes
          </Typography> : null} */}
        </Box>
      </Grid>
    </Grid >
  )
};
