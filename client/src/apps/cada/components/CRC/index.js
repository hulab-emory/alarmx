import React from "react";
import { useParams } from "react-router-dom";
import Annotation from "./Annotation";

function CRCEvaluation() {
  const params = useParams();
  return (
    <>
      <Annotation pid={parseInt(params.pid, 10)} />
    </>
  );
}

export default CRCEvaluation;