'use client';

import { useMemo, useCallback } from 'react';

// Simplified debounce function to avoid pulling in external libraries just for this
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function useVideoProgress(lessonId: number) {
  // In a real application, these would use React Query or SWR to call an API
  
  const updateProgress = useCallback(async (data: { currentTime: number; duration: number }) => {
    // Simulated API call to save progress
    console.log(`[Video Progress] Saved at ${data.currentTime}s for lesson ${lessonId}`);
  }, [lessonId]);
  
  const markComplete = useCallback(async () => {
    // Simulated API call to mark complete
    console.log(`[Video Progress] Lesson ${lessonId} marked as COMPLETE!`);
    
    // In a real app we might show a toast and invalidate queries here
    // toast.success('Lesson marked as complete!');
  }, [lessonId]);
  
  // Debounced progress update (every 10 seconds)
  const debouncedUpdate = useMemo(
    () =>
      debounce((currentTime: number, duration: number) => {
        updateProgress({ currentTime, duration });
      }, 10000),
    [updateProgress]
  );
  
  return {
    updateProgress: debouncedUpdate,
    markComplete
  };
}
