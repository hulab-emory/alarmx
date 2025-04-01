const express = require("express");
const router = express.Router();
const featureHandler = require("../handler/feature");

// Get all Features
router.get("/", featureHandler.findAll);
// Create a User
router.post("/", featureHandler.create);
// Find a User by id
router.get("/:fid", featureHandler.findById);
// Update a User by id
router.put("/:fid", featureHandler.update);
// Delete a User by id
router.delete("/:fid", featureHandler.delete);

// Get all FeatureUser role
router.get("/:fid/users", featureHandler.findFeatureUserRolesByFeatureId);
// Create a FeatureUser role
router.post("/:fid/users", featureHandler.createFeatureUserRole);
// Find a FeatureUser role
router.get("/:fid/users/:uid", featureHandler.findFeatureUserRole);
// Update a FeatureUser role
router.put("/:fid/users/:uid", featureHandler.updateFeatureUserRole);
// Delete a FeatureUser role
router.delete("/:fid/users/:uid", featureHandler.deleteFeatureUserRole);

module.exports = router;
