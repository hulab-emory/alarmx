import { Box, Chip, Paper, Tab, Tabs, Toolbar } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateAnnotation } from "../../../../../redux/cada/actions";
import { NoContent } from "../../../common/NoContent";
import { Pages } from "../../../common/Pages";
import LabsChart from "./Labs";
import MedsChart from "./Meds";
import VitalChart from "./Vitals";
import Label from "../../../common/Label";

const theme = createTheme();

export default function AfibAnnotation({ user, project, events }) {
  const [data, setData] = useState([]);
  const [eIdx, setEIdx] = useState(0);
  const [completedTab, setCompletedTab] = useState(false);

  const [noteContent, setNoteContent] = useState(null);
  const [noteFileName, setNoteFileName] = useState(
    events[completedTab][eIdx].cadaFile.path.split("/").pop()
  );

  const dispatch = useDispatch();

  const handleTabChange = (e, newValue) => {
    if (newValue === false) {
      setCompletedTab(false);
      setEIdx(0);
    } else {
      setCompletedTab(true);
    }
  };

  const handlePage = (e, page) => {
    setNoteFileName(
      events[completedTab][page - 1].cadaFile.path.split("/").pop()
    );
    setEIdx(page - 1);
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

  useEffect(() => {
    const fetchNote = async () => {
      console.log("Fetching note ... ", noteFileName);
      try {
        const fileContent = await import(`../../../assets/${noteFileName}`);
        setNoteContent(fileContent);
      } catch (error) {
        console.error("Error loading file:", error);
      }
    };

    fetchNote();
  }, [noteFileName]);

  return (
    <>
      {noteContent &&
      events &&
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
                      label={events[false].length}
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
                      label={events[true].length}
                    />
                  </div>
                }
              />
            </Tabs>

            <div style={{ flex: "1 1 auto" }} />
          </Toolbar>
          <Paper>
            <Label sx={{ m: 1 }} color="success">
              Subject_id: {noteFileName.split(".")[0]}
            </Label>
          </Paper>

          <VitalChart data={noteContent.vitals} />
          <MedsChart data={noteContent.meds} />
          <LabsChart data={noteContent.labs} />

          {completedTab === false && (
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
