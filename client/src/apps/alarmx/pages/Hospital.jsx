import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  AppBar,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Stack,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import * as echarts from "echarts/core";
import {
  TooltipComponent,
  GridComponent,
  TitleComponent,
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { useNavigate } from "react-router-dom";
import { AiFillAlert } from "react-icons/ai";
import UnitsBreakdown from "../sections/UnitsBreakdown";
import { set } from "lodash";

echarts.use([
  TooltipComponent,
  GridComponent,
  TitleComponent,
  BarChart,
  CanvasRenderer,
]);

const generateAlarmData = (range = "month") => {
  let numDays = 30;
  if (range === "quarter") numDays = 90;
  if (range === "year") numDays = 365;

  const labels = [];
  const data = [];
  const dateMap = {}; // maps short label -> full date

  for (let i = numDays - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const shortLabel = `${date.getMonth() + 1}/${date.getDate()}`; // 4/1
    const fullDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`; // 4/1/2025

    labels.push(shortLabel);
    dateMap[shortLabel] = fullDate;
    data.push(Math.floor(80000 + Math.random() * 20000));
  }

  return { labels, data, dateMap };
};

export default function Dashboard() {
  const user = useSelector((state) => state.main.user);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("month");
  const [chartPayload, setChartPayload] = useState({ labels: [], data: [], dateMap: {} });

  const [selectedUnit, setSelectedUnit]= useState({date: '', count: 0});

  const updateChart = ({ labels, data }) => {
    if (!chartInstance.current || !labels.length || !data.length) return;

    chartInstance.current.setOption({
      title: {
        top: 10,
        textStyle: {
          fontSize: 20,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      grid: {
        top: 30,
        left: "3%",
        right: "3%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        nameGap: 25,
        data: labels,
        axisTick: { alignWithLabel: true },
        axisLabel: {
          show: true,
          interval: Math.floor(labels.length / 10),
          rotate: 0,
        },
      },
      yAxis: {
        type: "value",
        name: "Alarms",
        nameLocation: "middle",
        nameGap: 50,
      },
      series: [
        {
          name: "Alarms",
          type: "bar",
          data,
          barWidth: "70%",
          itemStyle: {
            color: "#1976d2",
          },
        },
      ],
    });
  };

  useEffect(() => {
    const initial = generateAlarmData(timeRange);
    setSelectedUnit({ date: initial.dateMap[initial.labels[0]], count: initial.data[0] });
    setChartPayload(initial);
  }, []);

 useEffect(() => {
  if (!chartRef.current) return;
  if (!chartPayload) return;

  chartInstance.current = echarts.init(chartRef.current);
  updateChart(chartPayload);

  const handleResize = () => chartInstance.current.resize();
  window.addEventListener("resize", handleResize);

  const handleClick = (params) => {
    const shortLabel = params.name;
    const fullDate = chartPayload.dateMap[shortLabel];
    const yValue = params.value;
    setSelectedUnit({ date: fullDate, count: yValue });
  };

  chartInstance.current.on("click", handleClick);

  return () => {
    window.removeEventListener("resize", handleResize);
    chartInstance.current.off("click", handleClick);
    chartInstance.current.dispose();
  };
}, [chartPayload]);

  useEffect(() => {
    const newData = generateAlarmData(timeRange);
    setChartPayload(newData);
    updateChart(newData);
  }, [timeRange]);

  const handleRangeChange = (_, newRange) => {
    if (newRange !== null) setTimeRange(newRange);
  };

  useEffect(() => {
    console.log("selectedUnit", selectedUnit);
  }
  , [selectedUnit]);

  if (!user) {
    return (
      <Container
        sx={{
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          minHeight: "100vh",
          display: "flex",
        }}
      >
        <Typography variant="h3" paragraph>
          There are no data.
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Contact your admin!
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <AppBar
        sx={{ bgcolor: "transparent", mt: 5 }}
        position="static"
        color="inherit"
        elevation={0}
      >
        <Typography variant="h4">Hospital Summary</Typography>
        <Stack direction="row" sx={{ mt: 2 }}>
          <IconButton color="success" sx={{ mr: 2 }}>
            <AiFillAlert size={20} />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {" "}
              {chartPayload.data.reduce((acc, curr) => acc + curr, 0)}
            </Typography>
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleRangeChange}
            size="small"
            aria-label="Time Range"
          >
            <ToggleButton value="month">Last Month</ToggleButton>
            <ToggleButton value="quarter">Last Quarter</ToggleButton>
            <ToggleButton value="year">Last Year</ToggleButton>
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

      <UnitsBreakdown selectedUnit={selectedUnit}/>
    </Container>
  );
}
