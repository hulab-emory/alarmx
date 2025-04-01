import { FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react';

const DEFAULT_VALUE = {
  numOfWords: null,
  readingLevel: null,
  clarity: null,
  accuracy: null,
  relevance: null,
  completeness: null,
  comprehensibility: null,
  comment: "",
};

const removeKeys = (obj, keys) => {
  Object.keys(obj).forEach(key => {
    if (!keys.includes(key)) {
      delete obj[key];
    }
  });
}

export default function Form({ qid, value, setter }) {

  const [numOfWordsValue, setNumOfWordsValue] = useState(value?.numOfWords || null);
  const [readingLevelValue, setReadingLevelValue] = useState(value?.readingLevel || null);
  const [clarityValue, setClarityValue] = useState(value?.clarity || null);
  const [accuracyValue, setAccuracyValue] = useState(value?.accuracy || null);
  const [relevenceValue, setRelevanceValue] = useState(value?.relevance || null);
  const [completenessValue, setCompletenessValue] = useState(value?.completeness || null);
  const [comprehensibilityValue, setComprehensibilityValue] = useState(value?.comprehensibility || null);
  const [comment, setComment] = useState(value?.comment || "");

  // const [value, setValue] = useState(DEFAULT_VALUE);

  useEffect(() => {
    if (!value || Object.keys(value).length === 0) {
      setter(DEFAULT_VALUE);
      setNumOfWordsValue(null);
      setReadingLevelValue(null);
      setClarityValue(null);
      setAccuracyValue(null);
      setRelevanceValue(null);
      setCompletenessValue(null);
      setComprehensibilityValue(null);
      setComment("");
    } else {
      setNumOfWordsValue(value.numOfWords ?? null);
      setReadingLevelValue(value.readingLevel ?? null);
      setClarityValue(value.clarity ?? null);
      setAccuracyValue(value.accuracy ?? null);
      setRelevanceValue(value.relevance ?? null);
      setCompletenessValue(value.completeness ?? null);
      setComprehensibilityValue(value.comprehensibility ?? null);
      setComment(value.comment ?? "");
    }
  }, [qid, value, setter]);


  const onNumOfWordsChange = (e) => {
    setNumOfWordsValue(e.target.value);
    const newValue = { ...value, numOfWords: e.target.value };
    removeKeys(newValue, Object.keys(DEFAULT_VALUE));
    setter(newValue);
  }

  const onReadingLevelChange = (e) => {
    setReadingLevelValue(e.target.value);
    const newValue = { ...value, readingLevel: e.target.value };
    removeKeys(newValue, Object.keys(DEFAULT_VALUE));
    setter(newValue);
  }

  const onClarityChange = (e) => {
    setClarityValue(e.target.value);
    const newValue = { ...value, clarity: e.target.value };
    removeKeys(newValue, Object.keys(DEFAULT_VALUE));
    setter(newValue);
  }

  const onAccuracyChange = (e) => {
    setAccuracyValue(e.target.value);
    const newValue = { ...value, accuracy: e.target.value };
    setter(newValue);
  }

  const onRelevanceChange = (e) => {
    setRelevanceValue(e.target.value);
    const newValue = { ...value, relevance: e.target.value };
    removeKeys(newValue, Object.keys(DEFAULT_VALUE));
    setter(newValue);
  }

  const onCompletenessChange = (e) => {
    setCompletenessValue(e.target.value);
    const newValue = { ...value, completeness: e.target.value };
    removeKeys(newValue, Object.keys(DEFAULT_VALUE));
    setter(newValue);
  }

  const onComprehensibilityChange = (e) => {
    setComprehensibilityValue(e.target.value);
    const newValue = { ...value, comprehensibility: e.target.value };
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
              Does the response meet the requried word count?
            </FormLabel>
            <RadioGroup
              row
              value={numOfWordsValue}
              onChange={onNumOfWordsChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="too long" control={<Radio />} label="Too long" />
              <FormControlLabel value="too short" control={<Radio />} label="Too short" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <FormLabel sx={{ fontWeight: 'bold' }}>
              Does the response meet the requried reading level?
            </FormLabel>
            <RadioGroup
              row
              value={readingLevelValue}
              onChange={onReadingLevelChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="partially" control={<Radio />} label="Partially" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <FormLabel sx={{ fontWeight: 'bold' }}>
              Is the response clear and easy to understand? (Clarity)
            </FormLabel>
            <RadioGroup
              row
              value={clarityValue}
              onChange={onClarityChange}
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
              Does the response contain any errors? (Accuracy)
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
          <FormControl>
            <FormLabel sx={{ fontWeight: 'bold' }}>
              Is the response completely based on the document? (Relevance)
            </FormLabel>
            <RadioGroup
              row
              value={relevenceValue}
              onChange={onRelevanceChange}
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
              Does it capture all key points? (Completeness)
            </FormLabel>
            <RadioGroup
              row
              value={completenessValue}
              onChange={onCompletenessChange}
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
              Is the response overall comprehensible? (Comprehensibility)
            </FormLabel>
            <RadioGroup
              row
              value={comprehensibilityValue}
              onChange={onComprehensibilityChange}
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
      </Grid>
    </>
  )
}
