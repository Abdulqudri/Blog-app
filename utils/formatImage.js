// Helper function to format the image path into a public URL
const formatImagePath = (filePath) => {
	const baseUrl = process.env.BASE_URL || "http://localhost:3000"; // Use environment variable for base URL
	return `${baseUrl}/${filePath.replace(/\\/g, "/")}`; // Normalize file path
};

module.exports = formatImagePath;
