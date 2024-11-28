const express = require("express");
const router = express.Router();
const { login } = require("../controllers/userController");

// Render the login form
router.get("/viewlogin", (req, res) => {
	res.render("login" , {layout: "layouts/signing"});
});

// Handle login
router.post("/login", login);

module.exports = router;
