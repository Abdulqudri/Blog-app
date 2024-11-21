const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/images"); // Destination folder for uploaded images
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, "image-" + uniqueSuffix + path.extname(file.originalname)); // Unique file name
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		cb(new Error("Only JPEG and PNG images are allowed"), false);
	}
};

const upload = multer({ storage, fileFilter });

// Middleware for handling Multer errors
const handleUploadErrors = (req, res, next) => {
	upload.single("cover")(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			return res.status(400).json({ message: err.message });
		} else if (err) {
			return res.status(400).json({ message: err.message });
		}
		next();
	});
};
module.exports = handleUploadErrors;
