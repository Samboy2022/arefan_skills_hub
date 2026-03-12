"use client";

import { PageHeader } from "@/components/tenant/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TimetablePage() {
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "01:00", "02:00", "03:00"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div>
      <PageHeader
        title="Class Timetable"
        description="Manage class schedules and periods"
        action={{
          label: "Edit Timetable",
          onClick: () => {
            // TODO: Implement timetable editor
          },
        }}
      />

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left font-semibold">Time</th>
                {days.map((day) => (
                  <th key={day} className="p-3 text-center font-semibold">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-medium text-muted-foreground">{time}</td>
                  {days.map((day) => (
                    <td
                      key={`${day}-${time}`}
                      className="p-3 text-center bg-muted/30 border rounded"
                    >
                      <div className="text-sm font-medium">Subject</div>
                      <div className="text-xs text-muted-foreground">Teacher</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
