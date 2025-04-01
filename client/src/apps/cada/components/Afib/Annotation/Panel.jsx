import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { MdAutorenew, MdInfo } from "react-icons/md";
import useDidMountEffect from "../../../../../hooks/useDidMountEffect";
import { updateAnnotation } from "../../../redux/actions";
import { NoContent } from "../../../common/NoContent";
import { Pages } from "../../../common/Pages";
import DataPanel from "./Data";

const theme = createTheme();

export default function AfibAnnotation({ user, project, events, events_count }) {
  const [data, setData] = useState([]);
  const [eIdx, setEvent] = useState(0);
  const [completedTab, setCompletedTab] = useState(false);
  const [buttonsDisabled] = useState(false);
  const [resetButtonVisibility, setResetButtonVisibility] = useState(false);
  const [chartObjects, setChartObjects] = useState([]);
  const [selectedRanges, setSelectedRanges] = useState({});

  const dispatch = useDispatch();

  const handleTabChange = (e, newValue) => {
    if (newValue === false) {
      setCompletedTab(false);
      setEvent(0);
    } else {
      setCompletedTab(true);
      setSelectedRanges([]);
      setResetButtonVisibility(false);
    }
  };

  const handleSubmit = (e) => {
    let isComplete = true;
    setData([
      ...data,
      {
        user: user.Email,
        file: events[completedTab][eIdx].cadaFile.path,
        field: project.name,
        value: e.currentTarget.value,
      },
    ]);

    dispatch(
      updateAnnotation(
        project.id,
        events[completedTab][eIdx].id,
        completedTab,
        {
          field: project.name,
          value: e.currentTarget.value,
          cadaAnnotationId: events[completedTab][eIdx].cadaAnnotations[0].id,
          createdAt: new Date(new Date().toUTCString()).toISOString(),
        },
        isComplete
      )
    );
  };

  const handlePage = (event, page) => {
    setEvent(page - 1);
  };

  const onSelectRange = (e) => {
    if (resetButtonVisibility === false) {
      setSelectedRanges({
        ...selectedRanges,
        min: e.axisX[0].viewportMinimum,
        max: e.axisX[0].viewportMaximum,
      });
      setResetButtonVisibility(true);
    }
  };

  const getChartObj = (obj, type) => {
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

  const handleResetButtonClick = () => {
    let charts = chartObjects;
    for (let i = 0; i < charts.length; i++) {
      charts[i].options.axisX.viewportMinimum = 0;
      charts[i].options.axisX.viewportMaximum = 30;
      charts[i].render();
      if (charts[i]._zoomButton.getAttribute("state") === "zoom") {
        charts[i]._zoomButton.click();
      }
    }
    setResetButtonVisibility(false);
  };

  useDidMountEffect(() => {
    if (chartObjects) {
      let charts = chartObjects;
      for (let i = 0; i < charts.length; i++) {
        charts[i].options.axisX.viewportMinimum = selectedRanges.min;
        charts[i].options.axisX.viewportMaximum = selectedRanges.max;
        charts[i].render();
        if (charts[i]._zoomButton.getAttribute("state") === "pan") {
          charts[i]._zoomButton.click();
        }
      }
    }
  }, [selectedRanges]);

  return (
    <>
      {events &&
      events[completedTab] &&
      events[completedTab][eIdx] &&
      events[completedTab][eIdx].cadaAnnotations &&
      events[completedTab][eIdx].cadaAnnotations[0].cadaAnnotationValues ? (
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Toolbar disableGutters>
            <Tabs
              textColor="primary"
              value={completedTab}
              onChange={handleTabChange}
            >
              <Tab
                disableRipple
                textColor="primary"
                disabled={events[false].length === 0}
                value={false}
                label={
                  <div>
                    Assigned
                    <Chip
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                      label={events_count[0]}
                    />
                  </div>
                }
              />

              <Tab
                disableRipple
                disabled={events[true].length === 0}
                value={true}
                label={
                  <div>
                    Completed
                    <Chip
                      color="secondary"
                      size="small"
                      sx={{ ml: 1 }}
                      label={events_count[1]}
                    />
                  </div>
                }
              />
            </Tabs>

            <div style={{ flex: "1 1 auto" }} />

            {completedTab
              ? JSON.parse(project.attributes).Buttons.map((b, i) => {
                  let latestElement =
                    events[completedTab][eIdx].cadaAnnotations[0]
                      .cadaAnnotationValues.length > 0
                      ? events[completedTab][
                          eIdx
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

          <Paper>
            <Toolbar>
              <div style={{ flex: "1 1 auto" }} />
              <Tooltip title="reset chart">
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={handleResetButtonClick}
                  disabled={!resetButtonVisibility}
                  component="span"
                >
                  <MdAutorenew />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  `Filename: ` +
                  events[completedTab][eIdx].cadaFile.path.split("/").pop()
                }
              >
                <IconButton color="disabled">
                  <MdInfo />
                </IconButton>
              </Tooltip>
            </Toolbar>

            {events[completedTab].length > 0 ? (
              <DataPanel
                leadOrder={[]}
                completedTab={completedTab}
                viewportInterval={onSelectRange}
                getChartObj={getChartObj}
                range={30}
                fileLength={30}
                filename={events[completedTab][eIdx].cadaFile.path}
                nextFilename={
                  typeof events[completedTab][eIdx + 1] === "undefined"
                    ? ""
                    : events[completedTab][eIdx + 1].cadaFile.path
                }
              />
            ) : (
              ""
            )}
          </Paper>

          {completedTab && (
            <Box
              style={{
                position: "fixed",
                padding: theme.spacing(2),
                left: 0,
                bottom: 0,
                right: 0,
              }}
              mt={8}
            >
              <Pages
                page={eIdx + 1}
                total={events[completedTab].length}
                onChange={handlePage}
              />
            </Box>
          )}
        </Box>
      ) : (
        <NoContent
          text="There are chart data!"
          subtext="Check raw data exists!"
        />
      )}
    </>
  );
}
