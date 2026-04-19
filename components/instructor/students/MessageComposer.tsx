"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageComposerProps {
  onSend: (text: string) => void;
}

export function MessageComposer({ onSend }: MessageComposerProps) {
  const [text, setText] = React.useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const chars = text.length;

  return (
    <div className="rounded-xl border bg-card p-3 shadow-sm flex flex-col gap-2">
      <textarea
        className="w-full min-h-[80px] max-h-[200px] resize-y bg-transparent outline-none text-sm placeholder:text-muted-foreground p-1"
        placeholder="Type a message... (Ctrl+Enter to send)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={2000}
      />
      <div className="flex justify-between items-center px-1">
        <span className={`text-xs ${chars > 1800 ? "text-amber-600" : "text-muted-foreground"}`}>
          {chars > 1800 ? `${chars} / 2000` : ""}
        </span>
        <Button 
          size="sm" 
          onClick={handleSend} 
          disabled={!text.trim()}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Send className="h-4 w-4" /> Send
        </Button>
      </div>
    </div>
  );
}
