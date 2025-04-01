import React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import AddProject from "./AddProjectForm";
import AddLabel from "./AddLabelForm";
import ReviewCard from "./AddProjectReviewCard";

import { connect } from "react-redux";
import { addProject } from "../../redux/actions";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();

const useStyles = {
  root: {
    minWidth: 600,
    padding: theme.spacing(2),
  },
  paper: {
    width: "100%",
  },
};

const steps = ["Add project", "Add labels", "Review project"];

function NewProject({ addProject, handleClose }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [values, setValues] = React.useState({});
  const [attributes, setAttributes] = React.useState([]);

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <AddProject values={values} handleFormChange={handleFormChange} />
        );
      case 1:
        return (
          <AddLabel
            attributes={attributes}
            handleChange={handleAttributeChange}
            handleColorChange={handleColorChange}
            handleDelete={handleAttributeDelete}
            handleAdd={handleAttributeAdd}
          />
        );
      case 2:
        return <ReviewCard card={values} attributes={attributes} />;
      default:
        throw new Error("Unknown step");
    }
  }
  const handleSave = () => {
    let newArr = {
      ...values,
      attributes: JSON.stringify({ Buttons: attributes }),
    };
    addProject(newArr);
    setTimeout(handleClose, 1000);
  };

  const handleFormChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleAttributeChange = (index) => (e) => {
    let newArr = [...attributes]; // copying the old datas array
    let propertyName = e.target.name;
    newArr[index][propertyName] = e.target.value;
    setAttributes(newArr);
  };

  const handleColorChange = (index, color) => {
    console.log(color);
    let newArr = [...attributes];
    newArr[index]["color"] = color;
    setAttributes(newArr);
  };

  const handleAttributeDelete = (index) => {
    let newArr = [...attributes]; // copying the old datas array
    newArr.splice(index, 1);
    setAttributes(newArr);
  };

  const handleAttributeAdd = () => {
    setAttributes([...attributes, { name: "", value: "", color: "" }]);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    activeStep + 1 === steps.length && handleSave();
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  console.log("values: ", values);
  console.log("activeStep: ", activeStep);

  return (
    <div style={{ ...useStyles.root }}>
      <Paper style={{ ...useStyles.paper }}>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="subtitle1">Done!</Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {getStepContent(activeStep)}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </React.Fragment>
      </Paper>
    </div>
  );
}
const mapStateToProps = (state) => ({
  projects: state.cada.projects,
});

const mapDispatchToProps = (dispatch) => ({
  addProject: (payload) => dispatch(addProject(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewProject);
