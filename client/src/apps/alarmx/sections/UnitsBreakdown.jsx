import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import {
  TooltipComponent,
  GridComponent,
  LegendComponent
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import {
  AppBar,
  Box,
  Container,
  Stack,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import { AiFillAlert, AiFillCalendar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
]);

export default function UnitsPage({selectedUnit}) {

  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const units = [
    "ICU 1",
    "ICU 2",
    "Med Surg A",
    "Med Surg B",
    "ER",
    "OR",
    "PACU"
  ];

  const sources = [
    "Heart Rate",
    "SpO2",
    "Blood Pressure",
    "Respiration",
    "Device Disconnect"
  ];

  // Generate random stacked data for each source/unit
  const stackedData = sources.map((source) => {
    return {
      name: source,
      type: "bar",
      stack: "total",
      label: { show: true },
      emphasis: { focus: "series" },
      data: units.map(() => Math.floor(100 + Math.random() * 500))
    };
  });

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);

      chartInstance.current.setOption({
        title: {},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          bottom: 0
        },
        grid: {
          top: 30,
          left: "3%",
          right: "3%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: units
        },
        series: stackedData
      });

      // Add click handler
      const handleClick = (params) => {
        const unit = params.name;
        if (unit && selectedUnit?.date) {
          navigate(`/alarmx/unit?unit=${encodeURIComponent(unit)}&date=${encodeURIComponent(selectedUnit.date)}&count=${encodeURIComponent(selectedUnit.count)}`);
        }
      };

      chartInstance.current.on("click", handleClick);

      const handleResize = () => chartInstance.current.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chartInstance.current.off("click", handleClick);
        chartInstance.current.dispose();
      };
    }
  }, [selectedUnit.date]);
  
  return (
    <>
      <AppBar
        sx={{ bgcolor: "transparent", mt: 5 }}
        position="static"
        color="inherit"
        elevation={0}
      >
        <Typography variant="h4">Units </Typography>
        <Stack direction="row" spacing={1} >
          <IconButton color="secondary">
            <AiFillCalendar size={20} />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {" "}
              {selectedUnit.date}
            </Typography>
          </IconButton>
          <IconButton color="success">
            <AiFillAlert size={20} />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {" "}
              {selectedUnit.count}
            </Typography>
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <ToggleButtonGroup>
            <ToggleButton value="level"> Level</ToggleButton>
            <ToggleButton value="type">Type</ToggleButton>
            <ToggleButton value="device">Device</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </AppBar>

      <Box
        ref={chartRef}
        sx={{
          width: "100%",
          height: "400px",
          marginTop: "2rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      />
    </>
  );
}
