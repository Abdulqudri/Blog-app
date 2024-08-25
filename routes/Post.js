const express = require("express");
const router = express.Router();
const {getPosts, getPost, deletePost, createPost} = require("../controllers/postController");
const upload = require("../middleware/upload");



router.get("/new", (req, res) => {
	res.render("createPost"); 
});
router.get("/", getPosts)
router.post("/new", upload.single("image"), createPost);
router.get("/:id", getPost)
router.delete("/:id", deletePost)

module.exports = router;
