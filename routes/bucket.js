const express = require("express");
const router = express.Router();
const bucketHandler = require("../handler/bucket");

// Find all bucket files and folders with given path
router.get("/*", bucketHandler.findAll);

module.exports = router;
