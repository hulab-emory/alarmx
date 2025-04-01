import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAnnotatorProgress } from '../../../redux/actions';
import { Box, LinearProgress, Paper, Typography } from '@mui/material';

const FILTERED_UIDS = [1, 2, 6, 23]

export default function AnnotatorProgress({ pid, events }) {

  const progress = useSelector(
    (state) =>
      state.cada.annotatorProgress[pid]
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!progress && pid !== undefined && pid !== null) {
      dispatch(getAnnotatorProgress(pid, FILTERED_UIDS));
    }
  }, [progress]);

  const calculateProgress = (userProgress) => {
    const completed = userProgress.filter((p) => p.completed).length;

    return completed / userProgress.length;
  };

  return (
    <Paper sx={{ p: 2, display: "flex", alignItems: "center", flexDirection: "column" }}>
      {progress && Object.keys(progress).map((uid) => {
        const currProgress = calculateProgress(progress[uid]);
        return (
        <Box key={uid} sx={{ p: 2, width: "100%", display: "flex", alignItems: "center", flexDirection: "row" }}>
          <Typography variant="h6">{`${progress[uid][0].user.firstName} ${progress[uid][0].user.lastName}`}</Typography>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress variant="determinate" color={currProgress === 1 ? "success" : "primary"} value={currProgress * 100} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="h6" color="textSecondary">
              {currProgress * 100}%
            </Typography>
          </Box>
        </Box>
      )})}
    </Paper>
  )
}
