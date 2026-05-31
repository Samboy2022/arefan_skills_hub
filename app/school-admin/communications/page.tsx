"use client";

import { useState } from "react";
import {
  MessageSquare, Plus, ChevronRight, Pin, Eye, MessageCircle,
  ArrowLeft, Send, ThumbsUp, Pencil, Trash2, X, CheckCircle,
  Search, Reply, AlertTriangle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ForumRichEditor } from "@/components/student/discussions/ForumRichEditor";
import { DISCUSSION_THREADS, STUDENT_COURSES } from "@/lib/student-mock-data";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { format } from "date-fns";
import type { DiscussionThread, DiscussionComment } from "@/lib/student-types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ── Types & Helpers ────────────────────────────────────────────────────────────
type AdminDiscussionReply = DiscussionComment["replies"][0] & {
  is_admin?: boolean;
  is_instructor?: boolean;
};

type AdminDiscussionComment = Omit<DiscussionComment, "replies"> & {
  replies: AdminDiscussionReply[];
  is_admin?: boolean;
};

type AdminDiscussionThread = Omit<DiscussionThread, "comments"> & {
  is_gradable?: boolean;
  mark_obtainable?: number;
  comments?: AdminDiscussionComment[];
};

const CURRENT_USER_ID = "school_admin_1";
const CURRENT_USER_NAME = "School Admin";
const CURRENT_USER_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin";

const formatDate = (d: string) => {
  try { return format(new Date(d), "MMM dd, yyyy 'at' h:mm a"); } catch { return d; }
};

