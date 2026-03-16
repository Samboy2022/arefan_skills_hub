'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function VideoKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Show/hide help (prevent triggering in input fields)
      if (
        (e.key === '?' || e.key === 'h') && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        setShowHelp(prev => !prev);
      }
      
      // Close on escape
      if (e.key === 'Escape') {
        setShowHelp(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  if (!showHelp) return null;
  
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4 transition-opacity">
      <Card className="max-w-md w-full bg-white animate-in zoom-in-95 duration-200">
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <CardTitle className="text-xl">Keyboard Shortcuts</CardTitle>
          <button 
            onClick={() => setShowHelp(false)}
            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 transition"
          >
            ×
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm mt-2">
            <ShortcutRow shortcut="Space / K" description="Play/Pause" />
            <ShortcutRow shortcut="←" description="Rewind 5 seconds" />
            <ShortcutRow shortcut="→" description="Forward 5 seconds" />
            <ShortcutRow shortcut="↑" description="Volume up" />
            <ShortcutRow shortcut="↓" description="Volume down" />
            <ShortcutRow shortcut="M" description="Mute/Unmute" />
            <ShortcutRow shortcut="F" description="Fullscreen" />
            <ShortcutRow shortcut="0-9" description="Jump to 0%-90%" />
            <ShortcutRow shortcut="< >" description="Decrease/Increase speed" />
            <ShortcutRow shortcut="?" description="Show/Hide this help" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ShortcutRow({ shortcut, description }: { shortcut: string; description: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono text-gray-700 shadow-sm">
        {shortcut}
      </kbd>
      <span className="text-gray-600 font-medium">{description}</span>
    </div>
  );
}
