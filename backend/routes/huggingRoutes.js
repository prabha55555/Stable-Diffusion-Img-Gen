import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

dotenv.config();
const router = express.Router();

// Create a cache with 1 hour TTL
const imageCache = new NodeCache({ stdTTL: 3600 });

// Use a smaller, faster model
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
        'Content-Type': 'application/json'
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

    const placeholderImage = "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC";
    
    return res.status(200).json({ 
      photo: placeholderImage,
      error: true,
      message: "Image generation timed out - using placeholder. Try again later."
    });
  }
});

export default router;