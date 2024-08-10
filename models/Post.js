const mongoose = require("mongoose")

const {Schema, model} = mongoose

const postSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	summary: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = model("Post", postSchema)