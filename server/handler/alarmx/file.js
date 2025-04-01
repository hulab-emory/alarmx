"use strict";
const db = require("../../models");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const dotenv = require("dotenv");
dotenv.config();

const alarmxFileServices = require("../../services/alarmx/file");

exports.processAdibin = (req, res) => {
  function runScript() {
    return spawn(process.env.PYTHON_PATH, [
      path.join(__dirname, "../../python-scripts/adibin-handler.py"),
      path.join(process.env.BUCKET_PATH || "", `${req.query.filename}`),
      req.query.offset,
      req.query.range,
    ]);
  }

  const subprocess = runScript();

  subprocess.stderr.on("data", (data) => {
    console.log(`error:${data}`);
  });
  subprocess.on("error", (error) => {
    console.error(`Error spawning subprocess: ${error}`);
    res.status(500).send("Internal Server Error");
  });
  subprocess.stderr.on("close", () => {
    console.log("Closed");
  });

  res.set("Content-Type", "text/plain");
  subprocess.stdout.pipe(res);
  subprocess.stderr.pipe(res);
};
