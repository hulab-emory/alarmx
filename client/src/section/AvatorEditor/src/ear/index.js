import React, { Fragment } from "react";

import EarSmall from "./Small";
import EarBig from "./Big";

export default function Ear(props) {
  const { color, size="small" } = props;
  return (
    <Fragment>
      {size === "small" &&
        <EarSmall color={color} />
      }
      {size === "big" &&
        <EarBig color={color} />
      }
    </Fragment>
  );
}
