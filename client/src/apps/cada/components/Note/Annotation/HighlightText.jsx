import React from 'react';
import PropTypes from 'prop-types';
import { styled } from "@mui/material/styles";
import { Badge } from '@mui/material';
import Label from '../../../common/Label';

// Utility function to split text into parts based on <TEXT> tags
function splitTextByTags(text) {
  const regex = /(<[A-Z_]*>)/g; // Matches everything wrapped in <>
  return text.split(regex).map((part) => ({
    text: part.replace(/(<|>)+/g, ''),
    isTag: regex.test(part),
    highlight: false,
  }));
}


// Utility function to apply highlights to text
function applyHighlights(text, highlights) {
  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
  const parts = [];
  let cursor = 0;

  sortedHighlights.forEach(({ start, end, concept, concept_id }) => {
    // Add unhighlighted text before the highlight
    if (cursor < start) {
      const currText = text.slice(cursor, start);
      parts.push(...splitTextByTags(currText));
      // parts.push({
      //   text: text.slice(cursor, start),
      //   highlight: false,
      // });
    }
    // Add the highlighted text
    parts.push({
      text: text.slice(start, end),
      highlight: true,
      conceptId: concept_id,
      concept,
    });
    cursor = end;
  });

  // Add the remaining text after the last highlight
  if (cursor < text.length) {
    parts.push({
      text: text.slice(cursor),
      highlight: false,
    });
  }

  return parts;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 3,
    top: -15,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 3px",
    backgroundColor: "rgba(26, 188, 156, 0.8)",
    color: "white",
  },
}));

// HighlightText Component
const HighlightText = ({ text, highlights, selectedConcept, onHighlightClick, values, tags }) => {
  const parts = applyHighlights(text, highlights);

  return (
    <p style={{ fontSize: '1.1rem', lineHeight: '2.2rem' }}>
      {parts.map((part, index) => {
        if (part.isTag) {
          return <span key={index}>
            <Label
              color="info"
              sx={{
                fontSize: '1rem',
              }}
            >
              {part.text.replace("_", " ")}
            </Label>
          </span>
        }
        if (part.highlight) {
          return (
            <span key={index} style={{ cursor: "pointer" }} onClick={onHighlightClick(part.conceptId)}>
              <span
                key={index}
                className={`highlight${selectedConcept === part?.conceptId ? '-selected' : ''}`}
              >
                {part.text}
              </span>
              <span
                className={`concept${selectedConcept === part?.conceptId ? '-selected' : ''}`}
              >
                {part.concept}
              </span>
              {Object.keys(part).includes("conceptId") && values[part.conceptId] && <StyledBadge badgeContent="✔" />}
            </span>
          );
        }
        return <span key={index}>{part.text}</span>;
      })}
      <style>
        {`
        .highlight,
        .highlight-selected {
          border-bottom: rgb(245, 124, 0) solid 3px;
          padding: 0 2px;
          border-radius: 4px;
        }
        .concept,
        .concept-selected {
          background-color: rgb(245, 124, 0);
          color: white;
          font-size: 1rem;
          margin-left: 5px;
          margin-right: 10px;
          padding: 1px 5px;
          border-radius: 8px;
          font-weight: bold;
          position: relative;
          top: -7px;
        }
        .highlight {
          border-bottom: rgb(246 195 109) solid 3px;
        }
        .concept {
          background-color: rgb(246 195 109);
          color: white;
        }
      `}
      </style>
    </p>
  );
};

HighlightText.propTypes = {
  text: PropTypes.string.isRequired,
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
      concept: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default HighlightText;
