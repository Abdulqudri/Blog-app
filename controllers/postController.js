const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs").promises;

const formatImagePath = require("../utils/formatImage");

const postController = {
	getPosts: async (req, res) => {
		try {
			const posts = await Post.find().sort({ createdAt: -1 });
			console.log(posts);
			res.render("index", { posts });
		} catch (err) {
			res.status(500).render({ message: "Error fetching posts" });
		}
	},
	createPost: async (req, res) => {
		try {
			// Destructure data from request body
			const { title, summary, content } = req.body;

			// Validate required fields
			if (!title || !summary || !content) {
				return res.status(400).json({
					message: "All fields (title, summary, content) are required.",
				});
			}

			// Check if image was uploaded
			if (!req.file) {
				return res.status(400).json({ message: "Please upload an image." });
			}

			// Ensure the user is authenticated
			const userId = req.session?.userId;
			if (!userId) {
				return res
					.status(401)
					.json({ message: "Unauthorized. Please log in." });
			}

			// Fetch user data from the database

			const userDoc = await User.findById(userId);
			if (!userDoc) {
				return res
					.status(401)
					.json({ message: "Unauthorized. User not found." });
			}

			// Construct post object
			const post = new Post({
				title: title.trim(),
				summary: summary.trim(),
				content: content.trim(),
				author: userDoc.username,
				image: req.file.path, // Convert path to public URL
			});
			console.log(formatImagePath(req.file.path));

			// Save the post to the database
			const savedPost = await post.save();

			// Return the created post with success response
			return res.status(201).json({
				message: "Post created successfully.",
				post: savedPost,
			});
		} catch (error) {
			// Log the error for server-side debugging
			console.error("Error creating post:", error);

			// Send a generic error message to the client
			return res.status(500).json({
				message: "An unexpected error occurred. Please try again later.",
			});
		}
	},
	getPost: async (req, res) => {
		const { id } = req.params;
		try {
			const post = await Post.findById(id);
			if (!post) return res.status(404).send({ message: "Post not found" });
			res.render("post", { post });
		} catch (err) {
			res.status(500).send({ message: "Something Went Wrong" });
		}
	},
	getEditPost: async (req, res) => {
		const { id } = req.params;
		try {
			const post = await Post.findById(id);
			if (!post) return res.status(404).send({ message: "Post not found" });
			res.render("editPost", { post });
		} catch (err) {
			res.status(500).send({ message: "Something Went Wrong" });
		}
	},

	deletePost: async (req, res) => {
		try {
			const postId = req.params.id;

			// Find the post by ID and delete it
			const deletedPost = await Post.findByIdAndDelete(postId);

			if (!deletedPost) {
				return res.status(404).json({ message: "Post not found" });
			}
			if (deletedPost.image) {
				fs.unlink(deletedPost.image, (err) => {
					if (err) {
						console.log(err);
					} else {
						console.log("Image deleted successfully");
					}
				});
			}

			res.status(200).json({ message: "Post deleted successfully" });
		} catch (error) {
			res.status(500).json({ message: "Failed to delete post", error });
		}
	},
	editPost: async (req, res) => {
		try {
			const postId = req.params.id;
			// Destructure data from request body
			const { title, summary, content } = req.body;

			// Check if image was uploaded
			if (!req.file) {
				return res.status(400).send({ message: "Please upload an image" });
			}

			// Fetch user data based on session
			if (!req.session || !req.session.userId) {
				return res
					.status(401)
					.send({ message: "Unauthorized. No session found." });
			}
			const userDoc = await User.findById(req.session.userId);

			const prevPost = await Post.findById(postId);

			if (!userDoc) {
				return res.status(401).send({ message: "Unauthorized" });
			}

			const author = userDoc.username;

			const updatePost = await Post.findByIdAndUpdate(
				postId,
				{
					title,
					summary,
					content,
					author,
					image: req.file.path,
				},
				{
					new: true,
					runValidators: true,
				},
			);

			if (!updatePost) {
				return res.status(404).send({ message: "Post not found" });
			}
			if (prevPost && prevPost.image) {
				try {
					await fs.unlink(prevPost.image);
					console.log("Image deleted successfully");
				} catch (err) {
					console.error("Error deleting image:", err);
					return res
						.status(500)
						.send({ message: "Error deleting previous image" });
				}
			}

			res.status(200).send({ message: "Post updated successfully" });
		} catch (error) {
			res.status(500).json({ message: "Failed to edit post", error });
		}
	},
};

module.exports = postController;
