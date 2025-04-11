import { surprisePrompts } from "../constants";
import FileSaver from 'file-saver';

export function getRandomPrompt(prompt){
    const randomIndex = Math.floor(Math.random() * surprisePrompts.length);
    const randomPrompt = surprisePrompts[randomIndex]; 
    if(randomPrompt === prompt) return getRandomPrompt(prompt); 
    
    return randomPrompt;
}

export async function downloadImage(_id, photo) {
    let imageUrl = photo;
    
    if (photo.includes('cloudinary.com')) {
        imageUrl = photo.split('?')[0];
        
        imageUrl = imageUrl.includes('/upload/') 
            ? imageUrl.replace('/upload/', '/upload/fl_attachment/')
            : imageUrl;
    }
    
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        FileSaver.saveAs(blob, `download-${_id}.jpg`);
    } catch (error) {
        console.error('Error downloading image:', error);
    }
}
