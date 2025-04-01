import React from "react";

import Round from "./Round";
import Square from "./Square";

export default function glasses(props) {
  const { style } = props;
  switch (style) {
    case "round": return <Round />;
    case "square": return <Square />;
    case "none":
    default:
      return null;
  }
}
