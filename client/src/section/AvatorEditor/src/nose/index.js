import React from "react";

import Long from "./Long";
import Short from "./Short";
import Round from "./Round";

export default function nose (props) {
  const { style } = props;
  switch (style) {
    case "long": return <Long />;
    case "round": return <Round />;
    case "short":
    default:
      return <Short />;
  }
}
