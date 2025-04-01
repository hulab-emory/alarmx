const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const app = express();
const db = require("./models");
const routes = require("./routes");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require(`./swagger`);
const createError = require("http-errors");

require('dotenv').config();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || "development";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize and sync all databases
Promise.all([
  db.sequelize_app.sync(),
  db.sequelize_omop.sync(),
  db.sequelize_vocab.sync(),
]).then(() => {
  console.log("Synced db.");
}).catch((err) => {
  console.log("Failed to sync db: " + err.message);
});

app.use(express.static(path.join(__dirname, "build")));

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api", routes);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    status: "error",
    err: {
      message: err.message,
    },
  });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running in ${NODE_ENV} mode on port ${PORT}`);
});

function handleShutdownGracefully() {
  console.info("closing server gracefully...");
  server.close(() => {
    console.info("server closed.");
    process.exit(0); // if required
  });
}
process.on("SIGINT", handleShutdownGracefully);
process.on("SIGTERM", handleShutdownGracefully);
process.on("SIGHUP", handleShutdownGracefully);
