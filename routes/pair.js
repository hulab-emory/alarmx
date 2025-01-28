const express = require("express");
const router = express.Router();
const pairHandler = require("../handler/pair");

router.get("/", pairHandler.findAll);

router.get("/user/:uid/feature/:fid", pairHandler.findByUserId);

router.post("/create", pairHandler.create);

router.put("/update", pairHandler.update);

router.delete("/delete", pairHandler.delete);

module.exports = router;