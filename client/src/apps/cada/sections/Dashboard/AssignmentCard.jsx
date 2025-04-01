import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  Chip,
  Stack,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import {
  MdExpandMore as ExpandMoreIcon,
  MdMoreVert as MoreVertIcon,
} from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// ----------------------------------------------------------------------

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

// ----------------------------------------------------------------------

export default function AssignmentCard({ card, user }) {
  const [expanded, setExpanded] = React.useState(false);

  const annEventCount = useSelector((state) => state.cada.ann_events_count[card.id]
  ? state.cada.ann_events_count[card.id]
  : null);

  const adjEventCount = useSelector((state) => state.cada.adj_events_count[card.id]
  ? state.cada.adj_events_count[card.id]
  : null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const getCount = async () => {
      if (annEventCount === null) {
        const result = await axios(
          `/api/cada/event/assignmentsCount?pid=${card.id}&uid=${user.userId}`
        );
        dispatch({
          type: "GET_ANN_EVENTS_COUNT",
          projectId: card.id,
          //convert to object with completed as key and count as value but default to 0:0 1:0
          payload: result.data.reduce((acc, obj) => {
            acc[obj.completed] = obj.count;
            return acc;
          } , {0: 0, 1: 0})
        });
      }
    };

    const getAdjCount = async () => {
      const result = await axios(
        `/api/cada/event/count?pid=${card.id}&completed=true`
      );
      dispatch({
        type: "GET_ADJ_EVENTS_COUNT",
        projectId: card.id,
        payload: result.data
      });

    };

    if (user.role === "annotator") {
      getCount();
    } else getAdjCount();
  }, [card, user]);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#0fb9b1" }}>
            {card.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton
            aria-label="settings"
            onClick={() =>
              navigate(
                "/cada/" + user.role + "/" + card.projectType + "/" + card.id
              )
            }
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={card.name}
        subheader={card.title}
      />
      <CardContent>
        <Typography
          sx={
            expanded
              ? {}
              : {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minHeight: 60,
                  maxWidth: 400,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }
          }
          variant="body2"
          color="text.secondary"
          component="p"
        >
          {card.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {user.role === "annotator" ? (
          <Stack direction="row">
            <Chip
              size="small"
              label={annEventCount && annEventCount[0] ? annEventCount[0] : 0}
              sx={{
                fontWeight: 900,
                ml: 1,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            />
            <Chip
              size="small"
              label={annEventCount && annEventCount[1] ? annEventCount[1] : 0}
              color="secondary"
              sx={{
                fontWeight: 900,
                ml: 1,
                bgcolor: "primary.secondary",
                color: "primary.contrastText",
              }}
            />
          </Stack>
        ) : (
          <Chip
            size="small"
            label={adjEventCount ? adjEventCount : 0}
            sx={{
              fontWeight: 900,
              ml: 1,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          />
        )}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="text.secondary" component="p">
            <b>Goal: </b> {card.goal}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="p">
            <b>Data: </b>
            {card.data}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
