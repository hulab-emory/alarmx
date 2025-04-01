import React from "react";
import { useParams } from "react-router-dom";
import Annotation from "../ChartReview/Annotation";

function ChartReview() {
  const params = useParams();
  return (
    <>
      {params.role === "adjudicator" ? null : (
        <Annotation pid={parseInt(params.pid, 10)} />
      )}
    </>
  );
}

export default ChartReview;
