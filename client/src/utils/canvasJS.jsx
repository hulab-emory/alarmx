import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
var CanvasJS = require('./canvasjs.min');
CanvasJS = CanvasJS.Chart ? CanvasJS : window.CanvasJS;

const Canvas = (props) => {
  const [chart, setChart] = useState(null);
  const node = useRef(null);

  useEffect(() => {
    renderChart();

    return () => {
      if (chart) {
        chart.destroy();
        ReactDOM.unmountComponentAtNode(node.current);

        if (props.chartObjCallback) {
          props.chartObjCallback(chart, "remove");
        }
      }
    };
  }, []);

  useEffect(() => {
    if (chart && props.chartObjCallback) {
      props.chartObjCallback(chart, "add");
    }
    if (props.hideToolbar && chart) {
      chart._toolBar.style.display = "none";
    }
    chart && chart.render();
  }, [chart]);

  useEffect(() => {
    if (props.config && node.current) {
      renderChart();
    }
  }, [props.config, props.chartObjCallback, props.hideToolbar]);

  const renderChart = () => {
    if (chart) {
      chart.destroy();

      if (props.chartObjCallback) {
        props.chartObjCallback(chart, "remove");
      }
    }

    const newChart = new CanvasJS.Chart(node.current, props.config);
    setChart(newChart);
  };

  return (
    <div
      ref={node}
      style={{
        height: props.height,
        width: props.width,
        position: props.position,
      }}
    ></div>
  );
};

export default Canvas;
