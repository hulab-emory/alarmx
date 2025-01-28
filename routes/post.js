const express = require("express");
const router = express.Router();
const postHandler = require("../handler/post");

router.get("/:fid", postHandler.findAll);

router.get("/:pid", postHandler.findById);

router.get("/:fid/:uid", postHandler.findByUserId);

router.post("/", postHandler.create);

router.post("/:pid", postHandler.update);

router.delete("/:pid", postHandler.remove);

router.get("/search/:fid", postHandler.search);

module.exports = router;