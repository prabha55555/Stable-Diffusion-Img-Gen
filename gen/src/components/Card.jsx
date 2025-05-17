import React, { useState, useEffect } from 'react';
import download from '../assets/download.svg';
import { downloadImage } from '../utils';

const Card = ({_id, name, prompt, photo }) => {
  
  console.log("Rendering card:", { _id, name, prompt, photoUrl: photo });
  const [imageError, setImageError] = useState(false);
  
  // Check if photo URL is valid
  useEffect(() => {
    if (!photo) setImageError(true);
  }, [photo]);
  
  return (
    <div className='rounded-xl group relative shadow-card hover:shadow-cardhover card'>
        <img 
          src={imageError ? 'https://via.placeholder.com/512?text=Image+Not+Found' : photo} 
          alt={prompt} 
          className='w-full h-auto rounded-xl object-cover'
          onError={(e) => {
            console.error("Image failed to load:", photo);
            setImageError(true);
          }} 
        />
        <div className='group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md'>
            <p className='text-white text-sm overflow-y-auto prompt'>{prompt}</p>
            <div className='flex justify-between items-center gap-2 mt-5'>
                <div className='flex items-center gap-2'>
                    <div className='w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold'>
                      {name && name[0]}
                    </div>
                    <p className='text-white text-sm'>{name}</p>
                </div>
                <button type='button' onClick={() => downloadImage(_id, photo)} className='outline-none bg-transparent border-none'>
                    <img src={download} alt="download" className='w-6 h-6 object-contain invert' />
                </button>
            </div>
        </div>
        <p className='absolute top-0 left-3 font-semibold text-white text-sm bg-[#6469ff] rounded-xl px-2 py-1'>{name}</p>
    </div>
  )
}

export default Card;
