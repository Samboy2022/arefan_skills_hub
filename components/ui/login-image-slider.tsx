'use client';

import { useState, useEffect } from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1470&auto=format&fit=crop'
];

export function LoginImageSlider({ title, description }: { title?: string; description?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Respect users who prefer reduced motion — keep the first image.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-none border border-border/60">
      {IMAGES.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          loading={index === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-8 text-white md:p-10">
        {title && <p className="mb-3 text-2xl font-bold tracking-tight text-balance md:text-3xl">{title}</p>}
        {description && <p className="max-w-md leading-relaxed text-white/80">{description}</p>}

        <div className="mt-6 flex gap-2" aria-hidden>
          {IMAGES.map((src, index) => (
            <span
              key={src}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentIndex ? 'w-8 bg-primary' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
