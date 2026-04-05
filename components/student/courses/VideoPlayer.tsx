'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  lesson: {
    id: number;
    video_id: string;
    title: string;
  };
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({ lesson, onProgress, onComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Resume from last position
    const savedTime = localStorage.getItem(`video_${lesson.id}_time`);
    if (savedTime) {
      video.currentTime = parseFloat(savedTime);
    }

    const handleLoadedData = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      setErrorMessage('Unable to load video. Please check your internet connection.');
    };

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      
      if (duration > 0) {
        // Save progress every few seconds
        localStorage.setItem(`video_${lesson.id}_time`, currentTime.toString());
        onProgress?.(currentTime, duration);
        
        // Mark complete at 90%
        if (currentTime / duration >= 0.9) {
          const completedKey = `video_${lesson.id}_completed`;
          if (localStorage.getItem(completedKey) !== 'true') {
            localStorage.setItem(completedKey, 'true');
            onComplete?.();
          }
        }
      }
    };

    const handleEnded = () => {
      onComplete?.();
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [lesson.id, onProgress, onComplete]);
  
  return (
    <div className="relative bg-black w-full h-full group">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Loader2 className="w-12 h-12 text-white animate-spin opacity-80" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/80">
          <div className="text-center text-white p-6">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Video Unavailable</h3>
            <p className="text-gray-300 mb-4">{errorMessage}</p>
            <button 
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        preload="metadata"
        style={{ backgroundColor: 'black' }}
      >
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
        <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Help hint */}
      <div className="absolute top-3 right-3 bg-black/50 text-white/60 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-300">
        Use video controls to play/pause
      </div>
    </div>
  );
}
