import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import "react-pdf/dist/esm/Page/TextLayer.css";
import { AiOutlineZoomIn, AiOutlineZoomOut, AiOutlineClose, AiOutlineExport } from 'react-icons/ai';
import { Divider } from '@mui/material';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function PDFViewer({ file, fileName, category }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);
  const [newWindow, setNewWindow] = useState(null);

  useEffect(() => {
    if (newWindow) {
      newWindow.location.href = `https://nursingdatascience.emory.edu${file}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleExport = () => {
    const windowRef = window.open(`https://nursingdatascience.emory.edu${file}`, "_blank");
    setNewWindow(windowRef);
    handleClose();
  }

  const handleZoomIn = () => {
    setScale(curr => curr + 0.2);
  };

  const handleZoomOut = () => {
    setScale(curr => curr - 0.2);
  };

  const handleClose = () => {
    let scrollBar = 0;
    const root = document.getElementById('root');
    if (root.scrollHeight > root.clientHeight) {
      scrollBar = 6;
    }
    const panelBox = document.getElementById('panel-box');
    // get the box's padding
    const style = window.getComputedStyle(panelBox);
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const resizableBox = document.getElementById("resizableBox");
    resizableBox.style.transition = "0.5s";
    resizableBox.style.width = `${window.innerWidth - padding - 15 - scrollBar}px`;
    setTimeout(() => {
      resizableBox.style.transition = "0.0s";
    }, 550);
  };

  return (
    <>
      <div className="pdf-toolbar">
        <div className="title">
          {category ?? 'N/A'} : {fileName}
        </div>
        <div className="action-btns">
          <div className="pdf-btn" onClick={handleClose}>
            <AiOutlineClose />
          </div>
          <div className="pdf-btn" onClick={handleExport}>
            <AiOutlineExport />
          </div>
          <div className="pdf-btn" onClick={handleZoomOut}>
            <AiOutlineZoomOut />
          </div>
          <div className="pdf-btn" onClick={handleZoomIn}>
            <AiOutlineZoomIn />
          </div>
        </div>
      </div>
      <Divider />
      <div style={{
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          style={{
            height: 100,
          }}
        >
          {Array.from(
            new Array(numPages),
            (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                scale={scale}
              />
            ),
          )}
        </Document>
      </div>
      <style>
        {`
          .react-pdf__Document {
            height: calc(100vh - 303px) !important;
            width: 100% !important;
            overflow: scroll !important;
          }

          .pdf-toolbar {
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

          .pdf-toolbar::-webkit-scrollbar {
            display: none;
          }

          .title {
            text-align: left;
            font-weight: bold;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .pdf-toolbar .title::-webkit-scrollbar {
            display: none;
          }

          .pdf-toolbar .action-btns {
            display: flex;
            flex-direction: row-reverse;
            justify-content: flex-start;
            cursor: pointer;
          }

          .pdf-toolbar div {
            margin: 0 10px;
            width: fit-content;
            display: flex;
            justify-content: center;
            align-items: center;
            color: grey;
          }
        `}
      </style>
    </>
  );
};
