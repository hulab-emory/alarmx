import React from "react";

import Laugh from "./Laugh";
import Smile from "./Smile";
import Peace from "./Peace";

export default function mouth (props) {
  const { style } = props;
  switch (style) {
    case "laugh": return <Laugh />;
    case "smile": return <Smile />;
    case "peace":
    default:
      return <Peace />;
  }
}
