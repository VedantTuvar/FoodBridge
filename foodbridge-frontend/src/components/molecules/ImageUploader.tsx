import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { donorApi } from '../../api/donorApi';

export interface ImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void;
  existingImages?: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesUploaded,
  existingImages = [],
}) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [...images];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);
        const res = await donorApi.uploadDonationImage(formData);
        uploadedUrls.push(res.data.image_url);
      }
      setImages(uploadedUrls);
      onImagesUploaded(uploadedUrls);
    } catch (err) {
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    setImages(updated);
    onImagesUploaded(updated);
  };

  return (
    <div className="mb-4">
      <label className="font-mono text-xs uppercase tracking-wider text-ink-soft dark:text-paper-alt mb-1.5 block font-medium">
        Food Photographs (Optional)
      </label>
      
      <div className="border-2 border-dashed border-line rounded-sm p-6 text-center hover:border-teal transition-colors cursor-pointer bg-paper-alt/30 relative">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <UploadCloud className="w-8 h-8 text-teal mx-auto mb-2" />
        <p className="text-sm font-medium text-ink dark:text-paper">
          {uploading ? 'Uploading Image...' : 'Click or Drag & Drop Food Photos'}
        </p>
        <p className="text-xs text-ink-soft mt-1">PNG, JPG, WebP up to 5MB</p>
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {images.map((url, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-sm overflow-hidden border border-line">
              <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 bg-night/80 text-white rounded-full p-0.5 hover:bg-red-soft"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
