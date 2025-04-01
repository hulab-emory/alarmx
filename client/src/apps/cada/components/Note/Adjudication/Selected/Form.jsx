import { Avatar, AvatarGroup, createTheme, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { filterMostRecentByField } from '../../../../utils/annotation_helper';
import stringAvatar from '../../../../../../utils/stringAvatar';

const theme = createTheme();

const useStyles = {
  papers: {
    p: 2,
    color: theme.palette.text.secondary,
  },
}

export default function Form({ cIdx, value, setValue, event }) {

  const filteredAnnotations = event.cadaAnnotations.map((a) => {
    const filteredV = filterMostRecentByField(a.cadaAnnotationValues);
    const currValues = {};
    for (let v of filteredV) {
      currValues[parseInt(v.field)] = JSON.parse(v.value);
    }
    return { ...a, cadaAnnotationValues: currValues };
  });

  const annotationUsers = (option, cid, question) => {
    let users = [];

    for (const ann of filteredAnnotations) {
      if (ann.cadaAnnotationValues?.[cid]?.[question] === option) {
        users.push(ann.userId);
      }
    }

    return users;
  }

  const avatarGroup = (option, cid, question) => {
    return (
      <AvatarGroup max={4}>
        {annotationUsers(option, cid, question).map((user) => (
          <Avatar key={user} {...stringAvatar("user" + JSON.stringify(user))}>{user}</Avatar>
        ))}
      </AvatarGroup>
    )
  };

  const findTheOnlyMaxNumber = (arr) => {
    let max = 0;
    let maxIdx = 0;
    let maxCount = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i];
        maxIdx = i;
        maxCount = 1;
      } else if (arr[i] === max) {
        maxCount++;
      }
    }
    return maxCount > 1 ? "" : maxIdx;
  };

  useEffect(() => {
    setValue({
      detection: findTheOnlyMaxNumber([annotationUsers("yes", cIdx, "detection").length, annotationUsers("no", cIdx, "detection").length]),
    })
  }, [])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={useStyles.papers} >
            <FormControl>
              <FormLabel sx={{ fontSize: "1.1rem", mb: 1.5 }}>
                Is the concept correctly detected by the triggerring word?
              </FormLabel>
              <RadioGroup
                column="true"
                value={value?.detection || ""}
                onChange={(e) => setValue({ ...value, detection: e.target.value })}
              >
                <div className="radio-btn">
                  <FormControlLabel sx={{ width: "100%" }} value="yes" control={<Radio />} label="Yes" />
                  {/* {annotationUsers("yes", 0, "detection").length} */}
                  {avatarGroup("yes", cIdx, "detection")}
                </div>
                <div className="radio-btn">
                  <FormControlLabel sx={{ width: "100%" }} value="no" control={<Radio />} label="No" />
                  {avatarGroup("no", cIdx, "detection")}
                </div>
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>
        {value?.detection && value.detection !== "no" &&
          <>
            <Grid item xs={12}>
              <Paper sx={useStyles.papers} >
                <FormControl>
                  <FormLabel sx={{ fontSize: "1.1rem", mb: 1.5 }}>
                    Is it a concept being dealt within the current encounter? (regardless if it is the condition of the patient)?
                  </FormLabel>
                  <RadioGroup
                    column="true"
                    value={value?.encounter || ""}
                    onChange={(e) => setValue({ ...value, encounter: e.target.value })}
                  >
                    <div className="radio-btn">
                      <FormControlLabel sx={{ width: "100%" }} value="yes, new condition" control={<Radio size="small" />} label="Yes, concept is new condition" />
                      {avatarGroup("yes, new condition", cIdx, "encounter")}
                    </div>
                    <div className="radio-btn">
                      <FormControlLabel sx={{ width: "100%" }} value="yes, exacerbation of a chronic condition" control={<Radio size="small" />} label="Yes, exacerbation of a chronic condition" />
                      {avatarGroup("yes, exacerbation of a chronic condition", cIdx, "encounter")}
                    </div>
                    <div className="radio-btn">
                      <FormControlLabel sx={{ width: "100%" }} value="yes, part of differential diagnosis" control={<Radio size="small" />} label="Yes, presumed - part of differential diagnosis (assessment findings)" />
                      {avatarGroup("yes, part of differential diagnosis", cIdx, "encounter")}
                    </div>
                    <div className="radio-btn">
                      <FormControlLabel sx={{ width: "100%" }} value="no" control={<Radio size="small" />} label="No, stable past medical history/ mention of chronic condition/ denying symptom" />
                      {avatarGroup("no", cIdx, "encounter")}
                    </div>
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={useStyles.papers} >
                <FormControl>
                  <FormLabel sx={{ fontSize: "1.1rem", mb: 1.5 }}>
                    Given the context, should term be negated?
                  </FormLabel>
                  <RadioGroup
                    column="true"
                    value={value?.negation || ""}
                    onChange={(e) => setValue({ ...value, negation: e.target.value })}
                  >
                    <div className="radio-btn">
                      <FormControlLabel sx={{ width: "100%" }} value="no" control={<Radio size="small" />} label="No, concept is current to the overall note" />
                      {avatarGroup("no", cIdx, "negation")}
                    </div>
                    <div className="radio-btn">
                      <FormControlLabel sx={{ width: "100%" }} value="yes, concept is about another person" control={<Radio size="small" />} label="Yes, concept is about another person (not patient)" />
                      {avatarGroup("yes, concept is about another person", cIdx, "negation")}
                    </div>
                    <div className="radio-btn">
                      <FormControlLabel sx={{ width: "100%" }} value="yes, diagnosis or part of assessment" control={<Radio size="small" />} label="yes, concept ruled out as diagnosis/part of assessment" />
                      {avatarGroup("yes, diagnosis or part of assessment", cIdx, "negation")}
                    </div>
                    <div className="radio-btn">
                      <FormControlLabel sx={{ width: "100%" }} value="yes, completely resolved" control={<Radio size="small" />} label="Yes, concept has been completely resolved" />
                      {avatarGroup("yes, completely resolved", cIdx, "negation")}
                    </div>
                    <div className="radio-btn">
                      <FormControlLabel sx={{ width: "100%" }} value="unsure" control={<Radio size="small" />} label="Unsure, concept status unknown/not quantifiable (example: pain decreased, but unknown if fully resolved)" />
                      {avatarGroup("unsure", cIdx, "negation")}
                    </div>



                  </RadioGroup>
                </FormControl>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={useStyles.papers} >
                <TextField
                  label="Comment"
                  multiline
                  minRows={2}
                  maxRows={6}
                  fullWidth
                  variant='outlined'
                  value={value.comment}
                  onChange={(e) => setValue({ ...value, comment: e.target.value })}
                />
              </Paper>
            </Grid>
          </>
        }
      </Grid>
      <style>
        {`
          .radio-btn {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0.5rem;
            border: 1px solid #d9d9d9;
            border-radius: 10px;
            margin: 0.4rem 0;
          }
        `}
      </style>
    </>
  )
}