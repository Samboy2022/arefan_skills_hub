import { Plus, Calendar, MoreHorizontal, Eye, Edit, Trash2, Send } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_ANNOUNCEMENTS } from "@/lib/instructor-mock-data";

export default function AnnouncementsPage() {
  const publishedAnnouncements = MOCK_ANNOUNCEMENTS.filter((a) => a.publishedAt);
  const draftAnnouncements = MOCK_ANNOUNCEMENTS.filter((a) => !a.publishedAt && !a.scheduled);
  const scheduledAnnouncements = MOCK_ANNOUNCEMENTS.filter((a) => a.scheduled);

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Announcements"
        description="Create and manage course announcements"
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </PageHeader>

      {/* Announcement Sections */}
      <div className="space-y-8">
        {/* Published Announcements */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Published ({publishedAnnouncements.length})</h3>
          {publishedAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {publishedAnnouncements.map((announcement) => (
                <div key={announcement.id} className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-foreground">{announcement.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Published on {formatDate(announcement.publishedAt)}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                      Published
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{announcement.content}</p>

                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <MoreHorizontal className="h-4 w-4" />
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-red-600 dark:text-red-400">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-dashed border-border">
              <p className="text-muted-foreground">No published announcements</p>
            </div>
          )}
        </div>

        {/* Scheduled Announcements */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Scheduled ({scheduledAnnouncements.length})</h3>
          {scheduledAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {scheduledAnnouncements.map((announcement) => (
                <div key={announcement.id} className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-foreground">{announcement.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Scheduled for {formatDate(announcement.createdAt)}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                      Scheduled
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{announcement.content}</p>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 dark:text-red-400 gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-dashed border-border">
              <p className="text-muted-foreground">No scheduled announcements</p>
            </div>
          )}
        </div>

        {/* Draft Announcements */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Drafts ({draftAnnouncements.length})</h3>
          {draftAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {draftAnnouncements.map((announcement) => (
                <div key={announcement.id} className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-foreground">{announcement.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Last updated {formatDate(announcement.updatedAt)}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                      Draft
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{announcement.content}</p>

                  <div className="flex gap-2">
                    <Button size="sm" className="gap-2">
                      <Send className="h-4 w-4" />
                      Publish
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 dark:text-red-400 gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-dashed border-border">
              <p className="text-muted-foreground">No draft announcements</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
