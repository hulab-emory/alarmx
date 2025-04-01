import React from 'react';
import { Grid, Paper, Divider, createTheme, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import Label from '../../../common/Label';
import Tooltip from '../Tooltip';

const theme = createTheme();

export default function Forms({ values, setValues, content }) {

  const onNutritionChange = (key) => (e) => {
    setValues(curr => ({ ...curr, nutrition: { ...curr.nutrition, [key]: e.target.value } }));
  }

  const onIngredientChange = (e) => {
    setValues(curr => ({ ...curr, ingredients: e.target.value }));
  }

  const onCommentChange = (e) => {
    setValues(curr => ({ ...curr, comment: e.target.value }));
  }

  return (
    <>
      <Paper
        sx={{
          py: 1,
          px: 2,
          mb: 2,
          fontSize: "1.1rem",
          fontWeight: "bold",
          color: theme.palette.text.secondary,
        }}
      >
        <Box>
          The ingridents in this meal are: {content?.ingredients?.split(',')?.map((ing, index) => (
            <Label key={index} color="success" style={{ margin: 5, fontSize: "1rem" }}>
              {ing}
            </Label>
          ))}
        </Box>
        <Box sx={{ mt: 1.5, mb: 1.3 }}>These predicted ingredients are:</Box>
        {content?.GPTFoodCode && Object.keys(content.GPTFoodCode).map((key, index) => (
          <div key={key}>
            <Box sx={{ color: theme.palette.info.main }}>
              {key.replace(/\b\w/g, char => char.toUpperCase())}</Box>
            <Box>
              {content.GPTFoodCode[key].length > 0 ? content.GPTFoodCode[key].map((code, index) => (
                <Tooltip
                  key={index}
                  title={code.code}
                  description={code.description}
                  placement="bottom"
                  activate={code.description.length > 40}
                >
                  <Label key={index} color="info" style={{ margin: 5, fontSize: "1rem" }}>
                    {code.code} {code.description.length > 40 ? code.description.substring(0, 40) + "..." : code.description}
                  </Label>
                </Tooltip>
              )) : (
                <Label key={index} color="info" style={{ margin: 5, fontSize: "1rem" }}>
                  No food code found
                </Label>
              )}
              <Divider
                sx={{
                  my: 2,
                }}
              />
            </Box>
          </div>))}
        <Grid item>
          <Grid container spacing={2} p={1}>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel sx={{ fontWeight: "bold" }}>
                  Are they:
                </FormLabel>
                <RadioGroup
                  row
                  value={values?.ingredients && typeof values.ingredients === 'string' ? values.ingredients : ''}
                  onChange={onIngredientChange}
                >
                  <FormControlLabel
                    value="exact match"
                    control={<Radio />}
                    label="Exact match"
                  />
                  <FormControlLabel
                    value="close match"
                    control={<Radio />}
                    label="Close match"
                  />
                  <FormControlLabel
                    value="far match"
                    control={<Radio />}
                    label="Far match"
                  />
                  <FormControlLabel
                    value="mismatch"
                    control={<Radio />}
                    label="Mismatch"
                  />
                  <FormControlLabel
                    value="no idea"
                    control={<Radio />}
                    label="No idea"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Divider
          sx={{
            my: 2,
          }}
        />
        <Box>The meal shown in the image was predict to have:</Box>
        {content?.GPTNutrition && Object.keys(content.GPTNutrition).filter(k => k !== "weight").map((key, index) => (
          <div key={index}>
            <Grid item key={index}>
              <Grid container spacing={2} p={1}>
                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel sx={{ fontWeight: "bold" }}>
                      <span style={{ color: theme.palette.info.main }}>{content.GPTNutrition[key].value.toFixed(2)} {content.GPTNutrition[key].unit}</span> of total <span style={{ color: theme.palette.info.main }}>{key}</span>:
                    </FormLabel>
                    <RadioGroup
                      row
                      value={values?.nutrition?.[key] ?? ''}
                      onChange={onNutritionChange(key)}
                    >
                      <FormControlLabel
                        value="accurate"
                        control={<Radio />}
                        label="Accurate"
                      />
                      <FormControlLabel
                        value="broadly accurate"
                        control={<Radio />}
                        label="Broadly accurate"
                      />
                      <FormControlLabel
                        value="vroadly inaccurate"
                        control={<Radio />}
                        label="Broadly inaccurate"
                      />
                      <FormControlLabel
                        value="inaccurate"
                        control={<Radio />}
                        label="Inaccurate"
                      />
                      <FormControlLabel
                        value="no idea"
                        control={<Radio />}
                        label="No idea"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </div>
        ))}

        <Divider
          sx={{
            my: 2,
          }}
        />

        <Grid item>
          <TextField
            multiline
            fullWidth
            minRows={3}
            maxRows={5}
            placeholder='Comment'
            value={values.comment || ''}
            onChange={onCommentChange}
          />
        </Grid>
      </Paper>
    </>
  )
}
