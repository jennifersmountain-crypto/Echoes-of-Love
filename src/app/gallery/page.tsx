'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase, Photo } from '@/lib/supabase';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*, profile:profiles(*)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // For demo purposes, we'll use a placeholder URL
    // In production, you would upload to Supabase Storage
    const placeholderUrl = URL.createObjectURL(file);
    
    try {
      const userId = localStorage.getItem('userId') || 'anonymous-user';
      
      const { error } = await supabase.from('photos').insert({
        user_id: userId,
        url: placeholderUrl,
        caption: caption || 'A precious memory',
      });

      if (error) throw error;
      setCaption('');
      fetchPhotos();
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-cloud-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image src="/assets/logo.png" alt="Echoes of Love" fill className="object-contain" />
              </div>
              <span className="text-xl font-serif text-deep-slate hidden sm:block">Echoes of Love</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Gallery Header */}
      <div className="bg-soft-gold text-cloud-white py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-serif mb-2">Memory Gallery</h1>
          <p className="text-cloud-white/80 text-sm">
            Share photos of your loved ones or images that bring you comfort.
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-cloud-white border-b border-warm-grey/20 py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-ivory rounded-xl p-6">
            <h3 className="font-serif text-lg text-deep-slate mb-4">Add to the Gallery</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex-1">
                <span className="sr-only">Choose photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="block w-full text-sm text-warm-grey file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-soft-gold file:text-cloud-white hover:file:bg-[#b8962e] file:cursor-pointer file:transition-colors"
                />
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption for this memory..."
                className="flex-1 px-4 py-2 rounded-lg border border-warm-grey/30 focus:outline-none focus:border-soft-gold bg-cloud-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 bg-ivory py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12 text-warm-grey">Loading gallery...</div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative w-20 h-20 mx-auto mb-4 opacity-50">
                <Image src="/assets/gallery-placeholder.jpg" alt="Gallery" fill className="object-cover rounded-lg" />
              </div>
              <p className="text-warm-grey mb-2">The gallery is empty.</p>
              <p className="text-sm text-warm-grey/70">Be the first to share a precious memory.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedImage(photo)}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption || 'Memory'}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {photo.caption && (
                    <p className="absolute bottom-2 left-2 right-2 text-cloud-white text-sm opacity-0 group-hover:opacity-100 transition-opacity truncate">
                      {photo.caption}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-cloud-white hover:text-soft-gold transition-colors"
            >
              Close
            </button>
            <div className="relative w-full h-64 sm:h-96 md:h-[500px] bg-deep-slate rounded-xl overflow-hidden">
              <Image
                src={selectedImage.url}
                alt={selectedImage.caption || 'Memory'}
                fill
                className="object-contain"
              />
            </div>
            {selectedImage.caption && (
              <p className="text-cloud-white text-center mt-4 font-serif text-lg">
                {selectedImage.caption}
              </p>
            )}
            <p className="text-cloud-white/60 text-center mt-2 text-sm">
              Shared by {selectedImage.profile?.display_name || 'Anonymous Friend'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}