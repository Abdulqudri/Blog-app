const Post = require('../models/Post');
const User = require('../models/User');

const postController = {
	getPosts: async (req, res) => {
		try {
			const posts = await Post.find().sort({ createdAt: -1 });
			res.render("index", {posts});
		} catch (err) {
			res.status(500).render({ message: 'Error fetching posts' });
		}
	},
	
	createPost: async (req, res) => {

console.log("inside create function")
			try {
				// Destructure data from request body
				const { title, summary, content } = req.body;
  								
				// Check if image was uploaded 
				if (!req.file) {
					return res.status(400).send({ message: "Please upload an image" });
				}

				// Fetch user data based on session 
				const userDoc = await User.findById(req.session.userId);
			
				if (!userDoc) {
					return res.status(401).send({ message: "Unauthorized" });
				}

				const author = userDoc.username;


				const post = new Post({ title, summary, content, author, image: req.file.path });
				console.log(post)

				 await post.save();
			//	const posts = await Post.find().sort({ createdAt: -1})
				return res.status(200).json(post);
			} catch (error) {
				console.error(error); 
				res.status(500).send({ message: "Error creating post" });
			}
		},
	getPost: async (req, res) => {
		const {id} = req.params;
		try { 
			const post = await Post.findById(id)
			if (!post) res.status(404).send({message: "Post not found"});
			res.render("post", {post})
		}
		catch(err){
				res.status(500).send({message: "Something Went Wrong"})
		}
	
	},
	deletePost: async (req, res) => {
		try {
			const postId = req.params.id;

			// Find the post by ID and delete it
			const deletedPost = await Post.findByIdAndDelete(postId);

			if (!deletedPost) {
					return res.status(404).json({ message: 'Post not found' });
			}

			res.status(200).json({ message: 'Post deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Failed to delete post', error });
		}
	}
}

module.exports = postController
