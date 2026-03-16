"use client";

import { useState } from "react";
import { MessageSquare, Eye, Reply, Pin, ChevronLeft, Send, Paperclip, MoreVertical, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DISCUSSION_THREADS } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";

export default function DiscussionsPage() {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  
  const activeThread = DISCUSSION_THREADS.find(t => t.id === activeThreadId);
  const unreadThreadsCount = DISCUSSION_THREADS.filter(t => t.has_unread).length;
  const pinnedThreads = DISCUSSION_THREADS.filter(t => t.is_pinned);
  const regularThreads = DISCUSSION_THREADS.filter(t => !t.is_pinned);

  // Mock replies for the detail view
  const mockReplies = [
    {
      id: "r1",
      author: "Jane Smith",
      content: "I've been having the same issue! I found that adjusting the termination condition in the loop fixed it for me. Have you tried checking if your index is off by one?",
      timestamp: "2024-02-06T15:20:00",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
    },
    {
      id: "r2",
      author: "Dr. Sarah Johnson",
      content: "Excellent suggestion, Jane. John, typically for-loop issues in this module stem from accessing array elements outside of their bounds. I recommend using the debugger to step through each iteration.",
      timestamp: "2024-02-06T16:45:00",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      isInstructor: true
    }
  ];

  if (activeThread) {
    return (
      <div className="flex flex-col h-full space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveThreadId(null)}
            className="flex items-center gap-2 border-border hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Discussions
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Discussion Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border shadow-none rounded-md bg-card overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={activeThread.author_avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {activeThread.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{activeThread.author}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        Posted on {new Date(activeThread.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {activeThread.is_pinned && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 text-amber-600 rounded-md border border-amber-500/20">
                      <Pin className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">Pinned</span>
                    </div>
                  )}
                </div>
                
                <h1 className="text-2xl font-bold text-foreground mb-4 leading-tight">{activeThread.title}</h1>
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                  <p>Hey everyone, I'm working through the logic in module 2 and I've run into a bit of a snag with the nested for loops. My code seems to be running infinitely or producing unexpected results. Has anyone else encountered this? Any tips on how to properly debug the iteration cycles?</p>
                </div>
              </div>
              <div className="px-6 py-4 bg-muted/5 border-t border-border flex items-center justify-between">
                <div className="flex gap-4">
                  <span className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Reply className="h-4 w-4" />
                    {activeThread.replies_count} Replies
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Eye className="h-4 w-4" />
                    {activeThread.views} Views
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-primary font-semibold hover:bg-primary/5">
                  Follow Thread
                </Button>
              </div>
            </Card>

            {/* Replies Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Replies ({mockReplies.length})</h3>
              {mockReplies.map((reply) => (
                <Card key={reply.id} className="border border-border shadow-none rounded-md bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src={reply.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {reply.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-foreground">{reply.author}</h4>
                          {reply.isInstructor && (
                            <span className="px-1.5 py-0.5 bg-brand/10 text-brand text-[9px] font-bold uppercase rounded border border-brand/20">Staff</span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {new Date(reply.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed px-1">
                    {reply.content}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50 flex gap-4">
                    <button className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">Helpful (4)</button>
                    <button className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">Reply</button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick Reply Form */}
            <Card className="border border-border shadow-none rounded-md bg-card p-6">
              <h4 className="font-semibold text-sm mb-4">Add your contribution</h4>
              <div className="space-y-4">
                <textarea 
                  rows={4}
                  placeholder="Share your thoughts or help a classmate..."
                  className="w-full p-4 text-sm rounded-md border border-border bg-muted/5 focus:outline-none focus:ring-1 focus:ring-primary/30 shadow-none resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9 border-border text-muted-foreground">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button className="font-semibold shadow-none">Post Reply</Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <Card className="border border-border shadow-none rounded-md bg-card p-6">
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Forum Guidelines</h4>
              <ul className="space-y-3">
                <li className="flex gap-3 text-xs text-muted-foreground leading-relaxed">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Be respectful and professional in your interactions.
                </li>
                <li className="flex gap-3 text-xs text-muted-foreground leading-relaxed">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Check if your question has been answered before posting.
                </li>
                <li className="flex gap-3 text-xs text-muted-foreground leading-relaxed">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Use code blocks for sharing snippets to ensure readability.
                </li>
              </ul>
            </Card>

            <Card className="border border-border shadow-none rounded-md bg-muted/30 p-6">
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Related Topics</h4>
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="group cursor-pointer">
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      Debugging asynchronous operations in module {i+2}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-muted-foreground">8 Replies</span>
                      <span className="text-[10px] text-muted-foreground">2 hours ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Discussion Forums"
        description="Engage with classmates and ask questions"
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="p-5 text-center border border-border shadow-none rounded-md bg-card">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Threads</p>
          <p className="text-3xl font-bold text-foreground">{DISCUSSION_THREADS.length}</p>
        </Card>
        <Card className="p-5 text-center border border-border shadow-none rounded-md bg-card relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Unread</p>
          <p className="text-3xl font-bold text-primary">{unreadThreadsCount}</p>
        </Card>
        <Card className="p-5 text-center border border-border shadow-none rounded-md bg-card">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">My Replies</p>
          <p className="text-3xl font-bold text-foreground">12</p>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
        <div className="flex gap-4">
          <Button variant="secondary" size="sm" className="font-bold text-xs uppercase tracking-wider shadow-none border border-border/50">Recent</Button>
          <Button variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Unanswered</Button>
          <Button variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">My Posts</Button>
        </div>
        <Button className="font-bold shadow-none rounded-md">New Discussion</Button>
      </div>

      {/* Pinned Threads */}
      {pinnedThreads.length > 0 && (
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-3">
            <Pin className="h-4 w-4 text-amber-500 fill-amber-500" />
            Pinned Discussions
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {pinnedThreads.map(thread => (
              <Card
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className="p-5 border border-border shadow-none rounded-md hover:border-primary/50 transition-all cursor-pointer bg-card group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">{thread.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-5 w-5 border border-border">
                        <AvatarImage src={thread.author_avatar} />
                        <AvatarFallback className="text-[8px] font-bold">{thread.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                        Started by {thread.author}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {thread.replies_count}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <Eye className="h-3.5 w-3.5" />
                      {thread.views}
                    </span>
                  </div>
                  {thread.has_unread && (
                    <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[9px] font-bold uppercase rounded-full">New</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Threads */}
      <div className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-3">
          <MessageSquare className="h-4 w-4" />
          General Discussion
        </h3>
        <div className="space-y-3">
          {regularThreads.map(thread => (
            <Card
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              className={cn(
                "p-4 border shadow-none rounded-md transition-all cursor-pointer group",
                thread.has_unread ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/50 bg-card"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className={cn(
                      "text-base leading-snug group-hover:text-primary transition-colors line-clamp-1",
                      thread.has_unread ? "font-bold text-foreground" : "font-semibold text-muted-foreground"
                    )}>
                      {thread.title}
                    </h4>
                    {thread.has_unread && (
                      <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      BY {thread.author}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">•</span>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {new Date(thread.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-6 items-center flex-shrink-0 ml-4">
                  <div className="hidden sm:flex flex-col items-center">
                    <span className="text-sm font-bold text-foreground">{thread.replies_count}</span>
                    <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Replies</span>
                  </div>
                  <div className="hidden sm:flex flex-col items-center">
                    <span className="text-sm font-bold text-foreground">{thread.views}</span>
                    <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Views</span>
                  </div>
                  <span className="p-2 text-muted-foreground group-hover:text-primary transition-colors">
                    <ChevronLeft className="h-5 w-5 rotate-180" />
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
