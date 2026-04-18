'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductGallery({ images, title }: any) {
  const [showGallery, setShowGallery] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const allImages = images?.length ? images : [];

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-2 px-4 md:grid-cols-4 md:px-6">
        <div
          className="relative col-span-2 h-[260px] overflow-hidden rounded-2xl md:row-span-2 md:h-[460px]"
          onClick={() => {
            setActiveImage(0);
            setShowGallery(true);
          }}
        >
          <Image
            src={allImages[0]}
            alt={title}
            fill
            className="object-cover"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowGallery(true);
            }}
            className="absolute bottom-3 right-3 rounded-lg bg-white px-3 py-1 text-xs text-black shadow md:text-sm"
          >
            View all photos
          </button>
        </div>

        {allImages.slice(1, 5).map((img: string, i: number) => (
          <div
            key={i}
            className="relative h-[126px] overflow-hidden rounded-2xl md:h-[220px]"
            onClick={() => {
              setActiveImage(i + 1);
              setShowGallery(true);
            }}
          >
            <Image src={img} alt={title} fill className="object-cover" />
          </div>
        ))}
      </div>

      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute right-4 top-4 text-3xl text-white md:right-5 md:top-5"
          >
            ×
          </button>

          <img
            src={allImages[activeImage]}
            className="max-h-[78vh] w-full max-w-4xl rounded-lg object-contain"
          />

          <button
            onClick={() =>
              setActiveImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
            }
            className="absolute left-4 text-3xl text-white md:left-5"
          >
            ‹
          </button>

          <button
            onClick={() =>
              setActiveImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
            }
            className="absolute right-4 text-3xl text-white md:right-5"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
