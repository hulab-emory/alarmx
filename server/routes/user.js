const express = require("express");
const router = express.Router();
const userHandler = require("../handler/user.js");

// Get all Users
router.get("/", userHandler.findAll);
// Get all feature Users
// router.get("/feature/:fid", userHandler.findAllByFeatureId);
// Create a User
router.post("/", userHandler.create);
// Find a User by id
router.get("/:uid", userHandler.findById);
// Update a User by id
router.put("/:uid", userHandler.update);
// Reset password
router.post("/resetPassword", userHandler.resetPasswordByUsername);
// Delete a User by id
router.delete("/:uid", userHandler.delete);
// Search a User by name or email
router.post("/search", userHandler.search);

module.exports = router;
