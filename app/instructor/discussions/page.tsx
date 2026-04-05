import { MessageSquare, Pin, Search, Reply, Heart } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { MOCK_DISCUSSIONS } from "@/lib/instructor-mock-data";

export default function DiscussionsPage() {
  return (
    <div className="space-y-4">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Discussions" }
        ]} 
      />
      <div className="pt-2">
        <PageHeader
          title="Discussions"
          description="Monitor and participate in course discussions and Q&A"
        >
          <Button>Create Discussion</Button>
        </PageHeader>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search discussions..."
          className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-full"
        />
      </div>

      {/* Discussion Threads */}
      <div className="space-y-4">
        {MOCK_DISCUSSIONS.map((thread) => (
          <div key={thread.id} className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {thread.isPinned && (
                    <span className="text-xs bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 px-2 py-1 rounded-full flex items-center gap-1">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{thread.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Posted by {thread.authorName}</p>
              </div>
              {!thread.isPinned && (
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Pin className="h-4 w-4" />
                </Button>
              )}
            </div>

            <p className="text-sm text-foreground mb-4 line-clamp-3">{thread.content}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {thread.replies.length} replies
              </span>
              <span className="flex items-center gap-1">
                👁️ {thread.views} views
              </span>
            </div>

            {/* Replies Preview */}
            {thread.replies.length > 0 && (
              <div className="space-y-3 mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Recent Replies</p>
                {thread.replies.slice(0, 2).map((reply) => (
                  <div key={reply.id} className="bg-muted/50 rounded p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-medium text-sm text-foreground">{reply.authorName}</p>
                      <button className="text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span className="text-xs">{reply.likes}</span>
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{reply.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {reply.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Button className="w-full gap-2">
              <Reply className="h-4 w-4" />
              View & Reply
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
