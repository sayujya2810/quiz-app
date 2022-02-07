const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name:CLOUDINARY_CLOUD_NAME,
    api_secret:CLOUDINARY_API_SECRET,
    api_key:CLOUDINARY_API_KEY
})

module.exports ={cloudinary}; 