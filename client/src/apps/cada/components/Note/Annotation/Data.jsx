import React from 'react';
import HighlightText from './HighlightText';
import { Divider } from '@mui/material';

export default function DataPanel({ note, selectedConcept, onHighlightClick, values, filename }) {

  return (
    <div>
      <div className="img-toolbar">
        <div className="title">
          {filename} ({note?.filename || ""})
        </div>
      </div>
      <Divider />
      {note && note?.info && <HighlightText
        text={note.text}
        highlights={note.info}
        selectedConcept={selectedConcept}
        onHighlightClick={onHighlightClick}
        values={values}
      />}
      <style>
        {`
          .img-toolbar {
            background-color: white;
            height: 53px;
            font-size: 20px;
            color: white;
            padding: 5px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            overflow: scroll;
            scrollbar-width: none;
          }

          .img-toolbar::-webkit-scrollbar {
            display: none;
          }

          .title {
            text-align: left;
            font-weight: bold;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .img-toolbar .title::-webkit-scrollbar {
            display: none;
          }

          .img-toolbar div {
            width: fit-content;
            display: flex;
            justify-content: center;
            align-items: center;
            color: grey;
          }
        `}
      </style>
    </div>
  )
}
