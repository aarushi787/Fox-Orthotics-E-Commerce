import React, { useEffect, useState } from 'react';

interface ImageGalleryProps {
  productName: string;
  initialUrls?: string[];
  selectedImage?: string;
  onSelect?: (url: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ productName, initialUrls = [], selectedImage, onSelect }) => {
  const [images, setImages] = useState<string[]>(initialUrls || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have image urls passed down, don't fetch.
    if (initialUrls && initialUrls.length > 0) return;

    let mounted = true;
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(`/api/images/${encodeURIComponent(productName)}`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (mounted && Array.isArray(data.images)) {
          setImages(data.images);
          if (data.images.length > 0 && onSelect) onSelect(data.images[0]);
        }
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Failed to load images');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchImages();
    return () => { mounted = false; };
  }, [initialUrls, productName, onSelect]);

  const current = selectedImage || images[0] || '';

  return (
    <div>
      <div className="relative w-full h-auto overflow-hidden rounded-lg shadow-lg cursor-zoom-in border">
        {loading && <div className="p-8 text-center text-gray-500">Loading images...</div>}
        {error && <div className="p-8 text-center text-red-500">{error}</div>}
        {!loading && !error && current && (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img src={current} alt={`${productName} image`} className="w-full h-auto object-cover" />
        )}
        {!loading && !error && !current && (
          <div className="p-8 text-center text-gray-400">No images available</div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-4">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => onSelect && onSelect(url)}
              className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${current === url ? 'border-brand-blue' : 'border-transparent hover:border-gray-300'}`}>
              <img src={url} alt={`${productName} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
