import { Divider } from '@mui/material'
import React from 'react'
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';

const zoomOptions = [25, 50, 75, 100];

export default function DataPanel({ filePath, fileName }) {

  const [zoom, setZoom] = React.useState(1);

  const handleZoomIn = () => {
    setZoom(curr => curr > zoomOptions.length - 2 ? curr : curr + 1);
  }

  const handleZoomOut = () => {
    setZoom(curr => curr < 1 ? curr : curr - 1);
  }

  return (
    <>
      <div className="img-toolbar">
        <div className="title">
          {fileName || filePath?.split('/')?.pop()}
        </div>
        <div className="action-btns">
          <div className="img-btn" onClick={handleZoomOut}>
            <AiOutlineZoomOut />
          </div>
          <div className="img-btn" onClick={handleZoomIn}>
            <AiOutlineZoomIn />
          </div>
        </div>
      </div>
      <Divider />
      <div className="img">
        <img src={filePath} style={{width: `${zoomOptions[zoom]}%`, height: `auto`}} alt='' />
      </div>
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

          .img-toolbar .action-btns {
            display: flex;
            flex-direction: row-reverse;
            justify-content: flex-start;
            cursor: pointer;
          }

          .img-toolbar div {
            margin: 0 10px;
            width: fit-content;
            display: flex;
            justify-content: center;
            align-items: center;
            color: grey;
          }

          .img {
            background-color: white;
            height: calc(100vh - 303px);
            width: 100%;
            overflow: scroll;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
    </>
  )
}
