import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MdExpandMore } from "react-icons/md";

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

const ReviewCard = ({ card, attributes }) => {
  const [expanded, setExpanded] = useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        minWidth: 400,
        boxShadow: "0px 0px 10px 10px rgba(206, 214, 224, 0.5)",
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#0fb9b1" }}>
            {card.name && card.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={card.name && card.name}
        subheader={card.title && card.title}
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
          {card.description ? card.description : "?"}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <MdExpandMore />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            <b>Goal: </b>
            {card.goal && card.goal}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <b>Data: </b>
            {card.data && card.data}
          </Typography>

          <Divider />
          {<attributes className="length"></attributes> &&
            attributes.map((b, i) => (
              <Button
                variant="contained"
                value={b.value}
                size="small"
                style={{
                  marginTop: 5,
                  marginRight: 5,
                  backgroundColor: b.color,
                  color: "#ecf0f1",
                }}
              >
                {b.name}
              </Button>
            ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ReviewCard;
