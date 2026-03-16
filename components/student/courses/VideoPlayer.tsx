'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Loader2 } from 'lucide-react';
import { VideoKeyboardShortcuts } from './VideoKeyboardShortcuts';
import { registerQualitySelector } from '@/lib/videojs-plugins/qualitySelector';

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
  const playerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Register plugins once
  useEffect(() => {
    registerQualitySelector(videojs);
  }, []);

  // Use a simulated video URL fetch for now.
  const videoUrls = {
    url_1080p: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    url_720p: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    url_360p: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  };

  useEffect(() => {
    if (!videoRef.current) return;
    
    // Initialize Video.js player
    const player = videojs(videoRef.current, {
      controls: true,
      responsive: true,
      fluid: true,
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'remainingTimeDisplay',
          'playbackRateMenuButton',
          'qualitySelector', // Custom plugin
          'fullscreenToggle'
        ]
      },
      sources: [
        {
          src: videoUrls.url_1080p,
          type: 'video/mp4',
          label: '1080p',
          selected: true
        },
        {
          src: videoUrls.url_720p,
          type: 'video/mp4',
          label: '720p'
        },
        {
          src: videoUrls.url_360p,
          type: 'video/mp4',
          label: '360p'
        }
      ]
    });
    
    playerRef.current = player;
    
    let timeUpdateCount = 0;
    
    // Event Listeners
    player.on('loadeddata', () => {
      setIsLoading(false);
      
      // Resume from last position
      const savedTime = localStorage.getItem(`video_${lesson.id}_time`);
      if (savedTime) {
        player.currentTime(parseFloat(savedTime));
      }
    });
    
    player.on('timeupdate', () => {
      const currentTime = player.currentTime() || 0;
      const duration = player.duration() || 0;
      
      // Prevent division by zero
      if (duration === 0) return;

      timeUpdateCount++;
      
      // Save progress roughly every 5 seconds equivalent 
      // timeupdate fires multiple times per second
      if (timeUpdateCount % 20 === 0) {
        localStorage.setItem(`video_${lesson.id}_time`, currentTime.toString());
        if (onProgress) {
          onProgress(currentTime, duration);
        }
      }
      
      // Mark as complete at 90%
      if (currentTime / duration >= 0.9) {
        // Track whether we fired completion to avoid spamming
        const completedKey = `video_${lesson.id}_completed`;
        if (localStorage.getItem(completedKey) !== 'true') {
          localStorage.setItem(completedKey, 'true');
          if (onComplete) {
             onComplete();
          }
        }
      }
    });
    
    player.on('ended', () => {
      onComplete?.();
    });
    
    // Add custom buttons to the player (e.g. 10 sec step)
    // You could expand the player controls here
    
    // Cleanup
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [lesson.id, onProgress, onComplete]); // Excluding videoUrls on purpose to prevent re-renders
  
  return (
    <div className="relative bg-black w-full h-full group">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Loader2 className="w-12 h-12 text-white animate-spin opacity-80" />
        </div>
      )}
      
      <div data-vjs-player className="w-full h-full">
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered vjs-theme-city w-full h-full"
          playsInline
        />
      </div>
      
      {/* Keyboard Shortcuts Overlay - only mounts after hydration */}
      <VideoKeyboardShortcuts />
      
      {/* Help prompt hint */}
      <div className="absolute top-4 right-4 bg-black/50 text-white/50 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500">
        Press '?' for shortcuts
      </div>
    </div>
  );
}
