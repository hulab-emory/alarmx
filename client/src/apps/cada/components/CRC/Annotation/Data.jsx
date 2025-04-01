import React from 'react'
import PDFViewer from './PDFViewer';

export default function DataPanel({ filePath, category }) {
  console.log(filePath)
  return (
    <>
      <PDFViewer
        file={`/api/cada/file/pdf?filename=${encodeURIComponent(filePath)}`}
        fileName={filePath.split('/').pop()}
        category={category}
      />
    </>
  )
}
