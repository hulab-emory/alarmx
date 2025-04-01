import { Box, Grid, Paper, Stack, createTheme, Typography, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DataPanel from './Data';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateAnnotation } from '../../../redux/actions';
import { isEqual } from '../../../../../utils/objectFunctions';
import Forms from './Forms';
import { filterMostRecentByField } from '../../../utils/annotation_helper';

const theme = createTheme();

export default function Panel({ project, eIdx, setEIdx, events }) {

  const dispatch = useDispatch();
  const [content, setContent] = useState({});
  const [values, setValues] = useState({});
  const [originalValues, setOriginalValues] = useState({});

  // load gpt responses
  useEffect(() => {
    let filePath = events[eIdx].cadaFile.path;
    if (filePath.split('/')[0] === "data") {
      filePath = filePath.split('/').slice(1).join('/');
    }
    axios({
      method: "get",
      url: `/api/cada/file/json?filename=${encodeURIComponent(filePath)}`,
    }).then(async res => {
      const contentInfo = res.data

      try {

        for (let key of Object.keys(contentInfo.GPTFoodCode)) {
          const foodCodes = contentInfo.GPTFoodCode[key];
          // get food code information
          const GPTFoodCodeInfo = await axios({
            method: "post",
            url: `/api/diet/foodcode/`,
            data: {
              codes: foodCodes,
            }
          });
          contentInfo.GPTFoodCode[key] = GPTFoodCodeInfo.data;
        }

        setContent(contentInfo);

        const annotations = filterMostRecentByField(events[eIdx].cadaAnnotations[0].cadaAnnotationValues);
        if (annotations.length !== 0) {
          setValues(JSON.parse(annotations[0].value));
          setOriginalValues(JSON.parse(annotations[0].value));
        } else {
          setValues({});
          setOriginalValues({});
        }


      } catch (err) {
        console.log(err);
        setContent(contentInfo);
      }

    }).catch(err => console.log(err));
  }, [eIdx, events]);

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

  const canSave = () => {
    return values?.nutrition &&
      values?.ingredients &&
      Object.keys(values.nutrition).length === Object.keys(content.GPTNutrition).length &&
      values.ingredients && values.ingredients.length > 0 &&
      !isEqual(values, originalValues);
  };

  const handleSave = () => {

    const isComplete = canSave();
    dispatch(
      updateAnnotation(project.id, events[eIdx].id, true, {
        field: 0,
        value: JSON.stringify(values),
        cadaAnnotationId: events[eIdx].cadaAnnotations[0].id,
        createdAt: new Date(new Date().toUTCString()).toISOString(),
        isComplete,
      })
    );
  };

  const handleNext = () => {
    if (canSave()) {
      handleSave();
    }
    setEIdx(curr => eIdx < events.length - 2 ? curr + 1 : curr);
  };

  const handlePrev = () => {
    if (canSave()) {
      handleSave();
    }

    setEIdx(curr => eIdx > 0 ? curr - 1 : curr);
  };

  return (
    <>
      <Box id='panel-box' sx={{ flexGrow: 1, p: 2 }}>
        {content && (
          <Grid container direction="row">
            <Grid item xs sx={{ overflow: 'hidden' }}>
              <DataPanel
                filePath={content.link}
                fileName={content.fileName}
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
                    <Typography id="concept">
                      <span>{eIdx + 1}</span>
                      {" of " + events.length}
                    </Typography>
                    <div className="btns">
                      {canSave() && <Button variant='contained' color='error' onClick={() => setValues(originalValues)}>Cancel</Button>}
                      <Button variant='contained' color="secondary" disabled={eIdx === 0} onClick={handlePrev} >Prev</Button>
                      {canSave() && <Button variant='contained' disabled={isEqual(values, originalValues)} onClick={handleSave}>Save</Button>}
                      <Button variant='contained' disabled={eIdx === events.length - 1} onClick={handleNext}>{`${canSave() ? "Save & " : ""}Next`}</Button>
                    </div>
                  </Stack>
                </Paper>
                <Forms values={values} setValues={setValues} content={content} />
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
            background: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            transition: 0.3s;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.7);
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
