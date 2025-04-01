import { Box, Grid, Paper, Stack, createTheme, Typography, Divider, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DataPanel from './Data';
import Form from './Form';
import TranslationForm from './TranslationForm';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateAnnotation } from '../../../redux/actions';
import { isEqual } from '../../../../../utils/objectFunctions';
import Markdown from '../../../../../common/Markdown';
import { filterMostRecentByField } from '../../../utils/annotation_helper';

const theme = createTheme();

export default function Panel({ project, eIdx, setEIdx, events }) {

  const dispatch = useDispatch();
  const [content, setContent] = useState({});
  const [values, setValues] = useState({});
  const [originalValues, setOriginalValues] = useState({});
  const [questionIdx, setQuestionIdx] = useState(0);

  const handleSave = () => {

    const isComplete = values.every(value => Object.keys(value).length === content.info.length && !Object.values(value).includes(null));
    dispatch(
      updateAnnotation(project.id, events[eIdx].id, true, {
        field: questionIdx.toString(),
        value: JSON.stringify(values[questionIdx]),
        cadaAnnotationId: events[eIdx].cadaAnnotations[0].id,
        createdAt: new Date(new Date().toUTCString()).toISOString(),
        isComplete,
      })
    );
  };

  // load gpt responses
  useEffect(() => {
    const filePath = events[eIdx].cadaFile.path;
    console.log(events[eIdx].cadaFile)
    axios({
      method: "get",
      url: `/api/cada/file/json?filename=${encodeURIComponent(filePath)}`,
    }).then(res => {
      setContent(res.data);
      const models = Object.keys(res.data.info[0].LLMs);
      const tmp_dict = models.map((model) => { return { [model]: null } });
      const tmp = res.data.info.map(() => { return {} });
      const annotation = filterMostRecentByField(events[eIdx].cadaAnnotations[0].cadaAnnotationValues);
      for (let annotationValues of annotation) {
        const value = JSON.parse(annotationValues.value);
        const field = annotationValues.field;
        tmp_dict[models[0]] = value;
        tmp[field] = Object.keys(value).includes(models[0]) ? value : tmp_dict;
      }
      setValues(JSON.parse(JSON.stringify(tmp)));
      setOriginalValues(JSON.parse(JSON.stringify(tmp)));
    }).catch(err => console.log(err));
  }, [eIdx, events]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.keyCode) {
        case 37:
          if (questionIdx > 0) {
            setQuestionIdx(curr => curr - 1);
          } else if (eIdx > 0) {
            setEIdx(curr => curr - 1);
            setQuestionIdx(content.info.length - 1);
          }
          break;
        case 39:
          if (Object.keys(content).includes('info')) {
            if (questionIdx < content.info.length - 1) {
              setQuestionIdx(curr => curr + 1);
            } else if (eIdx < events.length - 1) {
              setEIdx(curr => curr + 1);
              setQuestionIdx(0);
            }
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [questionIdx, eIdx, content, events, setEIdx]);

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

  const setter = (idx, model) => (value) => {
    setValues(curr => {
      const tmp = [...curr];
      tmp[idx][model] = value;
      return tmp;
    })
  }

  const canSave = () => {
    if (values[questionIdx] && originalValues[questionIdx]) {
      return !isEqual(values[questionIdx], originalValues[questionIdx]) &&
        Object.keys(values[questionIdx]).length !== 0 &&
        !Object.keys(values[questionIdx]).every(key => Object.values(values[questionIdx][key]).every(value => value === null || value === '' )) &&
        !Object.values(values[questionIdx]).every(value => value === null || value === '' || Object.keys(value).length === 0);
    }

    return false;
  }

  const handleNext = () => {
    if (canSave()) {
      handleSave();
    }

    if (questionIdx < content.info.length - 1) {
      setQuestionIdx(curr => curr + 1);
    } else if (eIdx < events.length - 1) {
      setQuestionIdx(0);
      setEIdx(curr => curr + 1);
    }
  }

  const handlePrev = () => {
    if (canSave()) {
      handleSave();
    }
    if (questionIdx > 0) {
      setQuestionIdx(curr => curr - 1);
    } else if (eIdx > 0) {
      setQuestionIdx(content.info.length - 1);
      setEIdx(curr => curr - 1);
    }
  }

  return (
    <>
      <Box id='panel-box' sx={{ flexGrow: 1, p: 2 }}>
        {content && (
          <Grid container direction="row">
            <Grid item xs sx={{ overflow: 'hidden' }}>
              <DataPanel
                filePath={`/crc_eval/pdf/${content.file_name}`}
                category={events[eIdx].cadaFile.info ?? ''}
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
                      <span>{questionIdx + 1}</span>
                      {" of " + content.info?.length}
                    </Typography>
                    <div className="btns">
                      <Button variant='contained' color="secondary" disabled={eIdx === 0 && questionIdx === 0} onClick={handlePrev} >Prev</Button>
                      {canSave() && <Button variant='contained' disabled={isEqual(values[questionIdx], originalValues[questionIdx])} onClick={handleSave}>Save</Button>}
                      <Button variant='contained' disabled={eIdx === events.length - 1 && questionIdx === content?.info?.length - 1} onClick={handleNext}>{`${canSave() ? "Save & " : ""}Next`}</Button>
                    </div>
                  </Stack>
                </Paper>
                {content.info && (
                  <Paper
                    sx={{
                      py: 1,
                      px: 2,
                      mb: 2,
                      fontSize: "1rem",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <Grid item sx={{ fontWeight: 'bold' }} xs>
                      {`${questionIdx + 1}. ${content.info[questionIdx]?.prompt.replace('{}', '')}`}
                      
                    </Grid>
                    {content.info[questionIdx] && Object.keys(content.info[questionIdx].LLMs).map((llm, index) => {
                      return (<div key={index}>
                        <Divider />
                        <Grid item sx={{ mt: 1, fontWeight: 'bold' }} xs>
                          {llm}:
                        </Grid>
                        <Grid container direction="row" spacing={3} padding={2}>
                          <Grid item xs={questionIdx >= content?.info.length - 2 ? 6 : 12}>
                            <Markdown>{content.info[questionIdx].LLMs[llm].response}</Markdown>
                            {questionIdx >= content?.info.length - 2 ? null : `(Word count: ${content.info[questionIdx].LLMs[llm].response.split(' ').length}, FKG score: ${content.info[questionIdx].LLMs[llm].FKG})`}
                          </Grid>
                          {questionIdx >= content.info.length - 2 && (
                            <Grid item xs={questionIdx >= content?.info.length - 2 ? 6 : 12}>
                              <Markdown>{content.info[1].LLMs[llm].response}</Markdown>
                            </Grid>
                          )}

                        </Grid>
                        <Grid item>
                          {
                            questionIdx < content.info.length - 2 ?
                              <Form
                                qid={questionIdx}
                                value={values[questionIdx][llm]}
                                setter={setter(questionIdx, llm)}
                              /> :
                              <TranslationForm
                                qid={questionIdx}
                                value={values[questionIdx][llm]}
                                setter={setter(questionIdx, llm)}
                              />
                          }
                        </Grid>
                      </div>)
                    })}
                  </Paper>
                )}
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
