import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import preview from '../assets/preview.png';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';
import API_URL from '../config'

const CreatePost = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        prompt: '',
        photo: '',
    });

    const [generatingImg, setGeneratingImg] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setForm({ ...form, prompt: randomPrompt });
    };

    const generateImage = async () => {
        if (form.prompt) {
            try {
                setGeneratingImg(true);
                const response = await fetch(`${API_URL}/api/v1/dalle`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: form.prompt,
                    }),
                });
    
                const data = await response.json();
                
                console.log('Image generation response:', {
                    status: response.status,
                    hasPhoto: !!data.photo,
                    photoLength: data.photo ? data.photo.length : 0,
                    error: data.error,
                    message: data.message
                });
                
                // Check if the model is still loading
                if (response.status === 503 && data.loading) {
                    // Wait 5 seconds and try again
                    alert('The model is still loading. Trying again in 5 seconds...');
                    setTimeout(() => generateImage(), 5000);
                    return;
                }
                
                // Check if there was an error but we still got a placeholder image
                if (data.error && data.photo) {
                    alert(`Warning: ${data.message || 'Image generation had an issue. Using placeholder image.'}`);
                    setForm({ ...form, photo: `data:image/png;base64,${data.photo}` });
                    return;
                }
                
                if (!data.photo) {
                    throw new Error(data.message || 'Failed to generate image');
                }
                
                setForm({ ...form, photo: `data:image/png;base64,${data.photo}` });
            } catch (err) {
                console.error('Image generation error:', err);
                alert(`Error generating image: ${err.message}`);
            } finally {
                setGeneratingImg(false);
            }
        } else {
            alert('Please provide proper prompt ');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (form.prompt && form.photo) {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/v1/post`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...form }),
                });
    
                const data = await response.json();
                if (response.ok) {
                    alert('Success! Shared to the community');
                    navigate('/');
                } else {
                    alert(`Error: ${data.message || 'Failed to share to community'}`);
                }
            } catch (err) {
                alert(err);
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please generate an image with proper details');
        }
    };

    return (
        <section className="max-w-7xl mx-auto">
            <div>
                <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
                <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Generate an imaginative image through AI and share it with the community</p>
            </div>

            <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <FormField
                        labelName="Your Name"
                        type="text"
                        name="name"
                        placeholder="Ex., Prabha"
                        value={form.name}
                        handleChange={handleChange}
                    />

                    <FormField
                        labelName="Prompt"
                        type="text"
                        name="prompt"
                        placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    />

                    <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
                        { form.photo ? (
                            <img
                                src={form.photo}
                                alt={form.prompt}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <img
                                src={preview}
                                alt="preview"
                                className="w-9/12 h-9/12 object-contain opacity-40"
                            />
                        )}

                        {generatingImg && (
                            <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                                <Loader />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-5 flex gap-5">
                    <button
                        type="button"
                        onClick={generateImage}
                        className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        {generatingImg ? 'Generating...' : 'Generate'}
                    </button>
                </div>

                <div className="mt-10">
                    <p className="mt-2 text-[#666e75] text-[14px]">** Once you have created the image you want, you can share it with others in the community **</p>
                    <button
                        type="submit"
                        className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        {loading ? 'Sharing...' : 'Share with the Community'}
                    </button>
                </div>
            </form>
            
            
                <button 
                    onClick={() => window.open('https://www.linkedin.com/in/prabhakaran-kpr', '_blank')}
                    className="mt-8  text-gray-500 text-sm font-medium mx-auto block"
                    >
                    © 2025 Made by <span className="text-violet-600">Prabhakaran K </span>
                </button>
            
        </section>
    );
};

export default CreatePost;