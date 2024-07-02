const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");

// Registration route
router.post("/register", indexController.register);
// Login route
router.post("/login", indexController.login);

module.exports = router;
