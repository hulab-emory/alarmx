import React from "react";
import { useParams } from "react-router-dom";
import Adjudication from "./Adjudication";
import Annotation from "./Annotation";

function WaveformSegmentFull() {
  const params = useParams();
  return (
    <>
      {params.role === "adjudicator" ? (
        <Adjudication pid={parseInt(params.pid, 10)} />
      ) : (
        <Annotation pid={parseInt(params.pid, 10)} />
      )}
    </>
  );
}

export default WaveformSegmentFull;
