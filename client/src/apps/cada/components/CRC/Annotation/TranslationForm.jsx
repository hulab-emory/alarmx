import { FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react';

const DEFAULT_VALUE = {
  speakLang: null,
  correct: null,
  accuracy: null,
  comment: "",
}

const removeKeys = (obj, keys) => {
  Object.keys(obj).forEach(key => {
    if (!keys.includes(key)) {
      delete obj[key];
    }
  });
}

export default function TranslationForm({ qid, value, setter }) {

  const [speakLang, setSpeakLang] = useState(null);
  const [correctValue, setCorrectValue] = useState(null);
  const [accuracyValue, setAccuracyValue] = useState(null);
  const [comment, setComment] = useState(value?.comment || "");

  useEffect(() => {
    if (!value || Object.keys(value).length === 0) {
      setter(DEFAULT_VALUE);
      setSpeakLang(null);
      setCorrectValue(null);
      setAccuracyValue(null);
      setComment("");
    } else {
      setSpeakLang(value?.speakLang ?? null);
      setCorrectValue(value?.correct ?? null);
      setAccuracyValue(value?.accuracy ?? null);
      setComment(value?.comment || "");
    }
  }, [qid, value, setter]);

  const onLangChange = (e) => {
    setSpeakLang(e.target.value);
    let newValue = { ...value, speakLang: e.target.value };
    if (e.target.value === "no") {
      newValue = { ...newValue, correct: null, accuracy: null, comment: "" };
    }
    removeKeys(newValue, Object.keys(DEFAULT_VALUE));
    setter(newValue);
  }

  const onCorrectChange = (e) => {
    setCorrectValue(e.target.value);
    const newValue = { ...value, correct: e.target.value };
    removeKeys(newValue, Object.keys(DEFAULT_VALUE));
    setter(newValue);
  }

  const onAccuracyChange = (e) => {
    setAccuracyValue(e.target.value);
    const newValue = { ...value, accuracy: e.target.value };
    removeKeys(newValue, Object.keys(DEFAULT_VALUE));
    setter(newValue);
  }

  const onCommentChange = (e) => {
    setComment(e.target.value);
    const newValue = { ...value, comment: e.target.value };
    removeKeys(newValue, Object.keys(DEFAULT_VALUE));
    setter(newValue);
  }

  return (
    <>
      <Grid container spacing={2} p={1} pt={1.5}>
        <Grid item xs={12}>
          <FormControl>
            <FormLabel sx={{ fontWeight: 'bold' }}>
              Do you speak the language?
            </FormLabel>
            <RadioGroup
              row
              value={speakLang}
              onChange={onLangChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        {speakLang === "yes" &&
          <>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>
                  Is the translation in the target language?
                </FormLabel>
                <RadioGroup
                  row
                  value={correctValue}
                  onChange={onCorrectChange}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="partially" control={<Radio />} label="Partially" />
                  <FormControlLabel value="no" control={<Radio />} label="Not at all" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 'bold' }}>
                  Is the translation accurate?
                </FormLabel>
                <RadioGroup
                  row
                  value={accuracyValue}
                  onChange={onAccuracyChange}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="partially" control={<Radio />} label="Partially" />
                  <FormControlLabel value="no" control={<Radio />} label="Not at all" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Comment"
                multiline
                minRows={2}
                maxRows={6}
                fullWidth
                variant='outlined'
                value={comment}
                onChange={onCommentChange}
              />
            </Grid>
          </>}
      </Grid>
    </>
  )
}
