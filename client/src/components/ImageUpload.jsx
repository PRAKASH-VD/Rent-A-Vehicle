import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Upload, X } from 'lucide-react';

export function ImageUpload({ onImagesUploaded, maxImages = 5 }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previews.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Create preview URLs
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setSelectedFiles(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
    setError(null);
  };

  const removeImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/vehicles/upload-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const data = await response.json();
      onImagesUploaded(data.imageUrls);

      // Clean up previews and reset state
      previews.forEach(preview => URL.revokeObjectURL(preview.preview));
      setSelectedFiles([]);
      setPreviews([]);
    } catch (err) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative">
            <img
              src={preview.preview}
              alt={`Preview ${index + 1}`}
              className="aspect-square w-full rounded-lg object-cover"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('image-upload').click()}
          disabled={isUploading || previews.length >= maxImages}
        >
          <Upload className="mr-2 h-4 w-4" />
          Select Images
        </Button>

        {selectedFiles.length > 0 && (
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </Button>
        )}

        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <p className="text-sm text-gray-500">
        You can upload up to {maxImages} images. Supported formats: JPG, PNG, WebP
      </p>
    </div>
  );
}

ImageUpload.propTypes = {
  onImagesUploaded: PropTypes.func.isRequired,
  maxImages: PropTypes.number,
};