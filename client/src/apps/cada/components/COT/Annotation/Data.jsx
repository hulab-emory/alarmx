import { Divider, Paper } from '@mui/material';
import React from 'react';
import TokenTable from './Table';
import { IoIosInformationCircle } from "react-icons/io";
import Tooltip from './Tooltip';

const description = "Tokens can be seen as events. A Co-Occurring Token (COT) is a combo of events occurring “together”. We checked electronic records from patients who had ARDS onsets and identified the COTs. For each patient, we extracted lab test results in a 24-hour window preceding the ARDS onset, and vital signs records and ventilation settings/measurements in a 12-hour window preceding the ARDS onset. With the extracted records and the demographic information, we discovered some combos of events that would present frequently before ARDS onsets, these combos were our COTs. In one sentence, a COT is a combo of events that happen to occur together frequently in a certain time window before ARDS onsets.";

export default function DataPanel({ patterns, selectedTokens }) {

  const headers = [
    {
      name: "tokens",
      align: "left",
      label: "Token"
    },
    {
      name: "sources",
      align: "left",
      label: "Source"
    },
    {
      name: "rr",
      align: "left",
      label: "Reference Range"
    }
  ];

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        // mr: 3,
        fontSize: "1.1rem",
        textAlign: "left",
        width: "100%",
      }}
    >
      {/* token table */}
      <div className="token-table" id="token-table" style={{ display: "flex", overflow: "visible", scrollbarWidth: "none", msOverflowStyle: "none", width: "100%" }}>
        <div className="table">
          <div>Pattern A</div>
          <Divider sx={{ my: 1 }} />
          <TokenTable
            headers={headers}
            tokens={patterns[0]}
            otherTokens={patterns[1]}
            selectedTokens={selectedTokens}
          />
        </div>
        <Divider orientation='vertical' variant="middle" flexItem />
        <div className="table">
          <div className="pattern-name" style={{ marginLeft: "16px" }}>Pattern B
            <Tooltip description={description} placement="left" width="400px" style={{ fontSize: "15px" }}>
              <IoIosInformationCircle style={{ color: "grey" }} />
            </Tooltip>
          </div>
          <Divider sx={{ my: 1 }} />
          <TokenTable
            headers={headers}
            tokens={patterns[1]}
            otherTokens={patterns[0]}
            selectedTokens={selectedTokens}
          />
        </div>
      </div>

      <style>
        {`
          #token-table::-webkit-scrollbar {
            display: none;
          }

          .table {
            width: 100%;
            padding: 10px;
            border-radius: 15px;
            transition: 0.3s;
          }

          .table .pattern-name {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .table:hover {
            background-color: rgba(166, 255, 199, 0.1);
          }
        `}
      </style>
    </Paper>
  )
}
