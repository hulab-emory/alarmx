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

export default function TermsOfService({ open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Terms of service
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Welcome to ModelMeetsData web application! These terms of service
            govern your access to and use of our platform. By accessing or using
            the M2D web application, you agree to these Terms.
          </Typography>
          <Typography gutterBottom style={{ fontWeight: "bold" }}>
            1. OWNERSHIP OF CONTENT
            <Typography gutterBottom>
              You own the copyright of the content you upload to our Platform.
              By uploading content, you grant ModelMeetsData a non-exclusive,
              royalty-free license to use, display, and distribute the content
              on the Platform.
            </Typography>
          </Typography>
          <Typography gutterBottom style={{ fontWeight: "bold" }}>
            2. USER RESPONSIBILITY
            <Typography gutterBottom>
              You may not upload any content to the Platform that is defamatory,
              infringing, or illegal. We expect our users to interact with each
              other in a respectful and professional manner. You may not use the
              Platform to harass, bully, or threaten other users.
            </Typography>
          </Typography>
          <Typography gutterBottom style={{ fontWeight: "bold" }}>
            3. INTELLECTUAL PROPERTY
            <Typography gutterBottom>
              We respect the intellectual property rights of others and expect
              our users to do the same. If you believe that your intellectual
              property rights have been infringed on the Platform, please
              contact us.
            </Typography>
          </Typography>
          <Typography gutterBottom style={{ fontWeight: "bold" }}>
            4. TERMINATION
            <Typography gutterBottom>
              We may terminate your account and access to the Platform if you
              violate these Terms or engage in any prohibited activities.
            </Typography>
          </Typography>
          <Typography gutterBottom style={{ fontWeight: "bold" }}>
            5. LIABILITY
            <Typography gutterBottom>
              We are not liable for any damages or legal disputes arising from
              your use of the Platform. You agree to indemnify and hold us
              harmless from any claims, damages, or liabilities arising from
              your use of the Platform.
            </Typography>
          </Typography>
          <Typography gutterBottom style={{ fontWeight: "bold" }}>
            5. MODIFICATIONS
            <Typography gutterBottom>
              We reserve the right to modify these Terms at any time. We will
              notify you of any changes to these Terms via email or the
              Platform.
            </Typography>
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
