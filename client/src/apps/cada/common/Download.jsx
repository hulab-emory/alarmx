import React from "react";
import { IconButton } from "@mui/material";
import CsvDownload from "react-json-to-csv";
import { MdGetApp } from "react-icons/md";

export const Download = ({ data }) => {
  return (
    <CsvDownload
      data={data.flat()}
      filename="data.csv"
      style={{
        border: "none",
        float: "right",
        backgroundColor: "rgba(0,0,0,0)",
        borderRadius: 0,
        padding: 0,
      }}
    >
      <IconButton component="span" color="primary">
        <MdGetApp />
      </IconButton>
    </CsvDownload>
  );
};
