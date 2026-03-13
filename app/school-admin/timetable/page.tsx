"use client";

import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TimetablePage() {
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "01:00", "02:00", "03:00"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Timetable"
        description="Manage class schedules and periods"
        titleAction={
          <Button onClick={() => {}}>
            <Plus className="mr-2 h-4 w-4" />
            Edit Timetable
          </Button>
        }
      />

      <Card className="p-0 overflow-hidden hover:shadow-md transition-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-secondary-foreground text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4 font-semibold w-24">Time</th>
                {days.map((day) => (
                  <th key={day} className="px-6 py-4 text-center font-semibold">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {timeSlots.map((time) => (
                <tr key={time} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground border-r border-border bg-secondary/20">{time}</td>
                  {days.map((day) => (
                    <td
                      key={`${day}-${time}`}
                      className="px-6 py-4 text-center border-r last:border-r-0 border-border"
                    >
                      <div className="flex flex-col items-center justify-center p-2 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border border-primary/10">
                        <div className="font-medium text-foreground">Subject</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Teacher</div>
                      </div>
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
