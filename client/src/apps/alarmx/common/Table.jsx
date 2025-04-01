import React, { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  styled,
  alpha,
  tableCellClasses,
  Popover,
  Typography,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import { AiOutlineMore, AiOutlineLink, AiOutlineSelect } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

// Styled components for table styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.common.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.secondary.light, 0.1),
  },
  "&:last-child td, &:last-child th": {
    border: "solid 1",
  },
}));

const IconWrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(1),
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

export const CommonTable = ({ table, headers, data, columns, showDetails }) => {
  const navigate = useNavigate();
  const hasActions = typeof showDetails === "function";
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverData, setPopoverData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [popoverType, setPopoverType] = useState(null);

  const handleIconClick = useCallback(async (event, value, type) => {
    if (type === "person") return navigate(`/ive/person/${value}`);
    if (type === "visit_occurrence") return navigate(`/ive/visit_occurrence/${value}`);

    setAnchorEl(event.currentTarget);
    setSelectedValue(value);
    setPopoverType(type);

    if (popoverData[value]) return;

    setLoading(true);
    try {
      const apiEndpoints = {
        concept: `https://athena.ohdsi.org/api/v1/concepts/${value}`,
        person: `/api/omop/person/${value}`,
        visit_occurrence: `/api/omop/visit_occurrence/${value}`,
      };

      const response = await fetch(apiEndpoints[type]);
      const data = await response.json();
      setPopoverData((prev) => ({ ...prev, [value]: data }));
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
    } finally {
      setLoading(false);
    }
  }, [navigate, popoverData]);

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedValue(null);
    setPopoverType(null);
  };

  const formatDate = (dateString) => new Date(dateString).toISOString().split("T")[0];

  const formatKey = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Table>
      <TableHead>
        <TableRow>
          {headers
          .filter((header) => columns.includes(header.toLowerCase().replace(/ /g, "_")))
          .map((header, index) => (
            <StyledTableCell key={index}>{header}</StyledTableCell>
          ))}
          {hasActions && <StyledTableCell>DETAIL</StyledTableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, rowIndex) => (
          <StyledTableRow key={rowIndex}>
            {columns.map((key, cellIndex) => {
              const value = row[key];
              const isInteractive =
                Boolean(value) &&
                ((key === "person_id" || key === "visit_occurrence_id") || key.endsWith("_concept_id"));

              return (
                <StyledTableCell key={cellIndex}>
                  {isInteractive ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      {value}
                      {["person_id", "visit_occurrence_id"].includes(key) ? (
                        <AiOutlineSelect
                          size={14}
                          style={{ cursor: "pointer", color: "#009be5", transform: "rotate(90deg)" }}
                          onClick={(event) =>
                            handleIconClick(event, value, key === "person_id" ? "person" : "visit_occurrence")
                          }
                        />
                      ) : (
                        <AiOutlineLink
                          size={14}
                          style={{ cursor: "pointer", color: "#1abc9c" }}
                          onClick={(event) => handleIconClick(event, value, "concept")}
                        />
                      )}
                    </div>
                  ) : (
                    value
                  )}
                </StyledTableCell>
              );
            })}
            {hasActions && (
              <StyledTableCell>
                <IconWrapper onClick={() => showDetails(row)}>
                  <AiOutlineMore size={20} />
                </IconWrapper>
              </StyledTableCell>
            )}
          </StyledTableRow>
        ))}
      </TableBody>

      {/* Popover for person_id, visit_occurrence_id, or concept_id */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <div style={{ padding: "12px", maxWidth: "350px" }}>
          {loading ? (
            <CircularProgress size={20} />
          ) : selectedValue && popoverData[selectedValue] ? (
            <>
              {popoverType === "concept" ? (
                <>
                  <Typography variant="body1"><strong>{popoverData[selectedValue].name}</strong></Typography>
                  <br/>
                  <Typography variant="body2"><strong>Domain:</strong>{popoverData[selectedValue].domainId}</Typography>
                  <Typography variant="body2"><strong>Class:</strong>{popoverData[selectedValue].conceptClassId}</Typography>
                  <Typography variant="body2"><strong>Vocabulary:</strong>{popoverData[selectedValue].vocabularyName}</Typography>
                  <Typography variant="body2"><strong>Concept Code:</strong>{popoverData[selectedValue].conceptCode}</Typography>
                  <Typography variant="body2"><strong>Valid Start:</strong>{formatDate(popoverData[selectedValue].validStart)}</Typography>
                  <Typography variant="body2"><strong>Valid End:</strong>{formatDate(popoverData[selectedValue].validEnd)}</Typography>
                  <Typography variant="body2"><strong>Status:</strong>{popoverData[selectedValue].invalidReason}</Typography>
                </>
              ) : (
                Object.entries(popoverData[selectedValue]).map(([key, value], i) => (
                  <Typography key={i} variant="body2" style={{ marginBottom: "6px" }}>
                    <strong>{formatKey(key)}:</strong> {Array.isArray(value) ? value.join(", ") : value || "N/A"}
                  </Typography>
                ))
              )}
            </>
          ) : (
            <Typography variant="body2" color="error">
              No data available
            </Typography>
          )}
        </div>
      </Popover>
    </Table>
  );
};

CommonTable.propTypes = {
  table: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  showDetails: PropTypes.func,
};

CommonTable.defaultProps = {
  showDetails: null,
};