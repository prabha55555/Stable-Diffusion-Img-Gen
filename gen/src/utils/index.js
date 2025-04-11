export async function downloadImage(_id, photo) {
    try {
        console.log("Starting download for image:", photo);
        
        
        if (photo.includes('cloudinary.com')) {
           
            console.log("Using direct FileSaver approach for Cloudinary image");
            FileSaver.saveAs(photo, `download-${_id}.jpg`);
            return;
        }
        
        
        console.log("Using fetch approach for non-Cloudinary image");
        const response = await fetch(photo);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        FileSaver.saveAs(blob, `download-${_id}.jpg`);
        
    } catch (error) {
        console.error('Error downloading image:', error);
        alert(`Failed to download image: ${error.message}`);
    }
}