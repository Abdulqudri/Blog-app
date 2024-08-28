const express = require("express");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const auth = require("./middleware/auth");
require("dotenv").config();
const {getPosts } = require("./controllers/postController");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path")
const postRoute = require("./routes/Post")



const port = process.env.PORT || 3000;
const app = express();
const mongodb_uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongodb_uri)
.then(() => {
	console.log("Connected to MongoDB");
})
.catch((err) => {
	console.error("Error connecting to MongoDB:", err);
});

// Configure the session store
const store = new MongoDBStore({
	uri: mongodb_uri,
	collection: "sessions"
}, function(error) {
	if (error) {
		console.error('Session store error connecting to DB:', error);
	}
});

// Catch errors with the session store
store.on('error', function(error) {
	console.error('Session store error:', error);
});

// Configure session middleware
app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false,
	store: store
}));

// Set up middleware to parse request bodies

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static("public"));

// Define a simple route
app.get("/", auth, getPosts);
app.use("/post", auth, postRoute)

// Use routes with base paths
app.use(registerRoute);
app.use(loginRoute);

// Start the server after successful MongoDB connection
mongoose.connection.once('open', () => {
	app.listen(port, () => {
		console.log(`Server running on http://localhost:${port}`);
	});
});
