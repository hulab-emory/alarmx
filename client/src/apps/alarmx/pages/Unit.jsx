import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import * as echarts from "echarts/core";
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import {
  AppBar,
  Box,
  Container,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from "@mui/material";
import { AiFillAlert, AiFillCalendar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  BarChart,
  CanvasRenderer,
]);

export default function UnitPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const date = searchParams.get("date") || new Date().toLocaleDateString();
  const count = parseInt(searchParams.get("count"), 10) || 89652;

  // Generate fake bed-level data
  const bedCount = Math.floor(Math.random() * 5) + 15;
  const beds = Array.from({ length: bedCount }, (_, i) => `Bed ${i + 1}`);
  const alarmTypes = ["Heart Rate", "SpO2", "Respiration"];

  const generateStackedData = () => {
    const data = {
      "Heart Rate": [],
      SpO2: [],
      Respiration: [],
    };

    for (let i = 0; i < bedCount; i++) {
      const totalForBed = Math.floor(Math.random() * 4000 + 3000);
      const heart = Math.floor(totalForBed * Math.random() * 0.4);
      const spo2 = Math.floor(totalForBed * Math.random() * 0.3);
      const resp = totalForBed - heart - spo2;

      data["Heart Rate"].push(heart);
      data["SpO2"].push(spo2);
      data["Respiration"].push(resp);
    }
    return data;
  };

  const stackedData = generateStackedData();

  const renderChart = () => {
    if (!chartInstance.current) return;

    chartInstance.current.setOption({
      title: {
        top: 10,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      legend: {
        bottom: 0,
      },
      grid: {
        left: "3%",
        right: "3%",
        top: 60,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: beds,
        nameGap: 25,
        axisLabel: {
          rotate: 0,
        },
      },
      yAxis: {
        type: "value",
        name: "Alarms",
      },
      series: alarmTypes.map((type) => ({
        name: type,
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: stackedData[type],
      })),
    });
  };

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      renderChart();

      const handleResize = () => chartInstance.current.resize();
      window.addEventListener("resize", handleResize);

      // Add click handler
      const handleClick = (params) => {
        if (params.componentType === "series") {
          const bedLabel = params.name; // e.g. "Bed 15"
          navigate(
            `/alarmx/bed?bed=${encodeURIComponent(
              bedLabel
            )}&date=${encodeURIComponent(date)}`
          );
        }
      };

      chartInstance.current.on("click", handleClick);

      return () => {
        window.removeEventListener("resize", handleResize);
        chartInstance.current.off("click", handleClick);
        chartInstance.current.dispose();
      };
    }
  }, []);

  return (
    <Container maxWidth="xl">
      <AppBar
        sx={{ bgcolor: "transparent", mt: 5 }}
        position="static"
        color="inherit"
        elevation={0}
      >
        <Typography variant="h4">Unit Summary</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <IconButton color="secondary">
            <AiFillCalendar size={20} />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {" "}
              {date}
            </Typography>
          </IconButton>
          <IconButton color="success">
            <AiFillAlert size={20} />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {" "}
              {count}
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
          height: "500px",
          marginTop: "2rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      />
    </Container>
  );
}
