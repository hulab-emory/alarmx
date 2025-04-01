import React, { useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import { Toolbar, Tooltip, IconButton } from "@mui/material";
import { MdInfo } from "react-icons/md";

import { useParams } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import {
  getAnnotationEvents,
  updateAnnotation,
} from "../../../redux/actions";
import { Typography } from "@mui/material";
import Chart from "./Data";
import useDidMountEffect from "../../../../../hooks/useDidMountEffect";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();

const useStyles = {
  root: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  highlight1: {
    backgroundColor: "rgb(255, 255, 0)",
  },
  highlight2: {
    backgroundColor: "#e67e22",
    borderRadius: "5px",
    padding: "1px 4px",
    color: "white",
  },
  paper1: {
    height: window.innerHeight - 180,
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
  padding: {
    padding: theme.spacing(3),
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
  demo2: {
    backgroundColor: "#2e1534",
  },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  spacer: {
    flex: "1 1 auto",
  },
  noMaxWidth: {
    maxWidth: "none",
  },
};

const Pages = ({ total, page, onChange }) => {
  return (
    <div style={{ ...useStyles.pages }}>
      <Pagination
        color="primary"
        size="small"
        page={page}
        count={total}
        showFirstButton
        showLastButton
        boundaryCount={2}
        onChange={onChange}
        renderItem={(item) =>
          item.type === "pages  " ? (
            <Badge variant="dot">
              <PaginationItem {...item} />
            </Badge>
          ) : (
            <PaginationItem {...item} />
          )
        }
      />
    </div>
  );
};

function Annotation({
  events,
  project,
  getAnnotationEvents,
  updateAnnotation,
}) {
  const params = useParams();
  const [event, setEvent] = React.useState(0);
  const [completedTab, setCompletedTab] = React.useState(false);
  const [buttonsDisabled, setButtonsDisabled] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [chartObjects, setChartObjects] = React.useState([]);
  const [selectedRanges, setSelectedRanges] = React.useState([]);
  const [ruler, setRuler] = React.useState(0);
  const [left, setLeft] = React.useState(0);

  const handleChange = (event, newValue) => {
    if (newValue === 0) {
      setValue(newValue);
      setCompletedTab(false);
      setSelectedRanges([]);
      setEvent(0);
    } else {
      setValue(newValue);
      setCompletedTab(true);
    }
  };

  const handleSubmit = (e) => {
    console.log("handleSubmit: ", e.currentTarget.value);
    updateAnnotation(project.id, events[completedTab][event].id, completedTab, {
      field: e.currentTarget.value,
      value: JSON.stringify(selectedRanges),
      cadaAnnotationId: events[completedTab][event].cadaAnnotations[0].id,
      createdAt: new Date(new Date().toUTCString()).toISOString(),
    });
    setSelectedRanges([]);
  };

  const handlePage = (event, page) => {
    setEvent(page - 1);
  };

  const handleLabelClick = (event) => {
    console.log(event.currentTarget);
  };

  const handleLabelDelete = (index) => () => {
    setSelectedRanges([
      ...selectedRanges.slice(0, index),
      ...selectedRanges.slice(index + 1),
    ]);
  };

  const onSelectRange = (e) => {
    setSelectedRanges((selectedRanges) => [
      ...selectedRanges,
      {
        min: e.axisX[0].viewportMinimum,
        max: e.axisX[0].viewportMaximum,
      },
    ]);
  };

  const getChartObj = (obj, type) => {
    // console.log(type, obj);
    if (type === "add") {
      setChartObjects((chartObjects) => [...chartObjects, obj]);
    } else if (type === "remove") {
      setChartObjects((chartObjects) => {
        let copy = Object.assign([], chartObjects);

        for (let i = 0; i < copy.length; i++) {
          if (copy[i] === obj) {
            copy.splice(i, 1);
          }
        }
        return copy;
      });
    }
  };

  const onDataPointClick = (e) => {
    setRuler(e.dataPoint.x);
  };

  useEffect(() => {
    console.log("selectRanges changed", selectedRanges);
    if (chartObjects) {
      let charts = chartObjects;
      for (let i = 0; i < charts.length; i++) {
        charts[i].sessionVariables.axisX[0].newViewportMinimum = 0;
        charts[i].sessionVariables.axisX[0].newViewportMaximum = 30;
        charts[i].options.axisX.stripLines = selectedRanges.map((range) => ({
          startValue: range.min,
          endValue: range.max,
          color: "rgba(250, 177, 160, 0.3)",
        }));
        charts[i].render();
        if (charts[i]._zoomButton.getAttribute("state") === "zoom") {
          charts[i]._zoomButton.click();
        }
      }
    }
  }, [selectedRanges]);

  useEffect(() => {
    console.log("ruler changed", selectedRanges);
    let boundX = {};
    if (chartObjects) {
      let charts = chartObjects;
      for (let i = 0; i < charts.length; i++) {
        let temp = Object.assign({}, charts[i]);
        charts[i].axisX[0].margin = 260;
        charts[i].sessionVariables.axisX[0].newViewportMinimum = 0;
        charts[i].sessionVariables.axisX[0].newViewportMaximum =
          events[completedTab][event].cadaFile.Length;
        charts[i].options.axisX.stripLines = charts[
          i
        ].options.axisX.stripLines.concat([
          {
            value: ruler,
            thickness: 2,
            color: "rgba(29, 209, 161, 1.0)",
          },
        ]);
        charts[i].render();
        if (charts[i]._zoomButton.getAttribute("state") === "zoom") {
          charts[i]._zoomButton.click();
        }
      }
    }
  }, [ruler]);

  useDidMountEffect(() => {
    if (value === 1) {
      let annotationObj =
        events[completedTab][event].cadaAnnotations[0].cadaAnnotationValues;
      let maxIdAnnotationValue = annotationObj.reduce((prev, curr) =>
        prev.id > curr.id ? prev : curr
      );
      let indexOfLatestAnnotationValue = annotationObj.findIndex(
        ({ Id }) => Id === maxIdAnnotationValue.id
      );

      setTimeout(() => {
        setSelectedRanges(
          JSON.parse(annotationObj[indexOfLatestAnnotationValue].value)
        );
      }, 3000);
    }
  }, [event, value]);

  if (
    events &&
    events[completedTab] &&
    events[completedTab][event] &&
    events[completedTab][event].cadaAnnotations &&
    events[completedTab][event].cadaAnnotations[0].cadaAnnotationValues
  ) {
    return (
      <div style={{ ...useStyles.root }}>
        <Toolbar disableGutters={true}>
          <Tabs value={value} onChange={handleChange}>
            <Tab
              label={
                <div>
                  Assigned
                  <Chip
                    color="primary"
                    style={{ marginInline: 4 }}
                    size="small"
                    label={events[false].length}
                  />
                </div>
              }
            />
          </Tabs>

          <div style={{ flex: "1 1 auto" }} />

          {completedTab
            ? JSON.parse(project.attributes).Buttons.map((b, i) => {
                let latestElement =
                  events[completedTab][event].cadaAnnotations[0]
                    .cadaAnnotationValues.length > 0
                    ? events[completedTab][
                        event
                      ].cadaAnnotations[0].cadaAnnotationValues.sort(
                        (a, b) => b.id - a.id
                      )[0]
                    : null;
                return (
                  <Button
                    variant="contained"
                    value={b.value}
                    size="small"
                    disabled={buttonsDisabled}
                    style={{
                      marginRight: 5,
                      backgroundColor:
                        latestElement && latestElement.value === b.value
                          ? b.color
                          : "#bdc3c7",
                      color: "#ecf0f1",
                    }}
                    onClick={handleSubmit}
                  >
                    {b.name}
                  </Button>
                );
              })
            : JSON.parse(project.attributes).Buttons.map((b, i) => (
                <Button
                  key={i}
                  variant="contained"
                  value={b.value}
                  size="small"
                  disabled={buttonsDisabled}
                  style={{
                    marginRight: 5,
                    backgroundColor: b.color,
                    color: "#ecf0f1",
                  }}
                  onClick={handleSubmit}
                >
                  {b.name}
                </Button>
              ))}
        </Toolbar>

        <div style={{ ...useStyles.demo1 }}>
          <Toolbar style={{ ...useStyles.toolbar }}>
            {selectedRanges && selectedRanges.length > 0 ? (
              <React.Fragment>
                <strong style={{ marginRight: 5 }}>PVC:</strong>
                {selectedRanges.map((r, i) => (
                  <Chip
                    key={i}
                    sx={{ mr: 1, py: 1, height: 30 }}
                    label={
                      parseFloat(r.min).toFixed(3) +
                      "s -" +
                      parseFloat(r.max).toFixed(3) +
                      "s"
                    }
                    onClick={handleLabelClick}
                    onDelete={handleLabelDelete(i)}
                  />
                ))}
              </React.Fragment>
            ) : (
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ paddingLeft: 10 }}
              >
                {" "}
                No segments selected...
              </Typography>
            )}

            <div style={{ ...useStyles.spacer }} />

            <Tooltip
              title={
                `Filename: ` +
                events[completedTab][event].cadaFile.path.split("/").pop()
              }
            >
              <IconButton color="disabled">
                <MdInfo />
              </IconButton>
            </Tooltip>
          </Toolbar>
          {/* <div onClick={() => setIsCardMoving(!isCardMoving)}>division
              <div style={{
                position: 'relative',
                zIndex: 10, 
                // transform:'rotate(90deg)',
                // marginTop: '200px',
                // marginLeft: left,
                // width: '100%', 
                // border: 0, 
                // borderTop: '1px solid red'
                borderLeft: '3px solid #5f656d',
                width: '1px',
                height: '100%',
                marginLeft: left+'px',
                marginRight: 'auto',
            }}></div></div> */}
          {events[completedTab].length > 0 ? (
            <Chart
              leadOrder={[]}
              completedTab={completedTab}
              viewportInterval={onSelectRange}
              getChartObj={getChartObj}
              onClick={onDataPointClick}
              range={30}
              fileLength={30}
              filename={events[completedTab][event].cadaFile.path}
              nextFilename={
                typeof events[completedTab][event + 1] === "undefined"
                  ? ""
                  : events[completedTab][event + 1].cadaFile.path
              }
            />
          ) : (
            ""
          )}
        </div>

        {value === 1 ? (
          <Box style={{ ...useStyles.footer }} mt={8}>
            <Pages
              page={event + 1}
              total={events[completedTab].length}
              onChange={handlePage}
            />
          </Box>
        ) : (
          ""
        )}
      </div>
    );
  } else return "";
}

const mapDispatchToProps = (dispatch) => ({
  getAnnotationEvents: (userId, projectId) =>
    dispatch(getAnnotationEvents(userId, projectId)),
  updateAnnotation: (projectId, annotationId, annotationValue, annotation) =>
    dispatch(
      updateAnnotation(projectId, annotationId, annotationValue, annotation)
    ),
});

export default connect(null, mapDispatchToProps)(Annotation);
