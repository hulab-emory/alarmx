import React from "react";
import { Box, Divider, Paper, Stack, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ConceptOnIcon, ConceptOffIcon } from "../../../common/Icons";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -8,
    top: -12,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 3px",
    backgroundColor: "rgba(26, 188, 156, 0.8)",
  },
}));

const HighlightText = ({
  text,
  nIndex,
  highlights,
  currentHighlight,
  annotated,
  onHighlightClick,
  isShowHighlight,
}) => {
  const conceptLines = {};
  const handleHighlightClick = (index) => {
    onHighlightClick(index);
  };

  // console.log('annotated', annotated)
  // console.log('highlights', highlights)
  // console.log('currentHighlight', currentHighlight)
  // console.log('--- ', highlights[currentHighlight].concept_id)

  for (let i = 0; i < highlights.length; i++) {
    const numSents = highlights[i].num_sents;
    const start = highlights[i].start;

    if (!conceptLines[numSents]) {
      conceptLines[numSents] = {};
    }

    if (!conceptLines[numSents][start]) {
      conceptLines[numSents][start] = [{ ...highlights[i], i: i }];
    } else {
      conceptLines[numSents][start].push({ ...highlights[i], i: i });
    }
  }

  const highlightedData = text.split("\n").map(function (ln, index) {
    if (Object.keys(conceptLines).includes((index + 1).toString())) {
      const highlightedLine = Object.keys(conceptLines[index + 1]).map(
        (start, idx) => {
          const pre = idx === 0 ? ln.substring(0, start - 1) : "";
          const mid =
            idx !== Object.keys(conceptLines[index + 1]).length - 1
              ? ln.substring(
                  conceptLines[index + 1][start][0].end,
                  parseInt(Object.keys(conceptLines[index + 1])[idx + 1], 10)
                )
              : "";
          const post =
            idx === Object.keys(conceptLines[index + 1]).length - 1
              ? ln.substring(
                  conceptLines[index + 1][
                    Object.keys(conceptLines[index + 1])[idx]
                  ][0].end,
                  ln.length
                )
              : "";

          const trigger = (
            <>
              <span
                style={{
                  borderBottom:
                    conceptLines[index + 1][start].findIndex(
                      (item) => item.i === currentHighlight
                    ) !== -1
                      ? "4px solid #f57c00 "
                      : "4px solid rgba(250, 211, 144,1.0)",
                  borderRadius: "4px",
                  lineHeight: "2.5em",
                  marginLeft: ".2em",
                  position: "relative",
                }}
              >
                {(() => {
                  return ln.substring(
                    start,
                    conceptLines[index + 1][start][0].end
                  );
                })()}
              </span>
              {conceptLines[index + 1][start].map((elem, eIndx) => (
                <React.Fragment key={eIndx}>
                  <sup
                    onClick={() => handleHighlightClick(elem.i)}
                    style={{
                      cursor: "pointer",
                      borderRadius: "4px",
                      fontWeight: "600",
                      paddingInline: ".2em",
                      paddingBottom: ".1em",
                      color:
                        conceptLines[index + 1][start][
                          conceptLines[index + 1][start].findIndex(
                            (item) => item.i === currentHighlight
                          )
                        ]?.i === elem.i
                          ? "#f57c00"
                          : "rgba(250, 211, 144, 1.0)",
                    }}
                  >
                    {elem.i + 1}
                  </sup>
                  {isShowHighlight && (
                    <sup
                      onClick={() => handleHighlightClick(elem.i)}
                      style={{
                        color: "white",
                        cursor: "pointer",
                        borderRadius: "4px",
                        fontWeight: "600",
                        paddingInline: ".4em",
                        marginRight: ".6em",
                        backgroundColor:
                          conceptLines[index + 1][start][
                            conceptLines[index + 1][start].findIndex(
                              (item) => item.i === currentHighlight
                            )
                          ]?.i === elem.i
                            ? "#f57c00"
                            : "rgba(250, 211, 144, 1.0)",
                      }}
                    >
                      {elem.concept}
                      {annotated.includes(
                        conceptLines[index + 1][start][
                          eIndx
                        ].concept_id.toString()
                      ) ? (
                        <StyledBadge badgeContent="✔" />
                      ) : null}
                    </sup>
                  )}
                </React.Fragment>
              ))}
            </>
          );

          return (
            <React.Fragment key={`${index}_${idx}`}>
              {pre}
              {trigger}
              {mid}
              {post}
            </React.Fragment>
          );
        }
      );

      return highlightedLine;
    } else {
      const keywords = ln.match(/\b(?!.*\d{2}:)[A-Z]\w+(?=:):/g) || [];
      return keywords.length && ln.includes(keywords[0]) ? (
        <span
          key={index}
          dangerouslySetInnerHTML={{
            __html: ln.replace(keywords[0], "<b><br />$&</b>"),
          }}
        />
      ) : (
        ln
      );
    }
  });

  return <>{highlightedData}</>;
};

export default function DataPanel({
  note,
  concept,
  annotated,
  handleHighlightClick,
}) {
  const [showHighlight, setShowHighlight] = React.useState(true);
  return (
    <Paper
      sx={{
        p: 2,
        fontSize: "1.1rem",
        textAlign: "left",
      }}
    >
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
      >
        {showHighlight ? (
          <Box onClick={() => setShowHighlight(false)}>
            {" "}
            <ConceptOnIcon />{" "}
          </Box>
        ) : (
          <Box onClick={() => setShowHighlight(true)}>
            {" "}
            <ConceptOffIcon />
          </Box>
        )}
      </Stack>

      <Divider sx={{ my: 1 }} />

      <HighlightText
        text={note.text}
        nIndex={note.index}
        highlights={note.info}
        currentHighlight={concept}
        annotated={annotated}
        onHighlightClick={handleHighlightClick}
        isShowHighlight={showHighlight}
      />
    </Paper>
  );
}
