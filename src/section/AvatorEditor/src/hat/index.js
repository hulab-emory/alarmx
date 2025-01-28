import React from "react";

import Turban from "./Turban";
import Beanie from "./Beanie";

export default function hat(props) {
  const { style, color } = props;
  switch (style) {
    case "beanie": return <Beanie color={color} />;
    case "turban": return <Turban color={color} />;
    case "none":
    default:
      return null;
  }
}
