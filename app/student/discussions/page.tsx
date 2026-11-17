"use client";

import { useState } from "react";
import {
  MessageSquare, Plus, ChevronRight, Pin, Eye, MessageCircle,
  ArrowLeft, Send, ThumbsUp, Pencil, Trash2, X, CheckCircle,
  Users, Globe, BookOpen, Search, Reply, AlertTriangle, Bell
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
import { detailWrapClass, emptyBodyClass, emptyStateClass, emptyTitleClass, formErrorClass, formLabelClass, listCardClass, pageStackClass, statGridClass, tabButtonClass, tabCountClass, tabRowClass } from "@/lib/student-ui";
import { StudentKPICard } from "@/components/student/kpi-card";
import { PageHeader } from "@/components/student/page-header";
import { StudentTip } from "@/components/student/tip";
import { FormSection } from "@/components/student/form-section";

// ── Helpers ────────────────────────────────────────────────────────────────────
const CURRENT_USER_ID = "student_current";
const CURRENT_USER_NAME = "John Doe";
const CURRENT_USER_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=John";

const formatDate = (d: string) => {
  try { return format(new Date(d), "MMM dd, yyyy 'at' h:mm a"); } catch { return d; }
};

// ── Thread Row ─────────────────────────────────────────────────────────────────
function ThreadRow({ thread, onClick }: { thread: DiscussionThread; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors border-b border-border last:border-b-0"
    >
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={thread.author_avatar} alt="" />
        <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
          {thread.author.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {thread.is_pinned && <Pin className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
          {thread.has_unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
          <p className={cn("text-sm font-semibold line-clamp-1", thread.has_unread ? "text-foreground" : "text-foreground/80")}>
            {thread.title}
          </p>
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
  thread: DiscussionThread;
  onBack: () => void;
  isGeneral: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const [comments, setComments] = useState<DiscussionComment[]>(thread.comments ?? []);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = thread.author_id === CURRENT_USER_ID;

  const handleComment = () => {
    if (!commentText.trim()) return;
    const newComment: DiscussionComment = {
      id: `c${Date.now()}`,
      thread_id: thread.id,
      author: CURRENT_USER_NAME,
      author_avatar: CURRENT_USER_AVATAR,
      content: commentText,
      created_at: new Date().toISOString(),
      likes: 0,
      replies: [],
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
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Discussions", href: "#" },
        { label: isGeneral ? "General Forum" : "Course Forum", href: "#" },
        { label: thread.title },
      ]} />

      {/* Back + owner actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        {isOwner && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/10">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1">Delete this thread?</p>
            <p className="text-xs text-muted-foreground mb-3">This action cannot be undone. All comments and replies will be permanently removed.</p>
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={onDelete}>Yes, Delete</Button>
              <Button size="sm" variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Original Post */}
      <Card className="gap-0 py-0 rounded-2xl border-border shadow-none">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={thread.author_avatar} alt="" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">{thread.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-sm text-foreground">{thread.author}</span>
                {isOwner && <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">You</span>}
                <span className="text-xs text-muted-foreground">{formatDate(thread.created_at)}</span>
                {thread.is_pinned && <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 uppercase"><Pin className="h-3 w-3"/>Pinned</span>}
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

      {/* Comments */}
      {comments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{comments.length} Comment{comments.length !== 1 ? "s" : ""}</h3>
          {comments.map(comment => (
            <Card key={comment.id} className="gap-0 py-0 rounded-2xl border-border shadow-none">
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={comment.author_avatar} alt="" />
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">{comment.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{comment.author}</span>
                      {comment.is_instructor && (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Instructor</span>
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
                        aria-pressed={likedComments.has(comment.id)}
                        aria-label={likedComments.has(comment.id) ? "Unlike comment" : "Like comment"}
                        className={cn("flex items-center gap-1.5 px-2 py-1 -ml-2 text-xs font-medium transition-colors hover:bg-muted", likedComments.has(comment.id) ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                      >
                        <ThumbsUp className={cn("h-3.5 w-3.5", likedComments.has(comment.id) && "fill-current")} />
                        {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
                      </button>
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-expanded={replyingTo === comment.id}
                      >
                        <Reply className="h-3.5 w-3.5" /> Reply
                      </button>
                    </div>

                    {/* Nested Replies */}
                    {comment.replies.length > 0 && (
                      <div className="mt-4 space-y-3 pl-4 border-l-2 border-border">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarImage src={reply.author_avatar} alt="" />
                              <AvatarFallback className="text-[10px] font-bold bg-muted">{reply.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-semibold text-foreground">{reply.author}</span>
                                <span className="text-[11px] text-muted-foreground">{formatDate(reply.created_at)}</span>
                              </div>
                              <p className="text-xs text-foreground leading-relaxed">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Box */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 pl-4 border-l-2 border-primary/30 space-y-2">
                        <Textarea
                          value={replyTexts[comment.id] ?? ""}
                          onChange={e => setReplyTexts(prev => ({ ...prev, [comment.id]: e.target.value }))}
                          placeholder={`Reply to ${comment.author}...`}
                          className="min-h-[80px] text-sm resize-none rounded-2xl px-4 py-3 bg-card"
                          aria-label={`Reply to ${comment.author}`}
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>Cancel</Button>
                          <Button size="sm" className="gap-1.5 px-4" disabled={!(replyTexts[comment.id] ?? "").trim()} onClick={() => handleReply(comment.id)}>
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

      {/* Comment box */}
      <FormSection icon={MessageSquare} title="Leave a comment" hint="Reply with a clear point so classmates can follow the thread.">
        <label htmlFor="new-comment" className={formLabelClass}>Your comment</label>
        <Textarea
          id="new-comment"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder="Type your comment here..."
          className="mt-1.5 min-h-[100px] resize-none bg-card px-4 py-3 text-sm"
        />
        <div className="mt-4 flex justify-end">
          <Button disabled={!commentText.trim()} onClick={handleComment} className="gap-2 px-5">
            <Send className="h-4 w-4" /> Comment
          </Button>
        </div>
      </FormSection>
    </div>
  );
}

// ── Create Thread Form ─────────────────────────────────────────────────────────
function CreateThreadForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (t: DiscussionThread) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!title.trim() || !description.trim()) return;
    const thread: DiscussionThread = {
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
    <div className={detailWrapClass}>
      <Breadcrumb items={[
        { label: "Discussions", href: "/student/discussions" },
        { label: "General Forum" },
        { label: "New Discussion" },
      ]} />
      <ThreadFormCard
        heading="Create a New Discussion"
        subheading="Start a thread visible to all students on the platform."
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        onCancel={onCancel}
        cancelIcon={<ArrowLeft className="h-4 w-4" />}
        submitLabel="Create Discussion"
        submitIcon={<Send className="h-4 w-4" />}
        onSubmit={handleCreate}
      />
    </div>
  );
}

// ── Shared thread form card (create + edit) ───────────────────────────────────
const TITLE_MAX = 120;
const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

function ThreadFormCard({
  heading, subheading, title, setTitle, description, setDescription,
  onCancel, cancelIcon, submitLabel, submitIcon, onSubmit,
}: {
  heading: string; subheading: string;
  title: string; setTitle: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  onCancel: () => void; cancelIcon: React.ReactNode;
  submitLabel: string; submitIcon: React.ReactNode; onSubmit: () => void;
}) {
  const [touched, setTouched] = useState({ title: false, description: false });
  const titleError = !title.trim() ? "Please enter a title." : title.length > TITLE_MAX ? `Keep the title under ${TITLE_MAX} characters.` : "";
  const descriptionError = !stripHtml(description) ? "Please describe your topic." : "";
  const showTitleError = touched.title && !!titleError;
  const showDescriptionError = touched.description && !!descriptionError;

  const handleSubmit = () => {
    setTouched({ title: true, description: true });
    if (titleError || descriptionError) return;
    onSubmit();
  };

  return (
    <div className="space-y-5">
      <PageHeader title={heading} description={subheading} />
      <StudentTip>
        Use a specific title so classmates can find this later. Keep the first sentence of the description as the main question.
      </StudentTip>
      <FormSection icon={MessageSquare} title="Thread details" hint="A clear title and a short description are required.">
        <div className="space-y-5">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="thread-title" className={formLabelClass}>
                Thread title <span className="text-red-500">*</span>
              </label>
              <span className={cn("text-xs tabular-nums", title.length > TITLE_MAX ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
                {title.length}/{TITLE_MAX}
              </span>
            </div>
            <Input
              id="thread-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, title: true }))}
              placeholder="Enter a clear, descriptive title..."
              aria-invalid={showTitleError || undefined}
              aria-describedby={showTitleError ? "thread-title-error" : undefined}
              className="h-10 bg-background px-3"
            />
            {showTitleError && <p id="thread-title-error" className={cn("mt-1.5", formErrorClass)}>{titleError}</p>}
          </div>
          <div>
            <label className={cn(formLabelClass, "mb-1.5 block")}>
              Description <span className="text-red-500">*</span>
            </label>
            <div
              onBlur={() => setTouched(t => ({ ...t, description: true }))}
              className={cn("rounded-2xl", showDescriptionError && "ring-2 ring-red-500/30 [&>*]:border-red-400")}
            >
              <ForumRichEditor content={description} onChange={setDescription} placeholder="Describe your topic, question, or idea in detail..." />
            </div>
            {showDescriptionError && <p className={cn("mt-1.5", formErrorClass)}>{descriptionError}</p>}
          </div>
        </div>
      </FormSection>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" className="gap-1.5" onClick={onCancel}>{cancelIcon} Cancel</Button>
        <Button onClick={handleSubmit} className="gap-2 px-6">
          {submitIcon} {submitLabel}
        </Button>
      </div>
    </div>
  );
}

// ── Edit Thread Form ───────────────────────────────────────────────────────────
function EditThreadForm({ thread, onCancel, onSave }: { thread: DiscussionThread; onCancel: () => void; onSave: (title: string, description: string) => void }) {
  const [title, setTitle] = useState(thread.title);
  const [description, setDescription] = useState(thread.description);

  return (
    <div className={detailWrapClass}>
      <Breadcrumb items={[
        { label: "Discussions", href: "/student/discussions" },
        { label: "General Forum" },
        { label: "Edit Discussion" },
      ]} />
      <ThreadFormCard
        heading="Edit Discussion"
        subheading="Make changes to your thread below."
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        onCancel={onCancel}
        cancelIcon={<X className="h-4 w-4" />}
        submitLabel="Save Changes"
        submitIcon={<CheckCircle className="h-4 w-4" />}
        onSubmit={() => onSave(title, description)}
      />
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
  initialView,
}: {
  threads: DiscussionThread[];
  isGeneral: boolean;
  courseId?: string;
  courseName?: string;
  onBack: () => void;
  initialView?: "list" | "create";
}) {
  const [allThreads, setAllThreads] = useState<DiscussionThread[]>(threads);
  const [view, setView] = useState<"list" | "thread" | "create" | "edit">(initialView ?? "list");
  const [activeThread, setActiveThread] = useState<DiscussionThread | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [threadFilter, setThreadFilter] = useState<"all" | "pinned" | "unread">("all");

  const matchesSearch = (t: DiscussionThread) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
  const visibleThreads = allThreads.filter((t) => {
    if (!matchesSearch(t)) return false;
    if (threadFilter === "pinned") return t.is_pinned;
    if (threadFilter === "unread") return t.has_unread;
    return true;
  });
  const pinned = visibleThreads.filter(t => t.is_pinned);
  const regular = visibleThreads.filter(t => !t.is_pinned);
  const threadCounts = {
    all: allThreads.filter(matchesSearch).length,
    pinned: allThreads.filter(t => t.is_pinned && matchesSearch(t)).length,
    unread: allThreads.filter(t => t.has_unread && matchesSearch(t)).length,
  };

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
  };

  if (view === "create") return <CreateThreadForm onCancel={() => setView("list")} onSubmit={t => { setAllThreads(prev => [t, ...prev]); setView("list"); }} />;
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
    <div className="space-y-5">
      <Breadcrumb items={[
        { label: "Discussions", href: "/student/discussions" },
        { label: isGeneral ? "General Forum" : (courseName ?? "Course Forum") },
      ]} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="outline" size="sm" className="mb-2 gap-1.5" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" /> All Forums
            </Button>
          </div>
          <h1 className="text-xl font-bold text-foreground">
            {isGeneral ? "General Forum" : courseName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isGeneral
              ? "Open discussion for everyone on the platform"
              : `Course-specific discussion for enrolled students`}
          </p>
        </div>
        {isGeneral && (
          <Button className="shrink-0 gap-2 px-5" onClick={() => setView("create")}>
            <Plus className="h-4 w-4" /> New Discussion
          </Button>
        )}
      </div>

      <Card className={listCardClass}>
        <div className={tabRowClass}>
          {([
            { key: "all", label: "All" },
            { key: "pinned", label: "Pinned" },
            { key: "unread", label: "Unread" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setThreadFilter(tab.key)}
              className={tabButtonClass(threadFilter === tab.key)}
            >
              {tab.label}
              <span className={tabCountClass(threadFilter === tab.key)}>{threadCounts[tab.key]}</span>
            </button>
          ))}
        </div>
        <div className="relative border-b border-border px-4 py-3">
          <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search discussions..."
            aria-label="Search discussions"
            className="h-10 bg-background pl-10 pr-4"
          />
        </div>
        {pinned.length > 0 && threadFilter !== "unread" && (
          <div>
            <div className="px-5 py-2.5 bg-amber-50/60 dark:bg-amber-900/10 border-b border-amber-200/60 dark:border-amber-800/40">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5"><Pin className="h-3.5 w-3.5" />Pinned</p>
            </div>
            {pinned.map(t => (
              <ThreadRow key={t.id} thread={t} onClick={() => { setActiveThread(t); setView("thread"); }} />
            ))}
          </div>
        )}
        {regular.length > 0 ? (
          <div>
            {pinned.length > 0 && threadFilter === "all" && (
              <div className="px-5 py-2.5 bg-muted/20 border-b border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent Discussions</p>
              </div>
            )}
            {regular.map(t => (
              <ThreadRow key={t.id} thread={t} onClick={() => { setActiveThread(t); setView("thread"); }} />
            ))}
          </div>
        ) : pinned.length === 0 ? (
          <div className={emptyStateClass}>
            <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <h3 className={emptyTitleClass}>No discussions found</h3>
            <p className={emptyBodyClass}>Start a thread, or try a different search.</p>
            {isGeneral && <Button size="sm" className="mt-4 gap-2" onClick={() => setView("create")}><Plus className="h-4 w-4" /> Start one</Button>}
          </div>
        ) : null}
      </Card>
    </div>
  );
}

// ── Main Page: Landing ─────────────────────────────────────────────────────────
type PaneView = "landing" | "general" | "general-create" | { type: "course"; courseId: string };

export default function DiscussionsPage() {
  const [view, setView] = useState<PaneView>("landing");

  const generalThreads = DISCUSSION_THREADS.filter(t => t.forum_type === "general");
  const courseIds = [...new Set(DISCUSSION_THREADS.filter(t => t.forum_type === "course").map(t => t.course_id!))];

  // If inside a sub-view, render it
  if (view === "general" || view === "general-create") {
    return (
      <ForumList
        threads={generalThreads}
        isGeneral={true}
        onBack={() => setView("landing")}
        initialView={view === "general-create" ? "create" : "list"}
      />
    );
  }

  if (typeof view === "object" && view.type === "course") {
    const course = STUDENT_COURSES.find(c => c.id === view.courseId);
    const courseThreads = DISCUSSION_THREADS.filter(t => t.forum_type === "course" && t.course_id === view.courseId);
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

  // ── Landing page ─────────────────────────────────────────────────────────────
  const generalUnread = generalThreads.filter(t => t.has_unread).length;

  return (
    <div className={pageStackClass}>
      <Breadcrumb items={[{ label: "Discussions" }]} />

      <PageHeader
        title="Discussion Forums"
        description="Connect with classmates and participate in course discussions."
      />

      <StudentTip>
        Course forums are only for enrolled students. The general forum is open to everyone on the platform.
      </StudentTip>

      <div className={statGridClass}>
        <StudentKPICard title="Total Threads" value={DISCUSSION_THREADS.length} icon={MessageSquare} />
        <StudentKPICard title="Unread" value={DISCUSSION_THREADS.filter(t => t.has_unread).length} icon={Bell} variant="info" />
        <StudentKPICard title="General" value={generalThreads.length} icon={Globe} />
        <StudentKPICard title="Course Forums" value={courseIds.length} icon={BookOpen} />
      </div>

      {/* Forum Panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* General Forum Pane */}
        <Card className="gap-0 py-0 rounded-2xl border-border shadow-none overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <img src="https://img.icons8.com/color/96/commercial.png" alt="" aria-hidden="true" className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">General Forum</h2>
                <p className="text-xs text-muted-foreground">Open to everyone</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A public forum where all students can create, comment, and engage with discussions on any topic.
            </p>
          </div>
          {/* Recent threads preview */}
          <div className="flex-1 divide-y divide-border">
            {generalThreads.slice(0, 3).map(t => (
              <div key={t.id} className="px-5 py-3 flex items-center gap-3">
                {t.has_unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                {t.is_pinned && <Pin className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                {!t.has_unread && !t.is_pinned && <MessageCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                <p className="text-sm text-foreground line-clamp-1 flex-1">{t.title}</p>
                <span className="text-xs text-muted-foreground shrink-0">{t.replies_count} replies</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border flex gap-2">
            <Button className="flex-1 gap-2" onClick={() => setView("general")}>
              Enter Forum <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setView("general-create")}>
              <Plus className="h-4 w-4" /> New
            </Button>
          </div>
        </Card>

        {/* Course Forum Pane */}
        <Card className="gap-0 py-0 rounded-2xl border-border shadow-none overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <img src="https://img.icons8.com/color/96/books.png" alt="" aria-hidden="true" className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Course Forums</h2>
                <p className="text-xs text-muted-foreground">Enrolled courses only</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Course-specific forums for learners enrolled in a course. Only enrolled students can participate.
            </p>
          </div>
          {/* Course list */}
          <div className="flex-1 divide-y divide-border">
            {courseIds.map(courseId => {
              const course = STUDENT_COURSES.find(c => c.id === courseId);
              const threads = DISCUSSION_THREADS.filter(t => t.course_id === courseId && t.forum_type === "course");
              const unread = threads.filter(t => t.has_unread).length;
              return (
                <button
                  key={courseId}
                  onClick={() => setView({ type: "course", courseId })}
                  className="w-full text-left px-5 py-3.5 flex items-center gap-3 hover:bg-muted/30 transition-colors group focus-visible:outline-none focus-visible:bg-muted/40"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">{course?.code}</span>
                      {unread > 0 && <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400">{unread} new</span>}
                    </div>
                    <p className="text-sm font-medium text-foreground mt-0.5 line-clamp-1">{course?.name}</p>
                    <p className="text-xs text-muted-foreground">{threads.length === 1 ? "1 discussion" : `${threads.length} discussions`}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
