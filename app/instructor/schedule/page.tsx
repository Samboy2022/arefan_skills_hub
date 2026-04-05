import { Plus, Calendar, MapPin, Clock, Video } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { MOCK_SCHEDULE_EVENTS } from "@/lib/instructor-mock-data";

export default function SchedulePage() {
  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      lecture: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
      exam: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
      deadline: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
      "office-hours": "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
      meeting: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    };
    return colors[type] || colors["lecture"];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return MOCK_SCHEDULE_EVENTS.filter((event) => new Date(event.startTime) >= today);
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="space-y-4">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Schedule & Calendar" }
        ]} 
      />
      <div className="pt-2">
        <PageHeader
          title="Schedule & Calendar"
          description="Manage your teaching schedule and important dates"
        >
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </PageHeader>
      </div>

      {/* Calendar View */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Calendar */}
        <div className="lg:col-span-1 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">February 2024</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 29 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center rounded text-sm font-medium cursor-pointer transition-colors ${
                    i + 1 === 22 ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Event List */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-semibold text-foreground">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getEventTypeColor(event.type)} mb-2`}>
                        {event.type.replace("-", " ").toUpperCase()}
                      </span>
                      <h4 className="font-semibold text-foreground mt-2">{event.title}</h4>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(new Date(event.startTime))}</span>
                      <span>•</span>
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(new Date(event.startTime))}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.meetingLink && (
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        <a href={event.meetingLink} className="text-blue-600 dark:text-blue-400 hover:underline">
                          Join Meeting
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 dark:text-red-400">
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">No upcoming events</div>
            )}
          </div>
        </div>
      </div>

      {/* All Events Timeline */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-lg text-foreground mb-6">All Events</h3>
        <div className="space-y-4">
          {MOCK_SCHEDULE_EVENTS.map((event, idx) => (
            <div key={event.id} className="flex gap-4 pb-4 border-b border-border last:border-b-0">
              <div className="flex flex-col items-center gap-2">
                <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                  <Calendar className="h-4 w-4" />
                </div>
                {idx < MOCK_SCHEDULE_EVENTS.length - 1 && <div className="w-0.5 h-8 bg-border" />}
              </div>
              <div className="flex-1 pt-1">
                <p className="font-medium text-foreground">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(new Date(event.startTime))} at {formatTime(new Date(event.startTime))}
                </p>
                {event.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
