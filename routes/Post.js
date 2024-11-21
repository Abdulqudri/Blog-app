const express = require("express");
const router = express.Router();
const {
	getPosts,
	getPost,
	getEditPost,
	deletePost,
	createPost,
	editPost,
} = require("../controllers/postController");

const handleUploadErrors = require("../middleware/upload.js");

router.get("/", getPosts);
router.get("/new", (req, res) => {
	res.render("createPost");
});
router.post("/newpost", handleUploadErrors, createPost);
router.get("/:id", getPost);
router.delete("/:id", deletePost);
router.get("/edit/:id", getEditPost);
router.put("/edit/:id", handleUploadErrors, editPost);

module.exports = router;
