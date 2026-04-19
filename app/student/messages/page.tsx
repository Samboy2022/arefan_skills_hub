"use client";

import { useState, useMemo } from "react";
import { MessageSquare, Send, Search, User, MoreVertical, Paperclip, Smile, ChevronLeft, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { STUDENT_MESSAGES } from "@/lib/student-mock-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";

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
    <div className="flex flex-col h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)]">
      <Breadcrumb 
        items={[
          { label: "Messages" }
        ]}
        className="mb-3 shrink-0"
      />
      
      <div className="flex-1 flex overflow-hidden border border-border rounded-xl bg-card shadow-sm">
        {/* Conversations Sidebar */}
        <div className={cn(
          "w-full md:w-80 border-r border-border flex flex-col bg-muted/10 transition-all",
          showMobileChat ? "hidden md:flex" : "flex"
        )}>
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-extrabold text-foreground tracking-tight">Messages</h1>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={cn(
                  "w-full p-4 flex gap-3 text-left border-b border-border/40 last:border-0 transition-colors group",
                  activeConversationId === conv.id ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-muted/40"
                )}
              >
                <div className="relative">
                  <Avatar className="h-11 w-11 shadow-sm">
                    <AvatarImage src={conv.lastMessage.sender_avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {conv.lastMessage.sender_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-primary rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className={cn(
                      "font-semibold text-[13px] truncate",
                      activeConversationId === conv.id ? "text-primary dark:text-foreground" : "text-foreground group-hover:text-primary transition-colors"
                    )}>
                      {conv.lastMessage.sender_name}
                    </p>
                    <span className={cn(
                      "text-[10px] uppercase font-bold tracking-wider",
                      conv.unreadCount > 0 ? "text-primary" : "text-muted-foreground"
                    )}>
                      {format(new Date(conv.lastMessage.timestamp), 'HH:mm')}
                    </span>
                  </div>
                  <p className={cn(
                    "text-[13px] truncate leading-relaxed",
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
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card text-card-foreground">
                <div className="flex items-center gap-3.5">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden h-8 w-8 -ml-2 text-muted-foreground" 
                    onClick={() => setShowMobileChat(false)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10 shadow-sm border border-border">
                    <AvatarImage src={activeConversation.lastMessage.sender_avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {activeConversation.lastMessage.sender_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-sm leading-none text-foreground">{activeConversation.lastMessage.sender_name}</h4>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="h-1.5 w-1.5 bg-green-500 rounded-full"></span>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Online</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted/50">
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
                        "max-w-[75%] space-y-1.5",
                        isMe ? "items-end text-right" : "items-start"
                      )}>
                        <div className={cn(
                          "px-4 py-2.5 rounded-lg text-sm border shadow-none",
                          isMe 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "bg-card text-foreground border-border"
                        )}>
                          {msg.content}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium px-1">
                          {format(new Date(msg.timestamp), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border bg-background">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                  <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-muted/50 rounded-md">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="relative flex-1">
                    <textarea
                      rows={1}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a professional message..."
                      className="w-full pl-4 pr-10 py-2.5 text-sm rounded-md border border-border bg-muted/5 focus:outline-none focus:ring-1 focus:ring-primary/30 shadow-none resize-none min-h-[42px] max-h-[120px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e as any);
                        }
                      }}
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 bottom-1.5 h-7 w-7 text-muted-foreground hover:bg-muted/50 rounded-md">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button type="submit" size="icon" disabled={!messageInput.trim()} className="h-10 w-10 rounded-md shadow-none shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-muted/5">
              <div className="p-6 rounded-md bg-muted/20 mb-4 border border-border/50">
                <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Your Inbox</h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-2 leading-relaxed">
                Select a conversation from the sidebar to view the message history and start chatting with your peers and instructors.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
