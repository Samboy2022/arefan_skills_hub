import { MessageSquare, Eye, Reply, Pin, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { DISCUSSION_THREADS } from "@/lib/student-mock-data";

export default function DiscussionsPage() {
  const unreadThreads = DISCUSSION_THREADS.filter(t => t.has_unread).length;
  const pinnedThreads = DISCUSSION_THREADS.filter(t => t.is_pinned);
  const regularThreads = DISCUSSION_THREADS.filter(t => !t.is_pinned);

  return (
    <div>
      <PageHeader
        title="Discussion Forums"
        description="Engage with classmates and ask questions"
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Threads</p>
          <p className="text-2xl font-bold">{DISCUSSION_THREADS.length}</p>
        </Card>
        <Card className="p-4 text-center border-blue-200 bg-blue-50">
          <p className="text-sm text-blue-700">Unread</p>
          <p className="text-2xl font-bold text-blue-700">{unreadThreads}</p>
        </Card>
        <Card className="p-4 text-center border-purple-200 bg-purple-50">
          <p className="text-sm text-purple-700">My Replies</p>
          <p className="text-2xl font-bold text-purple-700">12</p>
        </Card>
      </div>

      {/* Pinned Threads */}
      {pinnedThreads.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Pin className="h-5 w-5 text-yellow-600" />
            Pinned Discussions ({pinnedThreads.length})
          </h3>
          <div className="space-y-3">
            {pinnedThreads.map(thread => (
              <Card
                key={thread.id}
                className="p-4 border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg line-clamp-2">{thread.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Started by {thread.author}
                    </p>
                  </div>
                  {thread.has_unread && (
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-600 ml-2 mt-1"></div>
                  )}
                </div>

                <div className="flex gap-4 text-sm text-muted-foreground mt-3 pt-3 border-t">
                  <span className="flex items-center gap-1">
                    <Reply className="h-4 w-4" />
                    {thread.replies_count} replies
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {thread.views} views
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Threads */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          All Discussions ({regularThreads.length})
        </h3>
        <div className="space-y-3">
          {regularThreads.map(thread => (
            <Card
              key={thread.id}
              className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${
                thread.has_unread ? "border-2 border-blue-200 bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className={`text-lg line-clamp-2 ${thread.has_unread ? "font-bold" : "font-semibold"}`}>
                    {thread.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Started by {thread.author}
                  </p>
                </div>
                {thread.has_unread && (
                  <div className="flex-shrink-0 h-3 w-3 rounded-full bg-blue-600 ml-2 mt-1"></div>
                )}
              </div>

              <div className="flex gap-4 text-sm text-muted-foreground mt-3 pt-3 border-t">
                <span className="flex items-center gap-1">
                  <Reply className="h-4 w-4" />
                  {thread.replies_count} replies
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {thread.views} views
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
