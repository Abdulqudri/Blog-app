const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const multer = require("multer");
const path = require('path');


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

const upload = multer({ storage: storage, fileFilter: fileFilter });

const router = express.Router();

router.get("/new", (req, res) => {
	res.render("createPost"); 
});

router.post("/new", upload.single("image"), async (req, res) => {
	try {
		// Destructure data from request body
		const { title, summary, content } = req.body;

		// Check if image was uploaded 
		if (!req.file) {
			return res.status(400).render("createPost", { message: "Please upload an image" });
		}

		// Fetch user data based on session 
		const userDoc = await User.findById(req.session.userId);
		if (!userDoc) {
			return res.status(401).render("createPost", { message: "Unauthorized" });
		}

		const author = userDoc.username;

		
		const post = new Post({ title, summary, content, author, image: req.file.path });

		 await post.save();
		const posts = await Post.find().sort({ createdAt: -1})
		res.status(200).render("index",{posts}); 
	} catch (error) {
		console.error(error); 
		res.status(500).render("createPost", { message: "Error creating post" });
	}
});

module.exports = router;
