# GENIMAGEB10  (AI Image Generator)

Welcome to AI Image Generator, a web application that allows users to generate AI-powered images from text prompts and share them with the community.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation Guide](#installation-guide)
- [API Documentation](#api-documentation)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)

## Features
- **AI-Powered Image Generation**: Transform text prompts into stunning images
- **Community Showcase**: Browse and search images created by other users
- **Image Sharing**: Share your AI-generated masterpieces with the community
- **Image Download**: Easily download images with one click
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Vite
- React Router DOM
- File-Saver

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Cloudinary
- Hugging Face API

## Folder Structure

The project follows a clean, modular structure:

```
Gen Image/
├── backend/                # Server-side code
│   ├── mongodb/            # Database models and connection
│   │   ├── connect.js      # MongoDB connection logic
│   │   └── models/         # Database schemas
│   │       └── post.js     # Post model definition
│   ├── routes/             # API endpoints
│   │   ├── postRoutes.js   # Routes for handling posts
│   │   └── huggingRoutes.js # Routes for AI image generation
│   ├── index.js            # Entry point for backend
│   ├── package.json        # Backend dependencies
│   └── vercel.json         # Vercel deployment config
│
└── gen/                    # Frontend code
    ├── public/             # Static files
    ├── src/                # Source code
    │   ├── assets/         # Images and static assets
    │   ├── components/     # Reusable UI components
    │   │   ├── Card.jsx    # Image card component
    │   │   ├── FormField.jsx # Input component
    │   │   └── Loader.jsx  # Loading spinner component
    │   ├── constants/      # Application constants
    │   ├── pages/          # Page components
    │   │   ├── CreatePost.jsx # Image creation page
    │   │   └── Home.jsx    # Community showcase page
    │   ├── utils/          # Utility functions
    │   │   └── index.js    # Helper functions
    │   ├── App.jsx         # Main application component
    │   ├── config.js       # Configuration file
    │   ├── index.css       # Global styles
    │   └── main.jsx        # Application entry point
    └── package.json        # Frontend dependencies
```

## Installation Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Hugging Face account with API access

## Clone the Repo

```
 git clone https://github.com/prabha55555/Stable-Diffusion-Img-Gen.git
```


### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   MONGODB_URL=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   HUGGING_FACE_API_TOKEN=your_hugging_face_token
   PORT=3000
   ```
4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd gen
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `config.js` file in the src directory:
   ```javascript
   const API_URL = 'http://localhost:3000'; // For development
   // const API_URL = 'https://your-backend-url.vercel.app'; // For production
   export default API_URL;
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`

## API Documentation

### Backend Endpoints

#### Image Generation
- **URL**: `/api/v1/dalle`
- **Method**: `POST`
- **Description**: Generates an image based on text prompt
- **Request Body**:
  ```json
  {
    "prompt": "A futuristic city with flying cars"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "photo": "base64_encoded_image_data"
  }
  ```

#### Community Posts
- **URL**: `/api/v1/post`
- **Method**: `GET`
- **Description**: Retrieves all posts from the community
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "post_id",
        "name": "user_name",
        "prompt": "image_prompt",
        "photo": "image_url"
      }
    ]
  }
  ```

- **URL**: `/api/v1/post`
- **Method**: `POST`
- **Description**: Creates a new post with generated image
- **Request Body**:
  ```json
  {
    "name": "user_name",
    "prompt": "image_prompt",
    "photo": "base64_image_or_url"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "new_post_id",
      "name": "user_name",
      "prompt": "image_prompt",
      "photo": "cloudinary_url"
    }
  }
  ```

## Usage Examples

### Generating an Image
1. Navigate to the "Create" page
2. Enter your name in the first field
3. Enter a descriptive prompt (e.g., "A surreal landscape with floating islands and waterfalls")
4. Click the "Generate" button
5. Wait for the AI to create your image
6. Click "Share with the Community" to post your creation

### Browsing the Community
1. Go to the Home page
2. Scroll through the gallery of community-generated images
3. Use the search bar to find specific images (e.g., "space", "nature")
4. Hover over any image to see details and download options

### Downloading Images
1. Hover over an image in the community showcase
2. Click the download icon in the bottom right corner
3. The image will be saved to your device

## Troubleshooting

### Image Generation Issues
- **Error**: "Failed to generate image"
  - **Solution**: Check your Hugging Face API key in the backend `.env` file
  - **Alternative**: Try a shorter, clearer prompt

### Connection Errors
- **Error**: "Failed to connect to backend"
  - **Solution**: Verify the `API_URL` in your frontend `config.js` file
  - **Check**: Make sure your backend server is running

### CORS Issues
- **Error**: CORS errors in the console
  - **Solution**: Check the CORS configuration in the backend `index.js`
  - **Verify**: Ensure your frontend domain is listed in the allowed origins

### MongoDB Connection Issues
- **Error**: "MongoDB connection failed"
  - **Solution**: Check your MongoDB URL in the `.env` file
  - **Verify**: Make sure your IP address is whitelisted in MongoDB Atlas

### Image Download Problems
- **Error**: "Failed to download image"
  - **Solution**: Check if the image URL is using HTTPS
  - **Fix**: Ensure the downloadImage function is handling HTTP/HTTPS correctly

---

