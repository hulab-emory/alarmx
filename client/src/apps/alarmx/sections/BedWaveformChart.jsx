import * as React from "react";
import Chart from "./WaveformChart";
import { useState } from "react";
import useDidMountEffect from "../../../hooks/useDidMountEffect";

export default function BasicCard() {
  const [resetButtonVisibility, setResetButtonVisibility] = useState(false);
  const [chartObjects, setChartObjects] = React.useState([]);
  const [selectedRanges, setSelectedRanges] = React.useState({});

  const getChartObj = (obj, type) => {
    if (type === "add") {
      setChartObjects((chartObjects) => [...chartObjects, obj]);
    } else if (type === "remove") {
      setChartObjects((chartObjects) => {
        let copy = Object.assign([], chartObjects);

        for (let i = 0; i < copy.length; i++) {
          if (copy[i] === obj) {
            copy.splice(i, 1);
          }
        }
        return copy;
      });
    }
  };

  const onSelectRange = (e) => {
    if (resetButtonVisibility === false) {
      setSelectedRanges({
        ...selectedRanges,
        min: e.axisX[0].viewportMinimum,
        max: e.axisX[0].viewportMaximum,
      });
      setResetButtonVisibility(true);
    }
  };

  useDidMountEffect(() => {
    if (chartObjects) {
      let charts = chartObjects;
      for (let i = 0; i < charts.length; i++) {
        charts[i].options.axisX.viewportMinimum = selectedRanges.min;
        charts[i].options.axisX.viewportMaximum = selectedRanges.max;
        charts[i].render();
        if (charts[i]._zoomButton.getAttribute("state") === "pan") {
          charts[i]._zoomButton.click();
        }
      }
    }
  }, [selectedRanges]);

  return (
    <>
      <Chart
        leadOrder={[]}
        range={30}
        fileLength={30}
        completedTab={true}
        viewportInterval={onSelectRange}
        getChartObj={getChartObj}
        filename={"/afib/test2.adibin"}
        nextFilename={"/afib/test2.adibin"}
      />
    </>
  );
}
