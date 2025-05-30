import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

dotenv.config();
const router = express.Router();

// Create a cache with 1 hour TTL
const imageCache = new NodeCache({ stdTTL: 3600 });

// Use Stable Diffusion XL model
const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';
const ALTERNATIVE_MODEL_URL = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5';
const FAST_MODEL_URL = 'https://api-inference.huggingface.co/models/CompVis/ldm-text2im-large-256';
const HUGGING_FACE_TOKEN = process.env.HUGGING_FACE_ACCESS_TOKEN;

router.get('/', (req, res) => {
  res.send("Hello from Image Generator API!");
});

router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    console.log('Creating image with prompt:', prompt);

    // Check cache first
    const cacheKey = `image_${prompt.replace(/\s+/g, '_').toLowerCase()}`;
    const cachedImage = imageCache.get(cacheKey);
    
    if (cachedImage) {
      console.log('Returning cached image for prompt:', prompt);
      return res.status(200).json({ photo: cachedImage });
    }

    // Make request to Hugging Face API with reduced parameters for speed
    const response = await axios({
      url: HUGGING_FACE_API_URL,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'image/png' // Explicitly request image response
      },
      data: {
        inputs: prompt,
        parameters: {
          negative_prompt: "blurry, bad quality",
          num_inference_steps: 20,  // Reduced from 30
          guidance_scale: 7.0,
          width: 1024,
          height: 1024
        },
        options: {
          use_cache: true,
          wait_for_model: true
        }
      },
      responseType: 'arraybuffer',
      timeout: 30000  // 30 seconds timeout
    });
    
    console.log('Image generated successfully');
    
      // Convert image buffer to base64
    const base64Image = Buffer.from(response.data).toString('base64');
    
    // Log some debug info
    console.log('Generated image size:', response.data.length, 'bytes');
    console.log('Base64 image length:', base64Image.length);
    console.log('Content-Type:', response.headers['content-type']);
    
    // Save to cache
    imageCache.set(cacheKey, base64Image);
    
    // Return the base64-encoded image
    return res.status(200).json({ photo: base64Image });
    
  } catch (error) {
    console.log('Error details:', error.message);
    
    // If the model is loading, let the client know
    if (error.response && error.response.status === 503) {
      return res.status(503).json({ 
        message: 'The model is currently loading. Please try again in a moment.',
        loading: true
      });
    }
    
    // Log more error details to help with debugging
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error headers:', error.response.headers);
      
      // Try to parse the error message if it's in the response data
      if (error.response.data) {
        try {
          if (Buffer.isBuffer(error.response.data)) {
            const errorText = Buffer.from(error.response.data).toString();
            console.log('Error data:', errorText);
          } else {
            console.log('Error data:', error.response.data);
          }
        } catch (parseError) {
          console.log('Could not parse error data');
        }
      }
    }

    const placeholderImage = "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC";
    
    return res.status(200).json({ 
      photo: placeholderImage,
      error: true,
      message: "Image generation failed - using placeholder. Error: " + error.message
    });
  }
});

export default router;