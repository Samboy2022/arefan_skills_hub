"use client";

import * as React from "react";
import { MessageThread as MessageType } from "@/lib/instructor-mock-data";

interface MessageThreadProps {
  messages: MessageType[];
}

export function MessageThread({ messages }: MessageThreadProps) {
  const endOfMessagesRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-12">
        <div className="bg-muted rounded-full p-4 mb-4">
          <svg className="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p>No messages yet. Start the conversation below.</p>
      </div>
    );
  }

  // Group by date
  const grouped = messages.reduce((acc, msg) => {
    const d = msg.sentAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    if (!acc[d]) acc[d] = [];
    acc[d].push(msg);
    return acc;
  }, {} as Record<string, MessageType[]>);

  const formatTime = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const isToday = (dStr: string) => {
    return dStr === new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isYesterday = (dStr: string) => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return dStr === y.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {Object.entries(grouped).map(([dateStr, msgs]) => (
        <div key={dateStr} className="space-y-6">
          <div className="flex justify-center">
            <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
              {isToday(dateStr) ? "Today" : isYesterday(dateStr) ? "Yesterday" : dateStr}
            </span>
          </div>

          <div className="space-y-4">
            {msgs.map((msg) => {
              const isInstructor = msg.senderRole === "instructor";
              return (
                <div key={msg.id} className={`flex flex-col ${isInstructor ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className="flex items-center gap-2 mb-1.5 px-1">
                    <span className="text-xs font-semibold text-foreground">
                      {isInstructor ? "You" : msg.senderName}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{formatTime(msg.sentAt)}</span>
                  </div>
                  <div 
                    className={`max-w-[80%] px-4 py-2.5 text-sm ${
                      isInstructor 
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm" 
                        : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {msg.body}
                  </div>
                  {isInstructor && msg.readAt && (
                    <span className="text-[10px] text-muted-foreground mt-1 mr-1">✓ Read</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
