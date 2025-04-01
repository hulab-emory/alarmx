import React, { memo, useCallback } from "react";
import Canvas from "../../../utils/canvasJS";

const Charts = ({
  fastbinWaveforms,
  leadOrder,
  viewportInterval,
  onClick,
  filename,
  getChartObj,
}) => {
  const organizeDataPoints = useCallback((data, secsPerTick) => {
    let secsPerPoint = 0;
    let highestDataPoint = 0;
    let smallestDataPoint = 0;

    if (data[0] !== null && typeof data[0] !== "undefined") {
      smallestDataPoint = data[0];
      highestDataPoint = data[0];
    }

    let array = [];
    for (let i = 0; i < data.length; i++) {
      secsPerPoint = secsPerPoint + secsPerTick;
      highestDataPoint =
        data[i] > highestDataPoint && data[i] !== -1.7e308
          ? data[i]
          : highestDataPoint;
      smallestDataPoint =
        data[i] < smallestDataPoint && data[i] !== -1.7e308
          ? data[i]
          : smallestDataPoint;
      array.push({
        x: secsPerPoint,
        y: data[i] === -1.7e308 ? "" : data[i],
      });
    }
    let interval =
      (highestDataPoint > 0 ? highestDataPoint : -highestDataPoint) +
      (smallestDataPoint > 0 ? smallestDataPoint : -smallestDataPoint);
    return [array, interval, highestDataPoint, smallestDataPoint];
  }, []);

  let charts = [];
  let primaryCharts = [];
  let secondaryCharts = [];

  if (fastbinWaveforms && fastbinWaveforms.WaveformData) {
    for (let i = 0; i < fastbinWaveforms.WaveformData.length; i++) {
      let chartsArray = secondaryCharts;

      let data = organizeDataPoints(
        fastbinWaveforms.WaveformData[i].Samples,
        1 / fastbinWaveforms.TicksPerSec
      );

      if (leadOrder.length > 0) {
        for (let j = 0; j < leadOrder.length; j++) {
          if (fastbinWaveforms.WaveformData[i].Channel === leadOrder[j]) {
            chartsArray = primaryCharts;
            break;
          }
        }
      }

      chartsArray.push(
        <Canvas
          key={i}
          config={{
            zoomEnabled: true,
            animationEnabled: true,
            zoomType: "x",
            rangeChanged: viewportInterval,
            title: {},
            axisY: {
              title: fastbinWaveforms.WaveformData[i].Channel,
              titleFontSize: 12,
              titleFontColor: "black",
              titleFontFamily: "verdana",
              labelFontColor: "#",
              maximum: data[2] * 1.01,
              minimum: data[3],
              gridThickness: 0,
              gridColor: "rgba(239, 154, 154, 0.3)",
              lineThickness: 1,
              lineColor: "rgba(239, 154, 154, 0.3)",
              tickThickness: 0,
              margin: 0,
              tickLength: 0,
              includeZero: false,
              labelMaxWidth: 0,
              valueFormatString: " ",
              stripLines: [
                {
                  value: data[3] + data[1] / 3,
                  color: "rgba(239, 154, 154, 0.3)",
                  thickness: 1,
                },
                {
                  value: data[3] + (data[1] / 3) * 2,
                  color: "rgba(239, 154, 154, 0.3)",
                  thickness: 1,
                },
                {
                  value: data[3] + (data[1] / 3) * 3,
                  color: "rgba(239, 154, 154, 0.3)",
                  thickness: 1,
                },
              ],
            },
            axisX: {
              labelFontSize: 12,
              labelFontColor: "black",
              gridThickness: 1,
              gridColor: "rgba(239, 154, 154, 0.3)",
              lineThickness: 1,
              lineColor: "rgba(239, 154, 154, 0.3)",
              tickThickness: 0,
              margin: -10,
              interval: 0.2,
              valueFormatString: " ",
              stripLines: [],
            },
            toolTip: {
              contentFormatter: function (e) {
                return (
                  "<strong>Value: " +
                  e.entries[0].dataPoint.y +
                  "</strong></br>" +
                  Math.round(e.entries[0].dataPoint.x * 10) / 10 +
                  " seconds"
                );
              },
            },
            legend: {
              verticalAlign: "top",
              horizontalAlign: "right",
              cursor: "pointer",
            },
            data: [
              {
                type: "line",
                lineThickness: 1,
                color: "#2980b9",
                name: fastbinWaveforms.WaveformData[i].Channel,
                click: onClick,
                dataPoints: data[0],
              },
            ],
          }}
          hideToolbar={true}
          filename={filename}
          chartObjCallback={getChartObj}
          height="100px"
        />
      );
    }

    charts = primaryCharts.concat(secondaryCharts);
    return <div>{charts}</div>;
  } else return "";
};

const areEqual = (prevProps, nextProps) => {
  return prevProps.fastbinWaveforms === nextProps.fastbinWaveforms;
};

export default memo(Charts, areEqual);
