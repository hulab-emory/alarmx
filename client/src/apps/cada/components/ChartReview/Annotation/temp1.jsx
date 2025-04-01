import { useRef, useEffect } from "react";

const getPixelRatio = (context) => {
  var backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  return (window.devicePixelRatio || 1) / backingStore;
};

const HorizontalStackedRangeChart = ({ data, options }) => {
  console.log("data", data);
  let ref = useRef();

  useEffect(() => {
    let canvas = ref.current;
    let ctx = canvas.getContext("2d");

    let ratio = getPixelRatio(ctx);
    let width = getComputedStyle(canvas)
      .getPropertyValue("width")
      .split("px")[0];
    let height = getComputedStyle(canvas)
      .getPropertyValue("height")
      .split("px")[0];

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Default options and override with provided options
    const defaultOptions = {
      leftPadding: 40,
      padding: 10,
      axisLabelCount: 5,
      barColors: ["#0E63E9", "#4CAF50"],
      ...options,
    };

    const allValues = data.flatMap((d) => d.ranges.flatMap((r) => r));
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    const actualWidth =
      canvas.width - defaultOptions.leftPadding - defaultOptions.padding * 3;
    const actualHeight = canvas.height - defaultOptions.padding * 3;
    const barHeight =
      (actualHeight - defaultOptions.padding) / data.length -
      defaultOptions.padding;

    let cy = defaultOptions.padding;
    data.forEach((d) => {
      d.ranges.forEach((range, index) => {
        let segmentStart =
          ((range[0] - minValue) / (maxValue - minValue)) * actualWidth +
          defaultOptions.leftPadding;
        let segmentEnd =
          ((range[1] - minValue) / (maxValue - minValue)) * actualWidth +
          defaultOptions.leftPadding;
        let segmentWidth = segmentEnd - segmentStart;

        ctx.fillStyle =
          defaultOptions.barColors[index % defaultOptions.barColors.length];
        ctx.fillRect(segmentStart, cy, segmentWidth, barHeight);
      });

      ctx.save();
      ctx.fillStyle = "#000";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(d.month, defaultOptions.leftPadding - 5, cy + barHeight / 2);
      ctx.restore();

      cy += barHeight + defaultOptions.padding;
    });

    // Draw x-axis
    ctx.beginPath();
    ctx.moveTo(
      defaultOptions.leftPadding,
      canvas.height - defaultOptions.padding
    );
    ctx.lineTo(
      canvas.width - defaultOptions.padding * 2,
      canvas.height - defaultOptions.padding
    );
    ctx.stroke();

    // Add x-axis labels
    for (let i = 0; i <= defaultOptions.axisLabelCount; i++) {
      let value =
        minValue + (i * (maxValue - minValue)) / defaultOptions.axisLabelCount;
      let x =
        ((value - minValue) / (maxValue - minValue)) * actualWidth +
        defaultOptions.leftPadding;
      ctx.fillText(
        value.toFixed(0),
        x,
        canvas.height - defaultOptions.padding / 2
      );
    }
  });

  return <canvas ref={ref} style={{ width: "400px", height: "200px" }} />;
};

export default HorizontalStackedRangeChart;
