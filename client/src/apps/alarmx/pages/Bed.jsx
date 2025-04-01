import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import * as echarts from "echarts/core";
import {
  TooltipComponent,
  DataZoomComponent,
  GridComponent,
  TitleComponent,
} from "echarts/components";
import { CustomChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import {
  AppBar,
  Box,
  Container,
  Stack,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { AiFillCalendar } from "react-icons/ai";
import { FaBed } from "react-icons/fa";
import BedWaveform from "../sections/BedWaveformChart";

echarts.use([
  TooltipComponent,
  DataZoomComponent,
  GridComponent,
  TitleComponent,
  CustomChart,
  CanvasRenderer,
]);

export default function BedPage() {
  const location = useLocation();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const searchParams = new URLSearchParams(location.search);
  const bed = searchParams.get("bed") || "Bed 1";
  const date = searchParams.get("date") || new Date().toLocaleDateString();

  const [openModal, setOpenModal] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState(null);

  useEffect(() => {
    const alarmNames = [
      "HR Alarm",
      "SpO2 Drop",
      "Respiratory Pause",
      "Apnea",
      "PVC Alarm",
      "Asystole",
      "Bradycardia",
      "Tachycardia",
      "V-Fib",
      "ST Segment",
    ];

    const startTime = +new Date(`${date} 08:00:00`) || +new Date();
    const alarmData = [];
    const eventCount = 30;

    for (let i = 0; i < eventCount; i++) {
      const alarmIndex = Math.floor(Math.random() * alarmNames.length);
      const alarmName = alarmNames[alarmIndex];

      const startOffset = Math.floor(Math.random() * 8 * 60 * 60 * 1000); // up to 8 hours
      const duration = Math.floor(10000 + Math.random() * 60000); // 10s–60s
      const start = startTime + startOffset;
      const end = start + duration;

      alarmData.push({
        name: alarmName,
        value: [alarmName, start, end, duration],
        itemStyle: {
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        },
      });
    }

    const renderItem = (params, api) => {
      const category = api.value(0);
      const start = api.coord([api.value(1), category]);
      const end = api.coord([api.value(2), category]);
      const height = api.size([0, 1])[1] * 0.6;

      const rectShape = echarts.graphic.clipRectByRect(
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
    };

    const option = {
      title: {},
      tooltip: {
        formatter: function (params) {
          const start = new Date(params.value[1]).toLocaleTimeString();
          const durationSec = Math.round(params.value[3] / 1000);
          return `
            <strong>${params.name}</strong><br/>
            Start: ${start}<br/>
            Duration: ${durationSec}s
          `;
        },
      },
      dataZoom: [
        {
          type: "slider",
          filterMode: "weakFilter",
          top: 400,
        },
        {
          type: "inside",
          filterMode: "weakFilter",
        },
      ],
      grid: {
        height: 340,
        top: 20,
        bottom: 10,
        left: 120,
        right: 10,
      },
      xAxis: {
        type: "time",
        min: startTime,
        axisLabel: {
          formatter: (val) => new Date(val).toLocaleTimeString(),
        },
      },
      yAxis: {
        type: "category",
        data: alarmNames,
        nameGap: 60,
      },
      series: [
        {
          type: "custom",
          renderItem: renderItem,
          encode: {
            x: [1, 2],
            y: 0,
          },
          data: alarmData,
          itemStyle: {
            opacity: 1,
          },
          animationDuration: 1000, // 1 second
          animationEasing: "cubicOut",
        },
      ],
    };

    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      chartInstance.current.setOption(option);

      chartInstance.current.on("click", function (params) {
        if (params.componentType === "series" && params.data) {
          setSelectedAlarm(params.data);
          setOpenModal(true);
        }
      });

      const handleResize = () => chartInstance.current.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chartInstance.current.dispose();
      };
    }
  }, [bed, date]);

  return (
    <Container maxWidth="xl">
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth={true}
        maxWidth="xl"
      >
        <DialogTitle>{selectedAlarm?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedAlarm ? (
              <>
                <Stack direction={"row"} spacing={2}>
                  <Typography>
                    <strong>Start:</strong>{" "}
                    {new Date(selectedAlarm?.value[1]).toLocaleTimeString()}
                  </Typography>
                  <Typography>
                    <strong>End:</strong>{" "}
                    {new Date(selectedAlarm?.value[2]).toLocaleTimeString()}
                  </Typography>
                  <Typography>
                    <strong>Duration:</strong>{" "}
                    {Math.round(selectedAlarm?.value[3] / 1000)} seconds
                  </Typography>
                </Stack>
                <BedWaveform />
              </>
            ) : (
              <Typography>No alarm selected.</Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <AppBar
        sx={{ bgcolor: "transparent", mt: 5 }}
        position="static"
        color="inherit"
        elevation={0}
      >
        <Typography variant="h4">Bed Details</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <IconButton color="primary">
            <FaBed size={20} />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {" "}
              {bed}
            </Typography>
          </IconButton>
          <IconButton color="secondary">
            <AiFillCalendar size={20} />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {" "}
              {date}
            </Typography>
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <ToggleButtonGroup>
            <ToggleButton value="today"> Today</ToggleButton>
            <ToggleButton value="last24hrs">Last 24hrs</ToggleButton>
            <ToggleButton value="lastshirt">Last shift</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </AppBar>

      <Box
        ref={chartRef}
        style={{
          width: "100%",
          height: "450px",
          marginTop: "1rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      />
    </Container>
  );
}
