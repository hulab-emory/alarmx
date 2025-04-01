import { createTheme, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import React from 'react';

const theme = createTheme();

const useStyles = {
  papers: {
    p: 2,
    color: theme.palette.text.secondary,
  },
}

export default function Form({ value, setValue, note }) {

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={useStyles.papers} >
            <FormControl>
              <FormLabel sx={{ fontSize: "1.1rem" }}>
                Is the concept correctly detected by the triggerring word?
              </FormLabel>
              <RadioGroup
                row
                value={value?.detection || ""}
                onChange={(e) => setValue({ ...value, detection: e.target.value })}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>
        {value?.detection && value.detection === "yes" &&
          <>
            <Grid item xs={12}>
              <Paper sx={useStyles.papers} >
                <FormControl>
                  <FormLabel sx={{ fontSize: "1.1rem", mb: 1.5 }}>
                    Is it a concept being dealt within the current encounter? (regardless if it is the condition of the patient)?
                  </FormLabel>
                  <RadioGroup
                    row
                    value={value?.encounter || ""}
                    onChange={(e) => setValue({ ...value, encounter: e.target.value })}
                  >
                    <FormControlLabel value="yes, new condition" control={<Radio size="small" />} label="Yes, concept is new condition" />
                    <FormControlLabel value="yes, exacerbation of a chronic condition" control={<Radio size="small" />} label="Yes, exacerbation of a chronic condition" />
                    <FormControlLabel value="yes, part of differential diagnosis" control={<Radio size="small" />} label="Yes, presumed - part of differential diagnosis (assessment findings)" />
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No, stable past medical history/ mention of chronic condition/ denying symptom" />
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
                    row
                    value={value?.negation || ""}
                    onChange={(e) => setValue({ ...value, negation: e.target.value })}
                  >
                    <FormControlLabel value="no" control={<Radio size="small" />} label="No, concept is current to the overall note" />
                    <FormControlLabel value="yes, concept is about another person" control={<Radio size="small" />} label="Yes, concept is about another person (not patient)" />
                    <FormControlLabel value="yes, diagnosis or part of assessment" control={<Radio size="small" />} label="yes, concept ruled out as diagnosis/part of assessment" />
                    <FormControlLabel value="yes, completely resolved" control={<Radio size="small" />} label="Yes, concept has been completely resolved" />
                    <FormControlLabel value="unsure" control={<Radio size="small" />} label="Unsure, concept status unknown/not quantifiable (example: pain decreased, but unknown if fully resolved)" />
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
    </>
  )
}