import { surprisePrompts } from "../constants";
import FileSaver from 'file-saver';

export function getRandomPrompt(prompt){
    const randomIndex = Math.floor(Math.random() * surprisePrompts.length);
    const randomPrompt = surprisePrompts[randomIndex]; 
    if(randomPrompt === prompt) return getRandomPrompt(prompt); 
    
    return randomPrompt;
}


export async function downloadImage(_id, photo) {
    FileSaver.saveAs(photo, `download-${_id}.jpg`);
}