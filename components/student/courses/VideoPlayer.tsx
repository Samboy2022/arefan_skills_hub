'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Loader2 } from 'lucide-react';
import { VideoKeyboardShortcuts } from './VideoKeyboardShortcuts';
import { registerQualitySelector } from '@/lib/videojs-plugins/qualitySelector';

// Ensures video.js control bar is clearly visible on hover
const VJS_STYLES = `
  .video-js .vjs-control-bar {
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%);
    height: 52px;
    padding: 0 8px;
    display: flex;
    align-items: center;
  }
  .video-js .vjs-button > .vjs-icon-placeholder::before,
  .video-js .vjs-button > .vjs-icon-placeholder:before {
    font-size: 2em;
    line-height: 1.6;
  }
  .video-js .vjs-time-control { font-size: 13px; line-height: 52px; }
  .video-js .vjs-progress-control { height: 100%; }
  .video-js .vjs-progress-holder { margin: 0 4px; }
  .video-js.vjs-playing .vjs-tech { pointer-events: none; }
  .video-js .vjs-big-play-button {
    border-radius: 50%;
    width: 64px;
    height: 64px;
    line-height: 64px;
    margin-left: -32px;
    margin-top: -32px;
    background: rgba(0,0,0,0.6);
    border: 2px solid rgba(255,255,255,0.8);
    font-size: 1.8em;
  }
  .video-js:hover .vjs-big-play-button,
  .video-js .vjs-big-play-button:focus {
    background: rgba(0,0,0,0.8);
  }
`;

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
      inactivityTimeout: 2000,
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
      {/* Inject video.js control bar styles */}
      <style dangerouslySetInnerHTML={{ __html: VJS_STYLES }} />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Loader2 className="w-12 h-12 text-white animate-spin opacity-80" />
        </div>
      )}
      
      <div data-vjs-player className="w-full h-full">
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered w-full h-full"
          playsInline
        />
      </div>
      
      {/* Keyboard Shortcuts Overlay */}
      <VideoKeyboardShortcuts />
      
      {/* Help hint */}
      <div className="absolute top-3 right-3 bg-black/50 text-white/60 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-300">
        Press '?' for shortcuts
      </div>
    </div>
  );
}
