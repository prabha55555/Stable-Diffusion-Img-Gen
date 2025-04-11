import FileSaver from 'file-saver';

export async function downloadImage(_id, photo) {
    try {
        console.log("Starting download for image:", photo);
        
  
        let secureUrl = photo;
        if (secureUrl.startsWith('http:')) {
            secureUrl = secureUrl.replace('http:', 'https:');
            console.log("Converted to secure URL:", secureUrl);
        }
        
        if (secureUrl.includes('cloudinary.com')) {
            console.log("Using direct FileSaver approach for Cloudinary image");
            FileSaver.saveAs(secureUrl, `download-${_id}.jpg`);
            return;
        }
        
      
        console.log("Using fetch approach for image");
        const response = await fetch(secureUrl);
        
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