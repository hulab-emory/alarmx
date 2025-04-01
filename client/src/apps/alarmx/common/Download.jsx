import React from "react";
import { IconButton } from "@mui/material";
import CsvDownload from "react-json-to-csv";
import { MdGetApp as DownloadIcon} from "react-icons/md";

export const Download = ({ data }) => {
  return (
    <CsvDownload
      data={data}
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
        <DownloadIcon />
      </IconButton>
    </CsvDownload>
  );
};
