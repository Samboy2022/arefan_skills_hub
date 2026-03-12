import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { SCHEDULE_EVENTS } from "@/lib/student-mock-data";

const getEventTypeColor = (type: string) => {
  switch (type) {
    case "class":
      return "bg-blue-50 border-blue-200 text-blue-700";
    case "assignment_due":
      return "bg-yellow-50 border-yellow-200 text-yellow-700";
    case "quiz":
      return "bg-purple-50 border-purple-200 text-purple-700";
    case "exam":
      return "bg-red-50 border-red-200 text-red-700";
    case "office_hours":
      return "bg-green-50 border-green-200 text-green-700";
    default:
      return "bg-gray-50 border-gray-200 text-gray-700";
  }
};

const getEventTypeLabel = (type: string) => {
  const labels = {
    class: "Class",
    assignment_due: "Assignment Due",
    quiz: "Quiz",
    exam: "Exam",
    office_hours: "Office Hours",
  };
  return labels[type as keyof typeof labels] || type;
};

export default function SchedulePage() {
  const today = new Date();
  const upcomingEvents = SCHEDULE_EVENTS.filter(
    event => new Date(event.start_time) >= today
  ).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const todayEvents = upcomingEvents.filter(event => {
    const eventDate = new Date(event.start_time);
    return (
      eventDate.toDateString() === today.toDateString()
    );
  });

  const futureEvents = upcomingEvents.filter(event => {
    const eventDate = new Date(event.start_time);
    return eventDate.toDateString() !== today.toDateString();
  });

  return (
    <div>
      <PageHeader
        title="Schedule & Calendar"
        description="View all your upcoming class sessions and events"
      />

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Today's Events ({todayEvents.length})
          </h3>
          <div className="space-y-3">
            {todayEvents.map(event => (
              <Card
                key={event.id}
                className={`p-4 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-lg">{event.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{event.course_name}</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded border ${getEventTypeColor(event.type)}`}>
                    {getEventTypeLabel(event.type)}
                  </span>
                </div>

                <div className="space-y-2 mt-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(event.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(event.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  )}
                </div>

                {event.description && (
                  <p className="mt-3 text-sm text-muted-foreground">{event.description}</p>
                )}

                <div className="mt-4 pt-4 border-t">
                  <Button size="sm" className="w-full">
                    <Video className="h-4 w-4 mr-2" />
                    Join Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Future Events */}
      {futureEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events ({futureEvents.length})
          </h3>
          <div className="space-y-3">
            {futureEvents.map(event => (
              <Card
                key={event.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{event.course_name}</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded border ${getEventTypeColor(event.type)}`}>
                    {getEventTypeLabel(event.type)}
                  </span>
                </div>

                <div className="space-y-2 mt-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.start_time).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(event.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(event.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {upcomingEvents.length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">No Upcoming Events</p>
          <p className="text-muted-foreground">All your upcoming events will appear here</p>
        </Card>
      )}
    </div>
  );
}
