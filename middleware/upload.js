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

module.exports = upload;