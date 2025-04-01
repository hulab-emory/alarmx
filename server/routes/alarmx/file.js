const express = require("express");
const router = express.Router();
const cadaFileHandler = require("../../handler/alarmx/file");

router.get("/adibin", cadaFileHandler.processAdibin);


module.exports = router;
