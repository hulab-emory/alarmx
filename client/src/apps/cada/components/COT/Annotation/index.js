import { AppBar, Toolbar, Typography, Button, LinearProgress, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAnnotationEvents, getProjects } from '../../../redux/actions';
import { NoContent } from '../../../common/NoContent';
import Panel from './Panel';
import { createTheme } from "@mui/material/styles";
import { InputPagination } from '../../../common/InputPagination';
const theme = createTheme();

const useStyles = {
  pages: {
    position: "relative",
    zIndex: 0,
    padding: theme.spacing(2),
    left: 0,
    right: 0,
  },
};

export default function Annotation({ pid }) {
  const project = useSelector((state) => state.cada.userProjects[pid]);

  const events = useSelector((state) =>
    state.cada.ann_events[pid] || null
  );

  const user = useSelector((state) => state.main.user);
  const [isLoading, setIsLoading] = useState(true);

  const [eIdx, setEIdx] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!project) {
      dispatch(getProjects());
    }
    if (!events) {
      dispatch(getAnnotationEvents(pid, user.id, null, true));
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, setIsLoading, pid, user]);


  const handlePageChange = (e, page) => {
    setEIdx(page - 1);
  }

  const handleInputPage = (page) => {
    if (page <= 1) {
      setEIdx(0);
      return;
    }
    if (page > events.false.length + events.true.length) {
      setEIdx(events.false.length + events.true.length - 1);
      return;
    }
    setEIdx(page - 1);
  }

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <>
      {events && Object.keys(events).length > 0 ? (
        <>
          <AppBar
            component="div"
            sx={{ pl: 1 }}
            position="static"
            elevation={0}
          >
            <Toolbar>
              <Typography color="inherit" variant="h6" component="h1">
                {project?.title} Annotation
              </Typography>
              <div style={{ flex: "1 1 auto" }} />
              <Button variant="outlined" color="inherit" size="small">
                Report
              </Button>
            </Toolbar>
          </AppBar>
          <Panel
            user={user}
            project={project}
            events={[...events[true], ...events[false]]}
            eIdx={eIdx}
            setEIdx={setEIdx}
          />
          <Box sx={{ ...useStyles.pages }}>
            <InputPagination
              total={events.false.length + events.true.length}
              page={eIdx + 1}
              onChange={handlePageChange}
              onInput={handleInputPage}
            />
          </Box>
        </>
      ) : (
        <NoContent
          text="There are no assignments!"
          subtext="Contact your admin for assignments!"
        />
      )}
    </>
  );
}
