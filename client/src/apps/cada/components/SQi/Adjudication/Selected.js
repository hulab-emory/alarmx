import React, { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tabs,
  Tab,
  Avatar,
  AvatarGroup,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { MdAutorenew, MdInfo } from "react-icons/md";
import DataPanel from "../../Afib/Annotation/Data";
import { Pages } from "../../../common/Pages";
import useDidMountEffect from "../../../../../hooks/useDidMountEffect";
import { useSelector, useDispatch } from "react-redux";
import {
  updateAdjudication,
  getAnnotators,
} from "../../../redux/actions";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();

const TransparentTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "transparent",
  },
});

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
});

export default function Selected({
  project,
  events,
  selectedIds,
  annotatedRecords,
}) {
  const [data, setData] = useState([]);
  const [eIdx, setEvent] = useState(0);
  const [completedTab, setCompletedTab] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [resetButtonVisibility, setResetButtonVisibility] = useState(false);
  const [chartObjects, setChartObjects] = useState([]);
  const [selectedRanges, setSelectedRanges] = useState({});

  const dispatch = useDispatch();
  const user = useSelector((state) =>
    state.main.user ? state.main.user : null
  );
  const annotators = useSelector((state) =>
    Object.keys(state.cada.annotators).length > 0 ? state.cada.annotators : null
  );

  const handleTabChange = (event, newValue) => {
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
    setData([
      ...data,
      {
        user: user.email,
        file: events[completedTab][eIdx].cadaFile.path,
        field: e.currentTarget.value,
        value: e.currentTarget.value,
      },
    ]);

    dispatch(
      updateAdjudication(
        project.id,
        events[completedTab][eIdx].id,
        user.id,
        completedTab,
        {
          field: e.currentTarget.value,
          value: e.currentTarget.value,
          userId: user.id,
          cadaEventId: events[completedTab][eIdx].id,
          createdAt: new Date(new Date().toUTCString()).toISOString(),
        }
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

  useEffect(() => {
    if (typeof events[false] === "undefined") {
      setCompletedTab(true);
    }
  }, [events]);

  useEffect(() => {
    console.log("useEffect:    ", events);
    if (annotators === null) {
      dispatch(getAnnotators(selectedIds));
    }
  }, []);

  useDidMountEffect(() => {
    console.log("useDidMountEffect:    ", annotators);
  }, [annotators]);

  useDidMountEffect(() => {
    // console.log('useDidMountEffect, chartObjects: ', chartObjects, resetButtonVisibility);
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

  if (events) {
    return (
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Toolbar disableGutters>
          <Tabs
            textColor="primary"
            value={completedTab}
            onChange={handleTabChange}
          >
            {events[false] && (
              <Tab
                disableRipple
                disabled={events[false].length === 0}
                value={false}
                label={
                  <div>
                    Annotated
                    <Chip
                      sx={{
                        ml: 1,
                        bgcolor:
                          completedTab === false ? "primary.light" : "grey.400",
                        color: "primary.contrastText",
                      }}
                      size="small"
                      label={events[false].length}
                    />
                  </div>
                }
              />
            )}
            {events[true] ? (
              <Tab
                disableRipple
                disabled={events[true].length === 0}
                value={true}
                label={
                  <div>
                    Adjudicated
                    <Chip
                      sx={{
                        ml: 1,
                        bgcolor:
                          completedTab === true ? "primary.light" : "grey.400",
                        color: "primary.contrastText",
                      }}
                      size="small"
                      label={events[true].length}
                    />
                  </div>
                }
              />
            ) : (
              ""
            )}
          </Tabs>

          <div style={{ flex: "1 1 auto" }} />

          {completedTab
            ? JSON.parse(project.attributes).Buttons.map((b, i) => {
                let latestElement =
                  events[completedTab][eIdx].cadaAdjudicationValues.length > 0
                    ? events[completedTab][eIdx].cadaAdjudicationValues.sort(
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
                        latestElement && latestElement.field === b.value
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
            : JSON.parse(project.attributes).Buttons.map((b, i) => {
                let annotationObj = events[false] && events[false][eIdx];
                console.log("annotatedRecords:", annotatedRecords);
                console.log("annotators: ", annotators);
                return (
                  <TransparentTooltip
                    placement="top"
                    title={
                      <AvatarGroup max={5}>
                        {annotationObj &&
                          annotatedRecords[annotationObj.id][b.value] &&
                          annotatedRecords[annotationObj.id][b.value].map(
                            (user) => (
                              <Avatar
                                style={{
                                  width: theme.spacing(3),
                                  height: theme.spacing(3),
                                  backgroundColor: "#f39c12",
                                  color: theme.palette.common.white,
                                  fontSize: 10,
                                  fontWeight: "bold",
                                }}
                              >
                                {annotators && annotators[user]
                                  ? annotators[user].firstName
                                      .charAt(0)
                                      .toUpperCase() +
                                    annotators[user].lastName
                                      .charAt(0)
                                      .toUpperCase()
                                  : user}
                              </Avatar>
                            )
                          )}
                      </AvatarGroup>
                    }
                  >
                    <Badge
                      badgeContent={
                        annotationObj &&
                        annotatedRecords[annotationObj.id][b.value] &&
                        annotatedRecords[annotationObj.id][b.value].length
                      }
                      color="primary"
                    >
                      <Button
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
                    </Badge>
                  </TransparentTooltip>
                );
              })}
        </Toolbar>

        <Paper>
          <Toolbar>
            <div style={{ flex: "1 1 auto" }} />
            <CustomWidthTooltip title="reset chart">
              <IconButton
                variant="contained"
                color="primary"
                onClick={handleResetButtonClick}
                disabled={!resetButtonVisibility}
                component="span"
              >
                <MdAutorenew />
              </IconButton>
            </CustomWidthTooltip>
            <CustomWidthTooltip
              title={
                `Filename: ` + events[completedTab][eIdx] &&
                events[completedTab][eIdx].cadaFile.path.split("/").pop()
              }
            >
              <IconButton color="disabled">
                <MdInfo />
              </IconButton>
            </CustomWidthTooltip>
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

        {completedTab ? (
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
        ) : (
          ""
        )}
      </Box>
    );
  } else return "";
}
