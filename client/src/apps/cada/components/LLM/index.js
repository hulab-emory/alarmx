import React from "react";
import { useParams } from "react-router-dom";
import Annotation from "./Annotation";

function LLmEvaluation() {
  const params = useParams();
  return (
    <>
      {params.role === "adjudicator" ? (
        <></>
      ) : (
        <Annotation pid={parseInt(params.pid, 10)} />
      )}
    </>
  );
}

export default LLmEvaluation;
