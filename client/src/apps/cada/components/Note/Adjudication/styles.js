import { createTheme } from "@mui/material/styles";

const theme = createTheme();

export const indexStyles = {
  root: {
    padding: theme.spacing(0),
  },
  overview: {
    padding: theme.spacing(2),
  },
  detail: {
    padding: theme.spacing(2),
  },
  paper: {
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  secondaryBar: {
    zIndex: 0,
    paddingLeft: 20,
    padding: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing(0),
  },
  iconButtonAvatar: {
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover": {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
  paper1: {
    position: "sticky",
    top: "1rem",
    minWidth: "275",
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  highlight1: {
    color: "rgba(0, 0, 0, 0.70)",
    fontSize: "18px",
    lineHeight: "2em",
    borderBottomStyle: "solid",
    borderBottomWidth: "4px",
    borderBottomColor: "#f57c00",
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
  },
  highlight2: {
    backgroundColor: "#1abc9c",
    borderRadius: "5px",
    padding: "1px 4px",
    color: "white",
  },
  highlight3: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "5px",
    padding: "0px 6px",
    color: "white",
  },
  download: {
    border: "none",
    top: 5,
    borderRadius: 20,
    paddingInline: 10,
    paddingBlock: 8,
  },
  pages: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  customBadge: {
    backgroundColor: "#2ecc71",
  },
  footer: {
    position: "fixed",
    padding: theme.spacing(2),
    left: 0,
    bottom: 0,
    right: 0,
  },
  avatar: {
    color: "white",
  },
  noteDropdpwn: {
    minWidth: 100,
    paddingLeft: theme.spacing(1),
  },
  formControl: {
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
  row: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: "#f39c12",
    color: theme.palette.common.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  spacer: {
    flex: "1 1 auto",
  },
};

export const overviewStyles = {
  root: {
    padding: theme.spacing(0),
  },
  overview: {
    padding: theme.spacing(2),
  },
  detail: {
    padding: theme.spacing(2),
  },
  paper: {
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  secondaryBar: {
    zIndex: 0,
    paddingLeft: 20,
    padding: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing(0),
  },
  iconButtonAvatar: {
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover": {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
  paper1: {
    position: "sticky",
    top: "1rem",
    minWidth: "275",
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  highlight1: {
    color: "rgba(0, 0, 0, 0.70)",
    fontSize: "18px",
    lineHeight: "2em",
    borderBottomStyle: "solid",
    borderBottomWidth: "4px",
    borderBottomColor: "#f57c00",
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
  },
  highlight2: {
    backgroundColor: "#1abc9c",
    borderRadius: "5px",
    padding: "1px 4px",
    color: "white",
  },
  highlight3: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "5px",
    padding: "0px 6px",
    color: "white",
  },
  download: {
    border: "none",
    top: 5,
    borderRadius: 20,
    paddingInline: 10,
    paddingBlock: 8,
  },
  pages: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  customBadge: {
    backgroundColor: "#2ecc71",
  },
  footer: {
    position: "fixed",
    padding: theme.spacing(2),
    left: 0,
    bottom: 0,
    right: 0,
  },
  avatar: {
    color: "white",
  },
  noteDropdpwn: {
    minWidth: 100,
    paddingLeft: theme.spacing(1),
  },
  formControl: {
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
  row: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: "#f39c12",
    color: theme.palette.common.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  spacer: {
    flex: "1 1 auto",
  },
};