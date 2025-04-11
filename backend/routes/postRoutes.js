import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Post from '../mongodb/models/post.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

console.log("Cloudinary Config Values:");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Exists" : "Missing");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.route('/').get(async(req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.route('/').post(async(req, res) => {
    const { name, prompt, photo } = req.body;
   
    console.log("Received post request with:", { name, prompt, photoExists: !!photo });
    
    try {
       
        console.log("Cloudinary config before upload:", {
            cloud_name: cloudinary.config().cloud_name ? "Set" : "Missing",
            api_key: cloudinary.config().api_key ? "Set" : "Missing",
            api_secret: cloudinary.config().api_secret ? "Set" : "Missing"
        });
        
        const photoUrl = await cloudinary.uploader.upload(photo);
        console.log("Upload successful, URL:", photoUrl.url);

        const newPost = await Post.create({
            name,
            prompt,
            photo: photoUrl.url,
        });

        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        console.log("Error during post creation:", error.toString());
        res.status(500).json({ success: false, message: error.toString() });
    }
});

export default router;