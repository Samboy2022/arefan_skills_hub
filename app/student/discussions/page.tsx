"use client";

import { useState } from "react";
import { MessageSquare, Eye, Reply, Pin, ChevronLeft, Send, Paperclip, MoreVertical, MessageCircle, Search, Filter, Plus, Clock, TrendingUp, Users, Star, ThumbsUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/student/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ForumRichEditor } from "@/components/student/discussions/ForumRichEditor";
import { DISCUSSION_THREADS } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function DiscussionsPage() {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("recent");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyContents, setReplyContents] = useState<Record<string, string>>({});
  const [likes, setLikes] = useState<Record<string, { count: number; isLiked: boolean }>>({
    'main-topic': { count: 3, isLiked: false },
    'r1': { count: 4, isLiked: false },
    'r2': { count: 8, isLiked: false },
    'r3': { count: 2, isLiked: false },
  });
  
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
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      likes: 4,
      isHelpful: true
    },
    {
      id: "r2",
      author: "Dr. Sarah Johnson",
      content: "Excellent suggestion, Jane. John, typically for-loop issues in this module stem from accessing array elements outside of their bounds. I recommend using the debugger to step through each iteration.",
      timestamp: "2024-02-06T16:45:00",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      isInstructor: true,
      likes: 8,
      isHelpful: true
    },
    {
      id: "r3",
      author: "Mike Chen",
      content: "Thanks everyone! The debugger tip really helped. I was indeed accessing the array out of bounds. Fixed it by changing my condition from <= to <.",
      timestamp: "2024-02-06T18:30:00",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      likes: 2
    }
  ];

  const handleLike = (id: string) => {
    setLikes(prev => ({
      ...prev,
      [id]: {
        count: prev[id].isLiked ? prev[id].count - 1 : prev[id].count + 1,
        isLiked: !prev[id].isLiked
      }
    }));
  };

  const handleReply = (replyId: string) => {
    setActiveReplyId(activeReplyId === replyId ? null : replyId);
  };

  const handleSubmitReply = (replyId: string) => {
    const content = replyContents[replyId] || '';
    if (content.trim()) {
      console.log('Reply to', replyId, ':', content);
      // Handle reply submission here
      setReplyContents(prev => ({ ...prev, [replyId]: '' }));
      setActiveReplyId(null);
    }
  };

  const handleReplyContentChange = (replyId: string, content: string) => {
    setReplyContents(prev => ({ ...prev, [replyId]: content }));
  };

  if (activeThread) {
    return (
      <div className="flex flex-col space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveThreadId(null)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Forum
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Follow
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Discussion Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Original Post */}
            <Card className="border border-border bg-card">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={activeThread.author_avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {activeThread.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-foreground">{activeThread.author}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activeThread.created_at).toLocaleDateString()}
                      </span>
                      {activeThread.is_pinned && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs">
                          <Pin className="h-3 w-3" />
                          Pinned
                        </div>
                      )}
                    </div>
                    <h1 className="text-xl font-bold text-foreground mb-3">{activeThread.title}</h1>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      <p>Hey everyone, I'm working through the logic in module 2 and I've run into a bit of a snag with the nested for loops. My code seems to be running infinitely or producing unexpected results. Has anyone else encountered this? Any tips on how to properly debug the iteration cycles?</p>
                      <div className="mt-4 p-3 bg-muted/50 rounded-md font-mono text-xs">
                        <code>{`for (let i = 0; i <= array.length; i++) {
  for (let j = 0; j <= array[i].length; j++) {
    // Processing logic here
  }
}`}</code>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Reply className="h-4 w-4" />
                      {activeThread.replies_count} replies
                    </span>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      {activeThread.views} views
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleLike('main-topic')}
                      className={likes['main-topic'].isLiked ? 'text-primary' : 'text-muted-foreground'}
                    >
                      <ThumbsUp className={`h-4 w-4 mr-2 ${likes['main-topic'].isLiked ? 'fill-current' : ''}`} />
                      Helpful ({likes['main-topic'].count})
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReply('main-topic')}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reply Form for Main Topic */}
            {activeReplyId === 'main-topic' && (
              <Card className="border border-border bg-card">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">Reply to main topic</h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setActiveReplyId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <ForumRichEditor
                      content={replyContents['main-topic'] || ''}
                      onChange={(content) => handleReplyContentChange('main-topic', content)}
                      placeholder="Share your thoughts, provide help, or ask follow-up questions..."
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Paperclip className="h-4 w-4 mr-2" />
                          Attach File
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveReplyId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleSubmitReply('main-topic')}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Post Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Replies Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  {mockReplies.length} Replies
                </h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Sort by
                  </Button>
                </div>
              </div>
              
              {mockReplies.map((reply, index) => (
                <div key={reply.id} className="space-y-4">
                  <Card className="border border-border bg-card">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={reply.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {reply.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-foreground">{reply.author}</h4>
                            {reply.isInstructor && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                Instructor
                              </span>
                            )}
                            {reply.isHelpful && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                Helpful Answer
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(reply.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed mb-4">
                            {reply.content}
                          </div>
                          <div className="flex items-center gap-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={likes[reply.id]?.isLiked ? 'text-primary' : 'text-muted-foreground'}
                              onClick={() => handleLike(reply.id)}
                            >
                              <ThumbsUp className={`h-4 w-4 mr-2 ${likes[reply.id]?.isLiked ? 'fill-current' : ''}`} />
                              {likes[reply.id]?.count || reply.likes}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-muted-foreground"
                              onClick={() => handleReply(reply.id)}
                            >
                              <Reply className="h-4 w-4 mr-2" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Individual Reply Form */}
                  {activeReplyId === reply.id && (
                    <Card className="border border-border bg-card ml-14">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-foreground">Reply to {reply.author}</h4>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setActiveReplyId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <ForumRichEditor
                            content={replyContents[reply.id] || ''}
                            onChange={(content) => handleReplyContentChange(reply.id, content)}
                            placeholder={`Reply to ${reply.author}...`}
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Paperclip className="h-4 w-4 mr-2" />
                                Attach File
                              </Button>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => setActiveReplyId(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleSubmitReply(reply.id)}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Post Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Thread Stats */}
            <Card className="border border-border bg-card p-4">
              <h4 className="font-semibold text-foreground mb-3">Thread Stats</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">2 days ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last reply</span>
                  <span className="text-sm font-medium">4 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Participants</span>
                  <span className="text-sm font-medium">4 users</span>
                </div>
              </div>
            </Card>

            {/* Related Threads */}
            <Card className="border border-border bg-card p-4">
              <h4 className="font-semibold text-foreground mb-3">Related Discussions</h4>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="group cursor-pointer">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      Debugging async operations in module {i+2}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{5+i} replies</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{i} hours ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Forum Guidelines */}
            <Card className="border border-border bg-card p-4">
              <h4 className="font-semibold text-foreground mb-3">Forum Guidelines</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  Be respectful and professional
                </li>
                <li className="flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  Search before posting
                </li>
                <li className="flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  Use code blocks for snippets
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb 
        items={[
          { label: "Discussions" }
        ]}
        className="mb-6"
      />
      
      <PageHeader
        title="Discussion Forum"
        description="Connect with classmates and get help with your coursework"
      />

      {/* Forum Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="border-sky-200 dark:border-sky-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Threads</p>
              <p className="text-xs text-muted-foreground">All discussions</p>
            </div>
            <div className="rounded-full p-1.5 bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">{DISCUSSION_THREADS.length}</p>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unread</p>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </div>
            <div className="rounded-full p-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">{unreadThreadsCount}</p>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">My Posts</p>
              <p className="text-xs text-muted-foreground">Your contributions</p>
            </div>
            <div className="rounded-full p-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Reply className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">12</p>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-xs text-muted-foreground">Online now</p>
            </div>
            <div className="rounded-full p-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold leading-none">24</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeFilter === "recent" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("recent")}
            className="font-medium"
          >
            <Clock className="h-4 w-4 mr-2" />
            Recent
          </Button>
          <Button
            variant={activeFilter === "popular" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("popular")}
            className="font-medium"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Popular
          </Button>
          <Button
            variant={activeFilter === "unanswered" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("unanswered")}
            className="font-medium"
          >
            Unanswered
          </Button>
        </div>
        <Button className="font-medium">
          <Plus className="h-4 w-4 mr-2" />
          New Thread
        </Button>
      </div>

      {/* Pinned Threads */}
      {pinnedThreads.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Pin className="h-5 w-5 text-amber-500" />
            Pinned Discussions
          </h3>
          <div className="space-y-3">
            {pinnedThreads.map(thread => (
              <Card
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className="p-4 border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Pin className="h-4 w-4 text-amber-600" />
                      <h4 className="font-semibold text-foreground line-clamp-1">
                        {thread.title}
                      </h4>
                      {thread.has_unread && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={thread.author_avatar} />
                          <AvatarFallback className="text-xs">{thread.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{thread.author}</span>
                      </div>
                      <span>•</span>
                      <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 ml-4">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-foreground">{thread.replies_count}</div>
                      <div className="text-xs text-muted-foreground">replies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-foreground">{thread.views}</div>
                      <div className="text-xs text-muted-foreground">views</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Threads */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent Discussions
        </h3>
        <div className="space-y-3">
          {regularThreads.map(thread => (
            <Card
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              className={cn(
                "p-4 border transition-colors cursor-pointer",
                thread.has_unread 
                  ? "border-primary/40 bg-primary/5 hover:bg-primary/10" 
                  : "border-border hover:border-primary/50 bg-card"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className={cn(
                      "font-semibold line-clamp-1",
                      thread.has_unread ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {thread.title}
                    </h4>
                    {thread.has_unread && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={thread.author_avatar} />
                        <AvatarFallback className="text-xs">{thread.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{thread.author}</span>
                    </div>
                    <span>•</span>
                    <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 ml-4">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">{thread.replies_count}</div>
                    <div className="text-xs text-muted-foreground">replies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">{thread.views}</div>
                    <div className="text-xs text-muted-foreground">views</div>
                  </div>
                  <ChevronLeft className="h-5 w-5 rotate-180 text-muted-foreground" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
