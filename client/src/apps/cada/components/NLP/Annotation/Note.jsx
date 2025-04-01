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

const StyledBadgeCross = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -8,
    top: -12,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 3px",
    backgroundColor: "rgba(155, 89, 182, 0.8)",
  },
}));

const temp = {
  10: [1, 2, 3, 6, 9],
  11: [0, 1, 2, 4, 5, 6, 8, 9, 10, 11, 12],
  12: [0, 1, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16],
  13: [0, 1, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14],
  14: [0, 7, 11, 12, 13, 14, 15, 16],
  15: [4, 5, 7, 8, 9, 10, 11, 12, 13, 14],
  16: [0, 1, 3, 4, 5, 6, 7, 8, 9],
  17: [3, 6, 7],
  18: [0, 1, 4, 5, 6, 8, 9, 10],
  19: [0, 2, 3, 6, 7, 8, 9, 11, 12, 13, 14],
  20: [1, 8, 9, 10, 11, 13],
  21: [0, 4, 9, 10, 11],
  22: [1, 6, 8, 10, 11],
  23: [2, 4, 6],
  24: [1, 2, 3, 6, 7],
  25: [4, 5, 7, 9, 10, 12, 13, 14, 15],
  26: [0, 5, 8, 9],
  27: [0, 8, 11, 14, 15, 17, 18],
  28: [0],
  29: [2, 7, 10, 11],
  30: [0, 5, 6, 7, 8, 9, 10],
  31: [0, 2, 3],
  32: [4, 5, 7, 11, 12, 13],
  33: [1, 2, 4, 5, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  34: [4, 5, 6, 11, 12, 13, 14, 15],
  35: [0, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  36: [3, 6, 7, 12],
  37: [1, 2, 11, 12, 13, 14],
  38: [3, 8, 13, 14, 16],
  39: [3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  40: [0, 6, 8, 9, 11],
  41: [12, 13, 14, 15, 16, 17, 18],
  42: [10, 11, 13, 14],
  43: [8, 12],
  44: [0, 1, 6, 7, 8, 10, 11, 12],
  45: [8, 9, 10, 11],
  46: [1, 2, 3, 4, 5, 6, 8, 10, 12],
  47: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11],
  48: [1, 2, 3, 5, 6, 7, 10],
  49: [0, 1, 2, 3, 5, 6, 9, 10],
  50: [7],
  51: [9, 10, 11],
  52: [7, 8],
  53: [6, 9],
  54: [8, 9],
  55: [5, 7],
  56: [6, 7, 8],
  57: [2],
  58: [1, 5, 6, 7, 8, 9, 10, 11],
  59: [1, 3, 4, 5, 6, 7, 10, 12],
  60: [3, 5, 6, 8, 9, 10, 11],
  61: [0, 1, 2, 3, 4, 8],
  62: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17],
  63: [0, 1, 2, 3, 4, 5, 6, 7],
  64: [1, 2, 5, 6, 7, 8, 10, 11, 12, 13, 16, 18],
  65: [0, 1, 3, 4, 8, 9],
  66: [0, 7, 8, 9, 11],
  67: [1, 2, 3, 4, 5, 6, 8, 9],
  68: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 13],
  69: [10],
  70: [0, 2, 4, 7],
  71: [3, 4, 5, 6],
  72: [2, 3, 4, 6, 8, 9, 10, 12],
  73: [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 12],
  74: [0, 1, 3, 6, 7, 8, 9, 10, 11, 12],
  75: [1, 6, 15, 16, 17],
  76: [0, 3, 4, 6, 7, 8, 9, 10, 11],
  77: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16],
  78: [0, 3, 4, 8, 14],
  79: [0, 4, 6, 10],
  80: [2, 3, 4, 7, 10, 11],
  81: [0, 2, 6, 7],
  82: [4, 5, 6, 7, 8, 9, 10],
  83: [0, 3, 5, 7, 8, 9, 11],
  84: [0, 7, 8, 14, 15, 16],
  85: [1, 6, 7, 8, 9, 10, 11, 13],
  86: [2, 3, 4, 9, 10, 11, 12, 16, 17],
  87: [2, 5, 9, 11],
  88: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11],
  89: [1, 2, 3, 4, 5, 7, 12, 13],
  90: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15],
  91: [0, 1, 2, 4, 6, 7, 8, 9, 12, 13],
  92: [0, 3, 4, 5, 6, 7],
  93: [3, 4, 7, 8, 9, 11],
  94: [6, 11, 13],
  95: [1, 7, 8, 9],
  96: [2, 3],
  97: [0, 1, 2, 3, 4],
  98: [0, 3, 5, 6, 7, 8, 9, 10, 12, 13],
  99: [0, 3, 9, 12, 13],
  100: [2, 3, 4, 10, 12],
  101: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11],
  102: [0, 1, 2, 3, 4, 5, 6],
  103: [1, 2, 3, 7, 9, 10],
  104: [0, 2, 3, 4, 8, 10, 11],
  105: [1, 2, 3, 7, 10, 14],
  106: [0, 3, 4, 5, 6, 7, 8, 9],
  107: [0, 2, 3, 6, 7, 8, 9, 10],
  108: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  109: [1, 2, 4, 5, 6, 8, 9],
  110: [0, 2, 3, 4, 5, 6, 7, 8, 9, 12],
  111: [0, 2, 3, 4, 5, 7, 8, 13, 14, 15, 16],
  112: [3, 5, 6, 7, 8, 9, 10],
  113: [0, 1, 2, 4, 5, 8],
  114: [0, 1, 4, 5, 7, 8],
  115: [0, 1, 2, 3, 7, 9, 10, 11, 13, 15, 16],
  116: [0, 1, 3, 4, 5, 6, 8, 10],
  117: [0, 1, 2, 3, 4, 5, 6, 9, 10, 11, 12],
  118: [2, 3, 5, 7, 8, 10, 11],
  119: [1, 2, 5, 6, 8, 9, 10, 11, 12],
  120: [0, 3, 6, 7, 8, 10],
  121: [0, 1, 2, 3, 4, 5, 6, 14],
  122: [0, 1, 2, 6, 7, 8, 11, 12],
  123: [0, 1, 2, 4, 6, 7],
  124: [0, 2, 3, 5, 10, 11],
  125: [0, 1, 2, 3, 9],
  126: [2, 4, 7, 8, 10],
  127: [0, 1, 2, 6, 7, 8],
  128: [2, 3, 5, 8, 11],
  129: [1, 3, 4, 5, 6, 7, 8],
  130: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14],
  131: [0, 3, 4, 6, 7, 8, 9, 10],
  132: [2, 7, 9, 10],
  133: [2, 3, 5, 6, 8, 9, 10],
  134: [1, 2, 5, 7, 8, 9, 10, 11, 13],
  135: [0, 1, 3, 6, 7, 8],
  136: [3, 6, 7, 9],
  137: [0, 2, 3, 4, 6, 7, 8],
  138: [0, 1],
  139: [0, 1, 2, 3, 4, 5, 6, 10, 12, 13],
  140: [2, 4, 6, 9, 10],
  141: [7, 8],
  142: [0, 1, 2, 3, 4, 5],
  143: [0, 1, 3, 5, 8],
  144: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16],
  145: [0, 2, 4, 5, 7, 8, 9, 10, 11],
  146: [0, 1, 2, 3, 5, 11, 12],
  147: [0, 1, 2, 3, 4, 6, 7, 8, 10],
  148: [0, 1, 2, 4, 5, 8, 12],
  149: [4, 12, 13, 14, 15],
  150: [1, 2, 6, 7, 8, 9, 10, 11],
  151: [1, 4, 6, 9, 10, 12, 13, 14],
  152: [1, 6, 7, 11, 12, 16, 18, 20, 23, 24, 25, 28, 29, 30, 31, 34],
  153: [
    0, 3, 5, 7, 12, 13, 15, 16, 17, 23, 25, 26, 27, 28, 29, 33, 35, 36, 38, 39,
    41, 42, 43, 45, 46, 50, 52, 53, 55, 61, 68, 69, 70, 71, 72, 73, 75,
  ],
  154: [
    0, 1, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 24, 26,
    27, 28, 29, 30, 32, 33,
  ],
  155: [7, 12, 13, 16, 17, 18, 20, 21, 26, 27, 29, 32, 34, 35, 39, 40],
  156: [
    0, 6, 7, 9, 10, 12, 13, 14, 17, 18, 22, 26, 28, 29, 31, 33, 35, 36, 37, 38,
    39, 40, 41, 42,
  ],
  157: [
    0, 4, 6, 7, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 31, 32, 33, 34, 35, 37, 40, 41, 42, 45, 47, 48,
  ],
  158: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 24, 25,
    26, 28, 29, 30, 36, 37, 38,
  ],
  159: [
    2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 18, 20, 23, 24, 26, 27, 28,
    29, 30, 31, 32, 33, 39, 42, 43, 47, 49, 50,
  ],
};

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
                {ln.substring(start, conceptLines[index + 1][start][0].end)}
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
                      ) : temp[nIndex] &&
                        temp[nIndex].includes(
                          conceptLines[index + 1][start][eIndx].concept_id
                        ) ? (
                        <StyledBadgeCross badgeContent="✘" />
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
