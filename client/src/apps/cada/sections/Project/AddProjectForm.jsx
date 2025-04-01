import React from "react";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

const projectTypes = {
  afib: "waveform · segmented · full",
  sqi: "waveform · segmented · partial",
  nlp: "nlp · validation",
  txt: "text · annotation",
  chart: "chart · review",
};

const AddProjectForm = ({ values, handleFormChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label="Short Name"
          margin="dense"
          name="name"
          onChange={handleFormChange}
          required
          value={values.name ? values.name : ""}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item md={8} xs={12}>
        <TextField
          fullWidth
          label="Title"
          margin="dense"
          name="title"
          onChange={handleFormChange}
          required
          value={values.title ? values.title : ""}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item md={12} xs={12}>
        <TextField
          fullWidth
          required
          multiline
          label="Goal"
          margin="dense"
          name="goal"
          onChange={handleFormChange}
          value={values.goal ? values.goal : ""}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item md={12} xs={12}>
        <TextField
          fullWidth
          required
          multiline
          label="Data"
          margin="dense"
          name="data"
          onChange={handleFormChange}
          value={values.data ? values.data : ""}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item md={12} xs={12}>
        <TextField
          fullWidth
          required
          minRows={3}
          multiline
          label="Description"
          margin="dense"
          name="description"
          onChange={handleFormChange}
          value={values.description ? values.description : ""}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item md={12} xs={12}>
        <TextField
          select
          fullWidth
          label="Type"
          margin="dense"
          name="projectType"
          onChange={handleFormChange}
          required
          value={values.projectType ? values.projectType : ""}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        >
          {Object.keys(projectTypes).map((option) => (
            <MenuItem key={option} value={option}>
              {projectTypes[option]}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};
export default AddProjectForm;
