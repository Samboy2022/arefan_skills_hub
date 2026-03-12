import { Bell, Archive, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { COURSE_ANNOUNCEMENTS } from "@/lib/student-mock-data";

export default function AnnouncementsPage() {
  const unreadAnnouncements = COURSE_ANNOUNCEMENTS.filter(a => !a.is_read);
  const readAnnouncements = COURSE_ANNOUNCEMENTS.filter(a => a.is_read);

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Stay updated with course announcements"
      />

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Announcements</p>
          <p className="text-2xl font-bold">{COURSE_ANNOUNCEMENTS.length}</p>
        </Card>
        <Card className="p-4 text-center border-red-200 bg-red-50">
          <p className="text-sm text-red-700">Unread</p>
          <p className="text-2xl font-bold text-red-700">{unreadAnnouncements.length}</p>
        </Card>
        <Card className="p-4 text-center border-green-200 bg-green-50">
          <p className="text-sm text-green-700">Read</p>
          <p className="text-2xl font-bold text-green-700">{readAnnouncements.length}</p>
        </Card>
      </div>

      {/* Unread Announcements */}
      {unreadAnnouncements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Unread ({unreadAnnouncements.length})
          </h3>
          <div className="space-y-3">
            {unreadAnnouncements.map(announcement => (
              <Card
                key={announcement.id}
                className="p-4 border-2 border-blue-200 bg-blue-50 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-blue-900">{announcement.title}</h4>
                    <p className="text-sm text-blue-700 mt-2 line-clamp-2">{announcement.content}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-blue-600 font-semibold">{announcement.instructor}</span>
                      <span className="text-xs text-blue-600">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Read Announcements */}
      {readAnnouncements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Read ({readAnnouncements.length})
          </h3>
          <div className="space-y-3">
            {readAnnouncements.map(announcement => (
              <Card
                key={announcement.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{announcement.title}</h4>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{announcement.content}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">{announcement.instructor}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