// ── Thread Row ─────────────────────────────────────────────────────────────────
function ThreadRow({ thread, onClick }: { thread: AdminDiscussionThread; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors border-b border-border last:border-b-0"
    >
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={thread.author_avatar} />
        <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
          {thread.author?.charAt(0) || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {thread.is_pinned && <Pin className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
          {thread.has_unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
          <p className={cn("text-sm font-semibold line-clamp-1", thread.has_unread ? "text-foreground" : "text-foreground/80")}>
            {thread.title}
          </p>
          {thread.is_gradable && (
            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Gradable
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{thread.description}</p>
        <p className="text-[11px] text-muted-foreground">{thread.author} · {formatDate(thread.created_at)}</p>
      </div>
      <div className="flex items-center gap-4 shrink-0 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{thread.replies_count}</span>
        <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{thread.views}</span>
        <ChevronRight className="h-4 w-4" />
      </div>
    </button>
  );
}

// ── Thread Detail View ─────────────────────────────────────────────────────────
function ThreadDetailView({
  thread,
  onBack,
  isGeneral,
  onEdit,
  onDelete,
}: {
  thread: AdminDiscussionThread;
  onBack: () => void;
  isGeneral: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const [comments, setComments] = useState<AdminDiscussionComment[]>(thread.comments ?? []);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = thread.author_id === CURRENT_USER_ID;

  const handleComment = () => {
    if (!commentText.trim()) return;
    const newComment: AdminDiscussionComment = {
      id: `c${Date.now()}`,
      thread_id: thread.id,
      author: CURRENT_USER_NAME,
      author_avatar: CURRENT_USER_AVATAR,
      content: commentText,
      created_at: new Date().toISOString(),
      likes: 0,
      replies: [],
      is_admin: true, // Special Admin Flag
    };
    setComments(prev => [...prev, newComment]);
    setCommentText("");
  };

  const handleReply = (commentId: string) => {
    const text = replyTexts[commentId];
    if (!text?.trim()) return;
    setComments(prev => prev.map(c => {
      if (c.id !== commentId) return c;
      return {
        ...c,
        replies: [...c.replies, {
          id: `r${Date.now()}`,
          comment_id: commentId,
          author: CURRENT_USER_NAME,
          author_avatar: CURRENT_USER_AVATAR,
          content: text,
          created_at: new Date().toISOString(),
          likes: 0,
          is_admin: true, // Special Admin Flag
        }]
      };
    }));
    setReplyTexts(prev => ({ ...prev, [commentId]: "" }));
    setReplyingTo(null);
  };

  const toggleLike = (id: string) => {
    setLikedComments(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={[
        { label: "Communications", href: "/school-admin/communications" },
        { label: isGeneral ? "General Forum" : "Course Forum", href: "#" },
        { label: thread.title },
      ]} />

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" /> Edit Thread
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-red-600 hover:text-red-700 border-red-200" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="h-3.5 w-3.5" /> Moderate & Delete
          </Button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1">Delete this thread?</p>
            <p className="text-xs text-muted-foreground mb-3">This action cannot be undone. All comments and replies will be permanently removed.</p>
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={onDelete}>Yes, Continue to delete</Button>
              <Button size="sm" variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <Card className="border-border">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10 shrink-0 border-2 border-background shadow-sm">
              <AvatarImage src={thread.author_avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">{thread.author?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-sm text-foreground">{thread.author}</span>
                {isOwner && <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">School Admin (You)</span>}
                <span className="text-xs text-muted-foreground">{formatDate(thread.created_at)}</span>
                {thread.is_pinned && <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 uppercase"><Pin className="h-3 w-3"/>Pinned</span>}
                {thread.is_gradable && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                    <CheckCircle className="h-3 w-3" /> Gradable ({thread.mark_obtainable} pts)
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-foreground mb-3">{thread.title}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">{thread.description}</p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{comments.length} comments</span>
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{thread.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {comments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{comments.length} Comment{comments.length !== 1 ? "s" : ""}</h3>
          {comments.map(comment => (
            <Card key={comment.id} className="border-border">
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={comment.author_avatar} />
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">{comment.author?.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{comment.author}</span>
                      {(comment.is_admin || comment.is_instructor) && (
                         <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                           {comment.is_admin ? "School Admin" : "Instructor"}
                         </span>
                      )}
                      {comment.is_helpful && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                          <CheckCircle className="h-3 w-3" /> Helpful
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mb-3">{comment.content}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLike(comment.id)}
                        className={cn("flex items-center gap-1.5 text-xs font-medium transition-colors", likedComments.has(comment.id) ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                      >
                        <ThumbsUp className={cn("h-3.5 w-3.5", likedComments.has(comment.id) && "fill-current")} />
                        {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
                      </button>
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Reply className="h-3.5 w-3.5" /> Reply
                      </button>
                    </div>

                    {comment.replies.length > 0 && (
                      <div className="mt-4 space-y-3 pl-4 border-l-2 border-border">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarImage src={reply.author_avatar} />
                              <AvatarFallback className="text-[10px] font-bold bg-muted">{reply.author?.charAt(0) || "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-semibold text-foreground">{reply.author}</span>
                                {(reply.is_admin || reply.is_instructor) && (
                                   <span className="text-[9px] font-bold uppercase px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                     {reply.is_admin ? "School Admin" : "Instructor"}
                                   </span>
                                )}
                                <span className="text-[11px] text-muted-foreground">{formatDate(reply.created_at)}</span>
                              </div>
                              <p className="text-xs text-foreground leading-relaxed">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {replyingTo === comment.id && (
                      <div className="mt-3 pl-4 border-l-2 border-primary/30 space-y-2">
                        <Textarea
                          value={replyTexts[comment.id] ?? ""}
                          onChange={e => setReplyTexts(prev => ({ ...prev, [comment.id]: e.target.value }))}
                          placeholder={`Reply to ${comment.author}...`}
                          className="min-h-[80px] text-sm resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>Cancel</Button>
                          <Button size="sm" className="gap-1.5" onClick={() => handleReply(comment.id)}>
                            <Send className="h-3.5 w-3.5" /> Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Leave a Comment</h3>
        <Textarea
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder="Type your administrative response here..."
          className="min-h-[100px] text-sm resize-none"
        />
        <div className="flex justify-end">
          <Button disabled={!commentText.trim()} onClick={handleComment} className="gap-2">
            <Send className="h-4 w-4" /> Comment
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Create General Thread Form ─────────────────────────────────────────────────
function CreateGeneralThreadForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (t: AdminDiscussionThread) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!title.trim() || !description.trim()) return;
    const thread: AdminDiscussionThread = {
      id: `gen${Date.now()}`,
      course_id: null,
      forum_type: "general",
      title,
      description,
      author: CURRENT_USER_NAME,
      author_id: CURRENT_USER_ID,
      author_avatar: CURRENT_USER_AVATAR,
      created_at: new Date().toISOString(),
      replies_count: 0,
      views: 0,
      is_pinned: false,
      has_unread: false,
      comments: [],
    };
    onSubmit(thread);
  };

  return (
    <div className="space-y-5 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb items={[
        { label: "Communications", href: "/school-admin/communications" },
        { label: "General Forum", href: "#" },
        { label: "New General Discussion" },
      ]} />
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Create General Forum Discussion</h2>
        <p className="text-sm text-muted-foreground">Start a generalized thread available to everyone.</p>
      </div>
      <div className="space-y-5 bg-card border rounded-lg p-6 shadow-sm">
        <div>
          <Label className="text-sm font-semibold block mb-2">Thread Title *</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Important Announcement: System Maintenance" />
        </div>
        <div>
          <Label className="text-sm font-semibold block mb-2">Description *</Label>
          <ForumRichEditor content={description} onChange={setDescription} placeholder="Let the community know what you are thinking..." />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={onCancel}><ArrowLeft className="h-4 w-4 mr-1.5" /> Cancel</Button>
        <Button disabled={!title.trim() || !description.trim()} onClick={handleCreate} className="gap-2">
          <Send className="h-4 w-4" /> Create Thread
        </Button>
      </div>
    </div>
  );
}

// ── Create Course Thread Form ──────────────────────────────────────────────────
function CreateCourseThreadForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (t: AdminDiscussionThread) => void }) {
  const [courseId, setCourseId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isGradable, setIsGradable] = useState(false);
  const [markObtainable, setMarkObtainable] = useState<number>(0);

  const handleCreate = () => {
    if (!title.trim() || !description.trim() || !courseId) return;
    const thread: AdminDiscussionThread = {
      id: `crs${Date.now()}`,
      course_id: courseId,
      forum_type: "course",
      title,
      description,
      author: CURRENT_USER_NAME,
      author_id: CURRENT_USER_ID,
      author_avatar: CURRENT_USER_AVATAR,
      created_at: new Date().toISOString(),
      replies_count: 0,
      views: 0,
      is_pinned: false,
      has_unread: false,
      comments: [],
      is_gradable: isGradable,
      mark_obtainable: isGradable ? markObtainable : undefined,
    };
    onSubmit(thread);
  };

  return (
    <div className="space-y-5 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb items={[
        { label: "Communications", href: "/school-admin/communications" },
        { label: "Course Forum", href: "#" },
        { label: "New Course Discussion" },
      ]} />
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Create Course Forum Discussion</h2>
        <p className="text-sm text-muted-foreground">Setup a restricted thread bound to a specific curriculum.</p>
      </div>
      
      <div className="space-y-6 bg-card border rounded-lg p-6 shadow-sm">
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Pick course *</Label>
          <Select onValueChange={setCourseId} value={courseId}>
            <SelectTrigger>
              <SelectValue placeholder="Select an assigned course" />
            </SelectTrigger>
            <SelectContent>
              {STUDENT_COURSES.map(course => (
                <SelectItem key={course.id} value={course.id}>{course.code} — {course.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold">Thread Title *</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Week 1 Group Discussion" />
        </div>
        
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Description *</Label>
          <ForumRichEditor content={description} onChange={setDescription} placeholder="Prompt students to discuss chapter 1 concepts..." />
        </div>

        <div className="border border-border rounded-lg bg-muted/10 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Forum is Gradable</Label>
              <p className="text-sm text-muted-foreground">Enable scoring and rubric evaluation.</p>
            </div>
            <Switch checked={isGradable} onCheckedChange={setIsGradable} />
          </div>

          {isGradable && (
            <div className="pt-2 animate-in slide-in-from-top-2">
              <Label className="text-sm font-semibold mb-2 block">Mark Obtainable</Label>
              <Input 
                type="number" 
                className="max-w-xs" 
                value={markObtainable}
                onChange={e => setMarkObtainable(Number(e.target.value))}
                min={0}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={onCancel}><ArrowLeft className="h-4 w-4 mr-1.5" /> Cancel</Button>
        <Button disabled={!title.trim() || !description.trim() || !courseId} onClick={handleCreate} className="gap-2">
          <Send className="h-4 w-4" /> Create Thread
        </Button>
      </div>
    </div>
  );
}

// ── Edit Thread Form ───────────────────────────────────────────────────────────
function EditThreadForm({ thread, onCancel, onSave }: { thread: AdminDiscussionThread; onCancel: () => void; onSave: (title: string, description: string) => void }) {
  const [title, setTitle] = useState(thread.title);
  const [description, setDescription] = useState(thread.description);

  return (
    <div className="space-y-5 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb items={[
        { label: "Communications", href: "/school-admin/communications" },
        { label: thread.forum_type === "general" ? "General Forum" : "Course Forum", href: "#" },
        { label: "Edit Discussion" },
      ]} />
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Edit Discussion</h2>
        <p className="text-sm text-muted-foreground">Make changes to your forum thread below.</p>
      </div>
      <div className="space-y-5 bg-card border rounded-lg p-6 shadow-sm">
        <div>
          <Label className="text-sm font-semibold block mb-2">Thread Title *</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <Label className="text-sm font-semibold block mb-2">Description *</Label>
          <ForumRichEditor content={description} onChange={setDescription} />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={onCancel}><X className="h-4 w-4 mr-1.5" /> Cancel</Button>
        <Button disabled={!title.trim() || !description.trim()} onClick={() => onSave(title, description)} className="gap-2">
          <CheckCircle className="h-4 w-4" /> Update Thread
        </Button>
      </div>
    </div>
  );
}

// ── Forum Thread List ──────────────────────────────────────────────────────────
function ForumList({
  threads,
  isGeneral,
  courseId,
  courseName,
  onBack,
}: {
  threads: AdminDiscussionThread[];
  isGeneral: boolean;
  courseId?: string;
  courseName?: string;
  onBack: () => void;
}) {
  const [allThreads, setAllThreads] = useState<AdminDiscussionThread[]>(threads);
  const [view, setView] = useState<"list" | "thread" | "create_general" | "create_course" | "edit">("list");
  const [activeThread, setActiveThread] = useState<AdminDiscussionThread | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const pinned = allThreads.filter(t => t.is_pinned);
  const regular = allThreads.filter(t => !t.is_pinned);
  const filtered = (arr: AdminDiscussionThread[]) =>
    arr.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDelete = () => {
    if (!activeThread) return;
    setAllThreads(prev => prev.filter(t => t.id !== activeThread.id));
    setView("list");
    setActiveThread(null);
  };

  const handleEditSave = (title: string, description: string) => {
    if (!activeThread) return;
    const updated = { ...activeThread, title, description };
    setAllThreads(prev => prev.map(t => t.id === activeThread.id ? updated : t));
    setActiveThread(updated);
    setView("thread");
    setView("thread");
  };

  if (view === "create_general") return <CreateGeneralThreadForm onCancel={() => setView("list")} onSubmit={t => { setAllThreads(prev => [t, ...prev]); setView("list"); }} />;
  if (view === "create_course") return <CreateCourseThreadForm onCancel={() => setView("list")} onSubmit={t => { setAllThreads(prev => [t, ...prev]); setView("list"); }} />;
  
  if (view === "edit" && activeThread) return <EditThreadForm thread={activeThread} onCancel={() => setView("thread")} onSave={handleEditSave} />;
  if (view === "thread" && activeThread) return (
    <ThreadDetailView
      thread={activeThread}
      onBack={() => setView("list")}
      isGeneral={isGeneral}
      onEdit={() => setView("edit")}
      onDelete={handleDelete}
    />
  );

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
      <Breadcrumb items={[
        { label: "Communications", href: "/school-admin/communications" },
        { label: isGeneral ? "General Forum" : (courseName ?? "Course Forum") },
      ]} />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" /> All Forums
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {isGeneral ? "General Forum" : courseName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isGeneral
              ? "Open global discussion for everyone on the platform."
              : `Course-specific discussion. You have administrative and moderation controls.`}
          </p>
        </div>
        <Button className="gap-2 shrink-0" onClick={() => setView(isGeneral ? "create_general" : "create_course")}>
          <Plus className="h-4 w-4" /> Create a new discussion
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search discussions by title or description..."
          className="pl-9 max-w-md"
        />
      </div>

      <Card className="border-border overflow-hidden shadow-sm">
        {pinned.length > 0 && (
          <div>
            <div className="px-5 py-2.5 bg-amber-50/60 dark:bg-amber-900/10 border-b border-amber-200/60 dark:border-amber-800/40">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5"><Pin className="h-3.5 w-3.5" />Pinned</p>
            </div>
            {filtered(pinned).map(t => (
              <ThreadRow key={t.id} thread={t} onClick={() => { setActiveThread(t); setView("thread"); }} />
            ))}
          </div>
        )}
        {filtered(regular).length > 0 ? (
          <div>
            {pinned.length > 0 && (
              <div className="px-5 py-2.5 bg-muted/30 border-b border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent Discussions</p>
              </div>
            )}
            {filtered(regular).map(t => (
              <ThreadRow key={t.id} thread={t} onClick={() => { setActiveThread(t); setView("thread"); }} />
            ))}
          </div>
        ) : filtered(pinned).length === 0 ? (
          <div className="py-16 text-center bg-muted/5">
            <MessageSquare className="h-8 w-8 opacity-20 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-medium">No discussions found in this forum.</p>
            <Button size="sm" className="mt-4 gap-2" onClick={() => setView(isGeneral ? "create_general" : "create_course")}>
              <Plus className="h-4 w-4" /> Start the first discussion
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

// ── Main Page: School Admin Portal ────────────────────────────────────────────
type PaneView = "landing" | "general" | { type: "course"; courseId: string };

export default function CommunicationsPage() {
  const [view, setView] = useState<PaneView>("landing");

  const generalThreads = DISCUSSION_THREADS.filter(t => t.forum_type === "general") as AdminDiscussionThread[];
  const courseIds = [...new Set(DISCUSSION_THREADS.filter(t => t.forum_type === "course").map(t => t.course_id!))];

  if (view === "general") {
    return (
      <ForumList
        threads={generalThreads}
        isGeneral={true}
        onBack={() => setView("landing")}
      />
    );
  }

  if (typeof view === "object" && view.type === "course") {
    const course = STUDENT_COURSES.find(c => c.id === view.courseId);
    const courseThreads = DISCUSSION_THREADS.filter(t => t.forum_type === "course" && t.course_id === view.courseId) as AdminDiscussionThread[];
    return (
      <ForumList
        threads={courseThreads}
        isGeneral={false}
        courseId={view.courseId}
        courseName={`${course?.code} — ${course?.name}`}
        onBack={() => setView("landing")}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb items={[{ label: "Dashboard", href: "/school-admin" }, { label: "Communications" }]} />

      <div>
        <h1 className="text-2xl font-bold text-foreground">Communications Forum</h1>
        <p className="text-sm text-muted-foreground mt-1">Oversee school-wide dialogues, moderate course discussion forums, and track student participation.</p>
      </div>

      {/* Stats row */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-6 mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center justify-center p-6 bg-muted/20">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <img src="https://img.icons8.com/scribby/96/comments.png" alt="Total Threads" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Threads</p>
              <p className="text-3xl font-extrabold text-foreground leading-none">{DISCUSSION_THREADS.length}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center sm:border-l border-border px-4 py-4 sm:py-0 border-t sm:border-t-0">
            <img src="https://img.icons8.com/scribby/96/clock.png" alt="Unread Threads" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Unread Threads</p>
              <p className="text-3xl font-extrabold text-primary leading-none">{DISCUSSION_THREADS.filter(t => t.has_unread).length}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center sm:border-l border-border px-4 border-t sm:border-t-0 pt-4 sm:pt-0">
            <img src="https://img.icons8.com/scribby/96/book.png" alt="Active Courses" className="h-12 w-12" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Active Course Forums</p>
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 leading-none">{courseIds.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-border bg-gradient-to-b from-background to-muted/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <img src="https://img.icons8.com/color/96/commercial.png" alt="General" className="h-7 w-7 filter drop-shadow-sm" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">General Forum</h2>
                <p className="text-sm text-muted-foreground font-medium">Public Announcements & Dialogues</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Global communication hub where school administrators, instructors, and learners post school-wide announcements, resolve general QA, and collaborate openly.
            </p>
          </div>
          <div className="flex-1 divide-y divide-border bg-background">
            {generalThreads.slice(0, 3).map(t => (
              <div key={t.id} className="px-6 py-4 flex items-center gap-3 hover:bg-muted/10 transition-colors">
                {t.has_unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                {t.is_pinned && <Pin className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                {!t.has_unread && !t.is_pinned && <MessageCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                <p className="text-sm text-foreground line-clamp-1 flex-1 font-medium">{t.title}</p>
                <span className="text-xs text-muted-foreground shrink-0 bg-muted px-2 py-1 rounded-md">{t.replies_count} replies</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border flex gap-2 bg-muted/5">
            <Button className="flex-1 gap-2" onClick={() => setView("general")}>
              <ChevronRight className="h-4 w-4" /> Enter General Forum
            </Button>
          </div>
        </Card>

        <Card className="border-border overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-border bg-gradient-to-b from-background to-muted/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
                <img src="https://img.icons8.com/color/96/books.png" alt="Course" className="h-7 w-7 filter drop-shadow-sm" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Course Forums</h2>
                <p className="text-sm text-muted-foreground font-medium">Verified Curriculums & Moderation</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Course-specific sub-forums. As a school administrator, you have full moderation privileges here to guide study topics, launch official threads, and oversee progress.
            </p>
          </div>
          <div className="flex-1 divide-y divide-border bg-background">
            {courseIds.map(courseId => {
              const course = STUDENT_COURSES.find(c => c.id === courseId);
              const threads = DISCUSSION_THREADS.filter(t => t.course_id === courseId && t.forum_type === "course");
              const unread = threads.filter(t => t.has_unread).length;
              return (
                <button
                  key={courseId}
                  onClick={() => setView({ type: "course", courseId })}
                  className="w-full text-left px-6 py-4 flex items-center gap-3 hover:bg-muted/10 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{course?.code}</span>
                      {unread > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white">{unread} new</span>}
                    </div>
                    <p className="text-sm font-medium text-foreground mt-1 line-clamp-1 group-hover:text-primary transition-colors">{course?.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{threads.length} discussion{threads.length !== 1 ? "s" : ""}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
