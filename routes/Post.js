const express = require("express");
const router = express.Router();
const {getPosts, getPost, deletePost, createPost} = require("../controllers/postController");
//const upload = require("../middleware/upload");
const multer = require("multer")
const path = require("path")
// Configure Multer storage with proper path
const storage = multer.diskStorage({
	destination: function (req, file, cb) {

		cb(null, 'public/images'); 
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null,  "image-" + uniqueSuffix + path.extname(file.originalname));
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || 'image/png') {
		cb(null, true);
	} else {
		cb(new Error('Only JPEG images are allowed'), false);
	}
};
const upload = multer({ storage: storage, fileFilter: fileFilter })

//module.exports = upload;

router.get("/", getPosts)
router.get("/new", (req, res) => {
	res.render("createPost"); 
});
router.post("/new", upload.single("cover"), createPost);
router.get("/:id", getPost)
router.delete("/:id", deletePost)

module.exports = router;
