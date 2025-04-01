import React, { useEffect, useState, useRef } from "react";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";
import { CustomChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { Paper, Typography } from "@mui/material";

const categoryHeight = 20; // Fixed height for each category

// Render item function
function renderItem(params, api) {
  var categoryIndex = api.value(0);
  var start = api.coord([api.value(1), categoryIndex]);
  var end = api.coord([api.value(2), categoryIndex]);
  var height = api.size([0, 1])[1] * 0.6;
  var rectShape = echarts.graphic.clipRectByRect(
    {
      x: start[0],
      y: start[1] - height / 2,
      width: end[0] - start[0],
      height: height,
    },
    {
      x: params.coordSys.x,
      y: params.coordSys.y,
      width: params.coordSys.width,
      height: params.coordSys.height,
    }
  );
  return (
    rectShape && {
      type: "rect",
      transition: ["shape"],
      shape: rectShape,
      style: api.style(),
    }
  );
}

const MyEChartComponent = (props) => {
  const chartRef = useRef(null);
  const [chartHeight, setChartHeight] = useState("300px"); // Initial chart height

  //all categories unique
  const uniqueCategories = [
    ...new Set(props.data.map((item) => item.specimen_id)),
  ];
  console.log(uniqueCategories);

  useEffect(() => {
    // Importing necessary modules
    echarts.use([
      TitleComponent,
      TooltipComponent,
      GridComponent,
      DataZoomComponent,
      CustomChart,
      CanvasRenderer,
    ]);

    // Initialize chart
    const myChart = echarts.init(chartRef.current);

    // Calculate the total chart height
    const totalHeight = uniqueCategories.length * categoryHeight;
    setChartHeight(`${Math.max(totalHeight, 300)}px`); // Set a minimum height of 300px

    const chartData = [];
    // Process data for ECharts
    for (let i = 0; i < props.data.length; i++) {
      if (uniqueCategories.includes(props.data[i].specimen_id)) {
        chartData.push({
          name: props.data[i].specimen_id,
          value: [
            uniqueCategories.indexOf(props.data[i].specimen_id),
            new Date(props.data[i].charttime).getTime(),
            new Date(props.data[i].storetime).getTime(),
            new Date(props.data[i].storetime).getTime() -
              new Date(props.data[i].charttime).getTime(),
          ],
          itemStyle: {
            normal: {
              color:
                uniqueCategories.indexOf(props.data[i].specimen_id) % 2 === 0
                  ? "#7b9ce1"
                  : "#bd6d6c",
            },
          },
        });
      }
    }

    const startTime = Math.min(...chartData.map((d) => d.value[1]));

    // ECharts option setup
    var option = {
      tooltip: {
        formatter: function (params) {
          const dataObj = props.data[params.dataIndex];
          return `
                <div>
                    <p><b>Lab specimen:</b> ${dataObj.specimen_id}</p>
                    <p><b>Chart Time:</b> ${dataObj.charttime}</p>
                    <p><b>Store Time:</b> ${dataObj.storetime}</p>
                    <p><b>HADM ID:</b> ${dataObj.hadm_id}</p>
                </div>
            `;
        },
      },
      dataZoom: [
        {
          type: "inside",
          filterMode: "filter",
        },
      ],
      xAxis: {
        min: startTime,
        scale: true,
        axisLabel: {
          formatter: function (val) {
            //return only the month and day
            return new Date(val).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          },
        },
      },
      yAxis: {
        data: uniqueCategories,
        // wrap the label
        axisLabel: {
          formatter: function (value) {
            return echarts.format.truncateText(
              value,
              100,
              "10px Microsoft Yahei",
              "…"
            );
          },
        },
      },
      series: [
        {
          type: "custom",
          renderItem: renderItem,
          itemStyle: {
            opacity: 0.8,
          },
          encode: {
            x: [1, 2],
            y: 0,
          },
          data: chartData,
        },
      ],
    };

    // Render the chart
    myChart.setOption(option);
  }, [props.data]);

  useEffect(() => {
    console.log(chartHeight);
    const myChart = echarts.getInstanceByDom(chartRef.current);
    myChart.resize({ height: chartHeight });
  }, [chartHeight]);

  return (
    <Paper>
      <div ref={chartRef} style={{ height: chartHeight }} />
    </Paper>
  );
};

export default MyEChartComponent;
