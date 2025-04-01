import React from "react";

import Normal from "./Normal";
import Thick from "./Thick";
import Mohawk from "./Mohawk";
import WomanLong from "./WomanLong";
import WomanShort from "./WomanShort";

export default function hair(props) {
  const { style, color } = props;
  switch (style) {
    case "thick": return <Thick color={color} />;
    case "mohawk": return <Mohawk color={color} />;
    case "womanLong": return <WomanLong color={color} />;
    case "womanShort": return <WomanShort color={color} />;
    case "normal":
    default:
      return <Normal color={color} />;
  }
}
