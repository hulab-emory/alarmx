import React, { useState, useEffect } from "react";
import axios from "axios";
import Charts from "./Chart.jsx";
require("../../../utils/canvasjs.min.js");

export default function Data({
  leadOrder,
  completedTab,
  filename,
  viewportInterval,
  getChartObj,
  nextFilename,
  range,
}) {
  const [waveform, setWaveform] = useState({});
  const [nextWaveform, setNextWaveform] = useState({});
  const [completedWaveform, setCompetedWaveform] = useState({});

  useEffect(() => {
    const getData = async () => {
      const result = await axios(
        `/api/alarmx/file/adibin?filename=${filename}&offset=0&range=${range}`
      );
      setWaveform(result.data);
    };

    const getNextData = async () => {
      const result = await axios(
        `/api/alarmx/file/adibin?filename=${nextFilename}&offset=0&range=${range}`
      );
      console.log("nextfilename: ", `/api/alarmx/file/adibin?${nextFilename}`);
      setNextWaveform(result.data);
    };

    const getCompletedData = async () => {
      const result = await axios(
        `/api/alarmx/file/adibin?filename=${filename}&offset=0&range=${range}`
      );
      console.log(
        "completedfilename: ",
        `/api/alarmx/file/adibin?filename=${filename}&offset=0&range=${range}`
      );
      setCompetedWaveform(result.data);
    };

    if (completedTab === true) {
      getCompletedData();
      setWaveform({});
    } else if (Object.keys(waveform).length === 0 && completedTab === false) {
      getData();
      if (nextFilename !== "") {
        getNextData();
      }
    } else if (Object.keys(waveform).length > 0 && completedTab === false) {
      setWaveform(nextWaveform);
      getNextData();
    }
  }, [completedTab, filename, nextFilename, range]);

  useEffect(() => {
    console.log("------------------waveform updated");
  }, [waveform]);

  if (
    Object.keys(waveform).length !== 0 ||
    Object.keys(completedWaveform).length !== 0
  ) {
    return (
      <Charts
        leadOrder={leadOrder}
        filename={filename}
        fastbinWaveforms={completedTab === false ? waveform : completedWaveform}
        viewportInterval={viewportInterval}
        getChartObj={getChartObj}
      />
    );
  } else {
    return "";
  }
}

