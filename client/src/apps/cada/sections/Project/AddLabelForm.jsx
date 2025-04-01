import React from "react";
import {
  Grid,
  TextField,
  Button,
  IconButton,
  Divider,
  Popover,
  Typography,
  Alert,
} from "@mui/material";
import { MdDeleteForever, MdPalette } from "react-icons/md";

const useStyles = {
  container: {
    display: "flex",
  },
  delete: {
    position: "relative",
    top: 20,
    marginLeft: 5,
    color: "#7f8c8d",
  },
};

const AddLabelForm = ({
  attributes,
  handleChange,
  handleColorChange,
  handleDelete,
  handleAdd,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Grid container spacing={2}>
      {attributes.length === 0 ? (
        <Grid item md={12} xs={12}>
          <Typography variant="body2" color="textSecondary" component="p">
            No labels!
          </Typography>
        </Grid>
      ) : (
        ""
      )}
      <Grid item xs={12}>
        <Alert
          icon={false}
          color="primary"
          action={
            <div>
              <Button disabled={false} size="small" onClick={handleAdd}>
                ADD
              </Button>
            </div>
          }
        >
          Labels
        </Alert>
      </Grid>
      {attributes.length > 0 &&
        attributes.map((value, index) => (
          <React.Fragment key={index}>
            <Grid item md={5} xs={12}>
              <TextField
                fullWidth
                label="Name"
                margin="dense"
                name="name"
                value={value.name ? value.name : ""}
                onChange={handleChange(index)}
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <TextField
                fullWidth
                label="Value"
                margin="dense"
                name="value"
                required
                value={value.value ? value.value : ""}
                onChange={handleChange(index)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <div style={{ ...useStyles.container }}>
                <IconButton sx={{ mt: 2 }} onClick={handleClick}>
                  <MdPalette color={value.color ? value.color : ""} />
                </IconButton>

                <IconButton sx={{ mt: 2 }} onClick={() => handleDelete(index)}>
                  <MdDeleteForever />
                </IconButton>
              </div>
              <Popover
                id={id}
                s
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "top",
                }}
              >
                <Grid
                  container
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  <Grid item>
                    {[
                      "#1abc9c",
                      "#16a085",
                      "#2ecc71",
                      "#27ae60",
                      "#3498db",
                      "#2980b9",
                    ].map((color) => (
                      <IconButton
                        onClick={() => {
                          handleColorChange(index, color);
                          handleClose();
                        }}
                      >
                        <MdPalette color={color} />
                      </IconButton>
                    ))}
                  </Grid>
                  <Grid item>
                    {[
                      "#e056fd",
                      "#be2edd",
                      "#686de0",
                      "#4834d4",
                      "#30336b",
                      "#130f40",
                    ].map((color) => (
                      <IconButton
                        onClick={() => {
                          handleColorChange(index, color);
                          handleClose();
                        }}
                      >
                        <MdPalette color={color} />
                      </IconButton>
                    ))}
                  </Grid>
                  <Divider />
                  <Grid item>
                    {[
                      "#f1c40f",
                      "#f39c12",
                      "#e67e22",
                      "#d35400",
                      "#e74c3c",
                      "#c0392b",
                    ].map((color) => (
                      <IconButton
                        onClick={(color) => {
                          handleColorChange(index, color);
                          handleClose();
                        }}
                      >
                        <MdPalette color={color} />
                      </IconButton>
                    ))}
                  </Grid>
                </Grid>
              </Popover>
            </Grid>
          </React.Fragment>
        ))}
    </Grid>
  );
};
export default AddLabelForm;
