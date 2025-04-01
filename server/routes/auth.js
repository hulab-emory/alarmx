const express = require("express");
const router = express.Router();
const authHandler = require("../handler/auth");

// Get user by local auth
router.post("/login", authHandler.login);
// Get user by github auth
router.post("/github-login", authHandler.loginByGithub);
// Sign up 
router.post("/signup", authHandler.signup)

module.exports = router;
