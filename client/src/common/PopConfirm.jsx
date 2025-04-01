import { useState } from "react";
import { Popover, Paper, Button, Typography } from "@mui/material";

export default function PopConfirm({ message, onConfirm, children }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <span onClick={handleOpen}>{children}</span>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        sx={{ transform: "translateY(-20px)" }}
      >
        <Paper
          elevation={0}
          square={false}
          sx={{
            p: 2,
            minWidth: 100,
          }}
        >
          <Typography variant="body2">{message}</Typography>
          <div style={{ float: "right", marginBlock: "8px" }}>
            <Button variant="contained" onClick={handleConfirm} size="small">
              Confirm
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClose}
              size="small"
              sx={{ ml: 1 }}
            >
              Cancel
            </Button>
          </div>
        </Paper>
      </Popover>
    </>
  );
}
