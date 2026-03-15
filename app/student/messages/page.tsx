"use client";

import { useState, useMemo } from "react";
import { MessageSquare, Send, Search, User, MoreVertical, Paperclip, Smile, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { STUDENT_MESSAGES } from "@/lib/student-mock-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    STUDENT_MESSAGES.length > 0 ? STUDENT_MESSAGES[0].conversation_id : null
  );
  const [messageInput, setMessageInput] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Group messages by conversation
  const conversations = useMemo(() => {
    const groups: Record<string, typeof STUDENT_MESSAGES> = {};
    STUDENT_MESSAGES.forEach(msg => {
      if (!groups[msg.conversation_id]) {
        groups[msg.conversation_id] = [];
      }
      groups[msg.conversation_id].push(msg);
    });
    
    // Sort conversations by the timestamp of the last message
    return Object.entries(groups).map(([id, msgs]) => ({
      id,
      messages: msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
      lastMessage: msgs[msgs.length - 1],
      unreadCount: msgs.filter(m => !m.is_read).length
    })).sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
  }, []);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setMessageInput("");
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setShowMobileChat(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader
        title="Messages"
        description="Communicate with instructors and classmates"
      />

      <div className="flex-1 flex overflow-hidden border rounded-xl bg-card shadow-sm mt-4">
        {/* Conversations Sidebar */}
        <div className={cn(
          "w-full md:w-80 border-r flex flex-col bg-muted/10 transition-all",
          showMobileChat ? "hidden md:flex" : "flex"
        )}>
          <div className="p-4 border-b bg-background/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={cn(
                  "w-full p-4 flex gap-3 text-left border-b last:border-0 transition-colors hover:bg-muted/50",
                  activeConversationId === conv.id ? "bg-muted shadow-inner" : ""
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={conv.lastMessage.sender_avatar} />
                    <AvatarFallback>{conv.lastMessage.sender_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-brand rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="font-bold text-sm truncate">{conv.lastMessage.sender_name}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {format(new Date(conv.lastMessage.timestamp), 'HH:mm')}
                    </span>
                  </div>
                  <p className={cn(
                    "text-xs truncate",
                    conv.unreadCount > 0 ? "font-bold text-foreground" : "text-muted-foreground"
                  )}>
                    {conv.lastMessage.content}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Window */}
        <div className={cn(
          "flex-1 flex-col bg-background transition-all",
          showMobileChat ? "flex" : "hidden md:flex"
        )}>
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between bg-muted/5">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden h-8 w-8 -ml-1 text-muted-foreground hover:bg-muted" 
                    onClick={() => setShowMobileChat(false)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={activeConversation.lastMessage.sender_avatar} />
                    <AvatarFallback>{activeConversation.lastMessage.sender_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-sm leading-none">{activeConversation.lastMessage.sender_name}</h4>
                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-1 block">Online</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/5">
                {activeConversation.messages.map((msg) => {
                  const isMe = msg.sender_id === 'student-id'; // Simplified check
                  return (
                    <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[70%] space-y-1",
                        isMe ? "items-end" : "items-start"
                      )}>
                        <div className={cn(
                          "px-4 py-2.5 rounded-2xl text-sm shadow-sm border",
                          isMe 
                            ? "bg-brand text-white border-brand rounded-tr-none" 
                            : "bg-background text-foreground border-border rounded-tl-none"
                        )}>
                          {msg.content}
                        </div>
                        <p className="text-[10px] text-muted-foreground px-1">
                          {format(new Date(msg.timestamp), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-muted/5">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground rounded-full">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a professional message..."
                      className="w-full pl-4 pr-10 py-2.5 text-sm rounded-full border bg-background focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground rounded-full">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button type="submit" size="icon" disabled={!messageInput.trim()} className="h-10 w-10 rounded-full shadow-md">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-muted/5">
              <div className="p-6 rounded-full bg-muted/20 mb-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <h3 className="font-bold text-lg">Your Inbox</h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-2">
                Select a conversation from the sidebar to view the message history and start chatting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
