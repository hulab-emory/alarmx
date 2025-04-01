import React, { useEffect, useState } from 'react'
import { filterMostRecentByField } from '../../../../utils/annotation_helper';
import {
  Typography,
  Paper,
  Grid,
  Button,
  Box,
  Stack,
  createTheme,
} from "@mui/material";
import axios from 'axios';
import Form from './Form';
import { isEqual } from '../../../../../../utils/objectFunctions';
import { updateAdjudication, updateAnnotation } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import DataPanel from '../../Annotation/Data';

const theme = createTheme();

export default function Selected({ project, events, selectedIds, aNotes, adjNotes, annotationResult, setAnnotationNotes }) {

  const [eIdx, setEIdx] = useState(0);
  const [note, setNote] = useState({});
  const [cIdx, setCIdx] = useState(0);
  const [values, setValues] = useState({});
  const [originalValues, setOriginalValues] = useState({});

  const dispatch = useDispatch();

  const user = useSelector((state) => state.main.user);

  useEffect(() => {
    const filePath = events[eIdx].cadaFile.path;
    axios({
      method: "get",
      url: `/api/cada/file/json?filename=${encodeURIComponent(filePath)}`,
    }).then(res => {
      setNote(res.data);
      const adjudication = filterMostRecentByField(events[eIdx].cadaAdjudicationValues);
      const currValues = {};
      for (let v of adjudication) {
        currValues[parseInt(v.field)] = JSON.parse(v.value);
      }
      setValues(currValues);
      setOriginalValues(currValues);
    })
  }, [eIdx, events, setNote]);

  useEffect(() => {
    setCIdx(0);
  }, [eIdx, setCIdx]);

  useEffect(() => {
    const handleMouseDown = (event) => {
      event.preventDefault();
      // Start tracking the mousemove event
      document.addEventListener('mousemove', handleMouseMove);
      // When mouse is released anywhere in the document, stop resizing
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handle = document.querySelector('.handle');
    handle.addEventListener('mousedown', handleMouseDown);

    const handleMouseMove = (event) => {
      let scrollBar = 0;
      const panelBox = document.getElementById('panel-box');
      // get the box's padding
      const style = window.getComputedStyle(panelBox);
      const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

      const root = document.getElementById('root');
      if (root.scrollHeight > root.clientHeight) {
        scrollBar = 6;
      }
      const resizableBox = document.getElementById("resizableBox");
      // Calculate the new width based on cursor position
      const newWidth = window.innerWidth - event.clientX - 25;
      // setPanelWidth(newWidth);
      if (newWidth > window.innerWidth - padding - 15 - scrollBar) {
        resizableBox.style.width = `${window.innerWidth - padding - 15 - scrollBar}px`;
        return;
      }
      resizableBox.style.width = `${newWidth}px`;
    };

    const handleMouseUp = () => {
      // Remove the event listeners when mouse is released
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    return () => {
      // Clean up the event listeners when the component is unmounted
      handle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const onHighlightClick = (conceptIdx) => () => {
    setCIdx(conceptIdx);
  }

  const canSave = () => {
    if (isEqual(values, originalValues))
      return false;

    return values[cIdx]?.detection === "no" || (
      values[cIdx]?.detection === "yes" && values[cIdx]?.encounter && values[cIdx]?.negation
    )
    // return false;
  };

  const handlePrev = () => {
    if (cIdx === 0) {
      setEIdx(curr => curr - 1);
      return;
    }
    setCIdx(curr => curr - 1);
  };

  const handleNext = () => {
    if (canSave())
      handleSave();

    if (cIdx === note.info.length - 1) {
      setEIdx(curr => curr + 1);
      return;
    }

    setCIdx(curr => curr + 1);
  };

  const handleSave = () => {
    if (!canSave())
      return;

    dispatch(
      updateAdjudication(project.id, events[eIdx].id, user.id, true, {
        field: cIdx.toString(),
        value: JSON.stringify(values[cIdx]),
        userId: user.id,
        cadaEventId: events[eIdx].id,
        createdAt: new Date(new Date().toUTCString()).toISOString(),
      })
    );
    setOriginalValues(values);
  };

  return (
    <>
      <Box id='panel-box' sx={{ flexGrow: 1, p: 2 }}>
        {note && (
          <Grid container direction="row">
            <Grid item xs sx={{
              overflow: 'hidden',
              height: "calc(100vh - 250px)",
              overflowY: "scroll",
              backgroundColor: "white",
              padding: "0 1rem",
            }}>
              <DataPanel
                note={note}
                selectedConcept={cIdx}
                onHighlightClick={onHighlightClick}
                values={originalValues}
                filename={events[eIdx].cadaFile.path.split('/').pop()}
              />
            </Grid>
            <Grid item>
              <div className="handle">
                <div className="knob"></div>
              </div>
            </Grid>
            <Grid item>
              <Box
                id="resizableBox"
                position="relative"
                sx={{
                  height: "calc(100vh - 250px)",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                  width: "550px",
                }}
              >
                <Paper
                  sx={{
                    py: 1,
                    px: 2,
                    mb: 2,
                    color: theme.palette.text.secondary,
                    position: "sticky",
                    borderBottom: "1px solid #dfe6e9",
                    top: 0,
                    zIndex: 100,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography>
                      <span>{cIdx + 1}</span>
                      {" of " + note?.info?.length}
                    </Typography>
                    <div className="btns">
                      {canSave() && <Button variant='contained' color='error' onClick={() => setValues(originalValues)}>Cancel</Button>}
                      <Button variant='contained' color="secondary" disabled={eIdx === 0 && cIdx === 0} onClick={handlePrev} >Prev</Button>
                      {canSave() && <Button variant='contained' disabled={isEqual(values, originalValues)} onClick={handleSave}>Save</Button>}
                      <Button variant='contained' disabled={eIdx === events.length - 1 && cIdx === note?.info?.length - 1} onClick={handleNext}>{`${canSave() ? "Save & " : ""}Next`}</Button>
                    </div>
                  </Stack>
                  <Typography
                    sx={{
                      mt: 2,
                      mb: 2,
                    }}
                  >
                    Trigger word: <span style={{
                      borderBottom: "rgb(245, 124, 0) solid 3px",
                      padding: "0 2px",
                      borderRadius: "4px",
                      fontSize: "1.2rem",
                      color: "#1C2536",
                    }}>{note?.info && note?.info[cIdx]?.trigger_word}</span>
                  </Typography>
                  <Typography
                    sx={{
                      mb: 2,
                    }}
                  >
                    Concept: <span style={{
                      backgroundColor: "rgb(245, 124, 0)",
                      color: "white",
                      fontSize: "1.1rem",
                      marginLeft: "5px",
                      marginRight: "10px",
                      padding: "1px 5px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                    }}>
                      {note?.info && note?.info[cIdx]?.concept}
                    </span>
                  </Typography>
                  {user?.id === 2 && <Typography
                    sx={{
                      mb: 1,
                    }}
                  >
                    Offset: {note?.info && note?.info[cIdx]?.offset}
                  </Typography>}

                </Paper>

                <Form cIdx={cIdx} value={values[cIdx]} setValue={(v) => setValues({ ...values, [cIdx]: v })} note={note} event={events[eIdx]} />
              </Box>
            </Grid>
          </Grid>
        )}
      </Box >
      <style>
        {`
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          ::-webkit-scrollbar-track {
            background: transparent;
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.15);
            border-radius: 5px;
            transition: 0.3s;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.4);
          }

          .MuiButton-root {
            margin-left: 0.6rem;
          }

          .handle {
            display: flex;
            justify-content: center;
            width: 15px;
            height: calc(100vh - 250px);
            background-color: transparent;
            cursor: ew-resize;
            z-index: 100;
          }

          .handle .knob {
            align-self: center;
            width: 40%;
            height: 15%;
            background-color: #a4b0be;
            border-radius: 10px;
          }
        `}
      </style>
    </>
  )
}
