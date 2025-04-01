import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Paper } from "@mui/material";
import { green } from "@mui/material/colors";

const VitalsChart = (props) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartData = {
      weight: [],
      bloodPressureSystolic: [],
      bloodPressureDiastolic: [],
      bmi: [],
      dates: [],
    };

    props.data.forEach((item) => {
      const dateIndex = chartData.dates.indexOf(item.chartdate);
      if (dateIndex === -1) {
        chartData.dates.push(item.chartdate);
        chartData.weight.push(null);
        chartData.bloodPressureSystolic.push(null);
        chartData.bloodPressureDiastolic.push(null);
        chartData.bmi.push(null);
      }
      const currentIndex = chartData.dates.indexOf(item.chartdate);

      if (item.result_name === "Weight (Lbs)") {
        chartData.weight[currentIndex] = parseFloat(item.result_value);
      } else if (item.result_name === "Blood Pressure") {
        const [systolic, diastolic] = item.result_value.split("/").map(Number);
        chartData.bloodPressureSystolic[currentIndex] = systolic;
        chartData.bloodPressureDiastolic[currentIndex] = diastolic;
      } else if (item.result_name === "BMI (kg/m2)") {
        chartData.bmi[currentIndex] = parseFloat(item.result_value);
      }
    });

    const myChart = echarts.init(chartRef.current);
    const option = {
      title: {
        text: "Vitals",
        left: "left",
        textStyle: {
          fontSize: 16,
          color: green[500],
        },
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Weight (Lbs)", "BP Systolic", "BP Diastolic", "BMI (kg/m2)"],
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: chartData.dates,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Weight (Lbs)",
          type: "line",
          data: chartData.weight,
        },
        {
          name: "BP Systolic",
          type: "line",
          data: chartData.bloodPressureSystolic,
        },
        {
          name: "BP Diastolic",
          type: "line",
          data: chartData.bloodPressureDiastolic,
        },
        {
          name: "BMI (kg/m2)",
          type: "line",
          data: chartData.bmi,
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [props.data]);

  return (
    <Paper sx={{ marginTop: 2 }}>
      <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>
    </Paper>
  );
};

export default VitalsChart;
