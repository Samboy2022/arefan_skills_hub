"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Calendar, MoreHorizontal, Eye, Edit, Trash2, Send } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MOCK_ANNOUNCEMENTS } from "@/lib/instructor-mock-data";
import { toast } from "sonner"; // Using standard toast or window.alert fallback

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const publishedAnnouncements = announcements.filter((a) => a.publishedAt);
  const draftAnnouncements = announcements.filter((a) => !a.publishedAt && !a.scheduled);
  const scheduledAnnouncements = announcements.filter((a) => a.scheduled);

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const confirmDelete = () => {
    if (deleteId) {
      setAnnouncements(prev => prev.filter(a => a.id !== deleteId));
      setDeleteId(null);
      // Fallback alert if toast acts up, normally sonner works
      try { toast.success("Announcement successfully deleted."); } catch(e) { /* silent */ }
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Announcements" }
        ]} 
      />
      <div className="pt-2">
        <PageHeader
          title="Announcements"
          description="Create and manage course announcements"
          action={
            <Button className="gap-2" asChild>
              <Link href="/instructor/announcements/create">
                  <Plus className="h-4 w-4" />
                  Add New
              </Link>
            </Button>
          }
        />
      </div>

      {/* Announcement Sections */}
      <div className="space-y-8">
        {/* Published Announcements */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Published ({publishedAnnouncements.length})</h3>
          {publishedAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {publishedAnnouncements.map((announcement) => (
                <div key={announcement.id} className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center justify-center shrink-0">
                        <img src="https://img.icons8.com/color/96/commercial.png" alt="Published" className="h-7 w-7 filter drop-shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link href={`/instructor/announcements/${announcement.id}/view`} className="hover:underline">
                            <h4 className="font-semibold text-lg text-foreground leading-tight">{announcement.title}</h4>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            Published on {formatDate(announcement.publishedAt)}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 shrink-0">
                          Published
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{announcement.content}</p>

                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t">
                    <Button variant="outline" size="sm" className="gap-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-blue-200" asChild>
                        <Link href={`/instructor/announcements/${announcement.id}/view`}>
                            <Eye className="h-4 w-4" /> View Post
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                        <Link href={`/instructor/announcements/${announcement.id}/edit`}>
                            <Edit className="h-4 w-4" /> Edit
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 gap-2" onClick={() => setDeleteId(announcement.id)}>
                        <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-dashed border-border bg-muted/10">
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
                <div key={announcement.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
                        <img src="https://img.icons8.com/color/96/calendar--v1.png" alt="Scheduled" className="h-7 w-7 filter drop-shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link href={`/instructor/announcements/${announcement.id}/view`} className="hover:underline">
                            <h4 className="font-semibold text-lg text-foreground leading-tight">{announcement.title}</h4>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Scheduled for {formatDate(announcement.createdAt)}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 shrink-0">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{announcement.content}</p>

                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t">
                    <Button variant="outline" size="sm" className="gap-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-blue-200" asChild>
                        <Link href={`/instructor/announcements/${announcement.id}/view`}>
                            <Eye className="h-4 w-4" /> View Post
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <Link href={`/instructor/announcements/${announcement.id}/edit`}>
                        <Edit className="h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 gap-2" onClick={() => setDeleteId(announcement.id)}>
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-dashed border-border bg-muted/10">
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
                <div key={announcement.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                        <img src="https://img.icons8.com/color/96/edit-property.png" alt="Draft" className="h-7 w-7 filter drop-shadow-sm ml-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link href={`/instructor/announcements/${announcement.id}/view`} className="hover:underline">
                            <h4 className="font-semibold text-lg text-foreground leading-tight">{announcement.title}</h4>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">Last updated {formatDate(announcement.updatedAt)}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400 shrink-0">
                          Draft
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{announcement.content}</p>

                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t">
                    <Button size="sm" className="gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 uppercase font-semibold">
                      <Send className="h-4 w-4" /> Publish Now
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-blue-200" asChild>
                        <Link href={`/instructor/announcements/${announcement.id}/view`}>
                            <Eye className="h-4 w-4" /> View Post
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <Link href={`/instructor/announcements/${announcement.id}/edit`}>
                        <Edit className="h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 gap-2" onClick={() => setDeleteId(announcement.id)}>
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-dashed border-border bg-muted/10">
              <p className="text-muted-foreground">No draft announcements</p>
            </div>
          )}
        </div>
      </div>

      {/* Global Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Yes, Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
