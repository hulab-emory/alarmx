import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { IoMdClose as CloseIcon } from "react-icons/io";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function PrivacyPolicy({ open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Privacy Policy
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            The data you uploaded will not be saved to any local disk without
            your consent. They will only be saved in in-memory databases and
            deleted immediately after use.
          </Typography>
          <Typography gutterBottom>
            We will not share any information or data we collect fr om you with
            any third party businesses or individuals.
          </Typography>
          <Typography gutterBottom>
            We may use cookies and similar tracking technologies ( like web
            beacons and pixels ) to access or store information. Specific
            information about how we use such technologies and how you can
            refuse certain cookies is set out in our Cookie Notice.
          </Typography>
          <Typography gutterBottom>
            Our Services offer you the ability to register and log in using your
            third-party social media account details ( like your Gmail and Emory
            SSO logins). Where you choose to do this, we will receive certain
            profile information about you from your social media provider. The
            profile information we receive may vary depending on the social
            media provider concerned, but will often include your name, email
            address, friends list, profile picture, as well as other information
            you choose to make public on such a social media platform.
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
