import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      setUploading(true);

      try {
        const response = await axios.post('http://localhost:3000/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const uploadedImageUrl = response.data.filePath;
        setImageUrl(uploadedImageUrl);
        onUpload(uploadedImageUrl); // Send URL to parent component
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={`http://localhost:3000/${imageUrl}`} alt="Uploaded" width="100" />}
    </div>
  );
};

export default FileUpload;
