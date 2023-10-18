// Import necessary modules
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Load environment variables in development environment
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Configure cloudinary with API credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloud name from environment variables
  api_key: process.env.CLOUDINARY_KEY, // API key from environment variables
  api_secret: process.env.CLOUDINARY_SECRET, // API secret from environment variables
});

// Create Cloudinary storage with specified parameters
const storage = new CloudinaryStorage({
  cloudinary, // Cloudinary configuration
  params: {
    folder: "STAR-APP", // Specify the folder where the images will be stored
    allowedFormats: ["jpeg", "png", "jpg"], // Specify the allowed formats for the images
  },
});

// Export the cloudinary and storage objects for use in other files
module.exports = {
  cloudinary,
  storage,
};
