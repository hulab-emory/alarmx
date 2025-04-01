const express = require("express");
const router = express.Router();
const bucketHandler = require("../handler/bucket");

// Find all bucket files and folders with given path
router.get("/*", bucketHandler.findAll);
// Find aws s3 bucket files and folders with given path
//router.get("/s3/*", bucketHandler.findAllS3);

module.exports = router;
