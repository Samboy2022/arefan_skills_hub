"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/instructor/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/tenant/kpi-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Award, 
  TrendingUp, 
  Video, 
  Clock, 
  Users, 
  Calendar,
  Save,
  Filter,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import { MOCK_MEETINGS, MOCK_STUDENTS } from "@/lib/instructor-mock-data";
import { mockClasses } from "@/lib/tenant-mock-data";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function InstructorAttendancePage() {
  const [activeTab, setActiveTab] = useState<"live" | "manual">("live");

  // --- Live Class Attendance State ---
  const liveClasses = useMemo(() => {
    return [...MOCK_MEETINGS].sort((a, b) => {
      if (a.attendance_report && !b.attendance_report) return -1;
      if (!a.attendance_report && b.attendance_report) return 1;
      return 0;
    });
  }, []);

  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(
    liveClasses[0]?.id || ""
  );

  const selectedMeeting = useMemo(() => {
    return liveClasses.find((m) => m.id === selectedMeetingId);
  }, [liveClasses, selectedMeetingId]);

  const [attendeeStates, setAttendeeStates] = useState<Record<string, {
    student_id: string;
    student_name: string;
    avatar_url: string;
    joined_at: string;
    left_at: string;
    minutes_present: number;
    percentage: number;
    status: "present" | "partial" | "absent" | "did_not_join";
  }>>({});

  // Bulk Selection State for Live Tab
  const [selectedLiveIds, setSelectedLiveIds] = useState<Set<string>>(new Set());

  // Trigger when meeting changes
  useMemo(() => {
    if (!selectedMeeting) return;
    
    const recordsMap: Record<string, any> = {};
    if (selectedMeeting.attendance_report?.records) {
      selectedMeeting.attendance_report.records.forEach((rec) => {
        recordsMap[rec.student_id] = { ...rec };
      });
    } else {
      selectedMeeting.attendees.forEach((att) => {
        recordsMap[att.id] = {
          student_id: att.id,
          student_name: att.name,
          avatar_url: att.avatar_url,
          joined_at: "—",
          left_at: "—",
          minutes_present: 0,
          percentage: 0,
          status: "did_not_join",
        };
      });
    }
    setAttendeeStates(recordsMap);
    setSelectedLiveIds(new Set()); // Reset selections on meeting swap
  }, [selectedMeeting]);

  const liveAttendees = useMemo(() => {
    return Object.values(attendeeStates);
  }, [attendeeStates]);

  const liveStats = useMemo(() => {
    const total = liveAttendees.length;
    if (total === 0) return { present: 0, absent: 0, rate: 0 };
    const presentCount = liveAttendees.filter(
      (a) => a.status === "present" || a.status === "partial"
    ).length;
    const rate = Math.round((presentCount / total) * 100);
    return {
      present: presentCount,
      absent: total - presentCount,
      rate,
    };
  }, [liveAttendees]);

  // Bulk Selection Handlers (Live Classes)
  const handleSelectAllLive = (checked: boolean) => {
    if (checked) {
      setSelectedLiveIds(new Set(liveAttendees.map((a) => a.student_id)));
    } else {
      setSelectedLiveIds(new Set());
    }
  };

  const handleSelectRowLive = (studentId: string, checked: boolean) => {
    setSelectedLiveIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(studentId);
      } else {
        next.delete(studentId);
      }
      return next;
    });
  };

  // Bulk Action Dispatchers (Live Classes)
  const handleBulkLiveStatus = (status: "present" | "absent") => {
    if (selectedLiveIds.size === 0) return;

    setAttendeeStates((prev) => {
      const next = { ...prev };
      selectedLiveIds.forEach((id) => {
        if (next[id]) {
          next[id] = {
            ...next[id],
            status,
            minutes_present: status === "present" ? selectedMeeting?.duration || 60 : 0,
            percentage: status === "present" ? 100 : 0,
            joined_at: status === "present" ? selectedMeeting?.start_time || new Date().toISOString() : "—",
            left_at: status === "present" ? new Date().toISOString() : "—",
          };
        }
      });
      return next;
    });

    toast({
      title: "Bulk Action Applied",
      description: `Marked ${selectedLiveIds.size} student(s) as ${status.toUpperCase()} in class.`,
    });
    setSelectedLiveIds(new Set()); // Reset selections
  };

  const handleSaveLiveChanges = () => {
    toast({
      title: "Attendance Saved Successfully",
      description: `Live class log updated for "${selectedMeeting?.name}". Total: ${liveStats.present} present, ${liveStats.absent} absent.`,
    });
  };

  // --- Manual Class Attendance State ---
  const [selectedClassId, setSelectedClassId] = useState<string>(
    mockClasses[0]?.id || ""
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [manualStudentStates, setManualStudentStates] = useState<Record<string, {
    id: string;
    name: string;
    rollNumber: string;
    status: "Present" | "Absent" | "Late" | "Excused";
  }>>(() => {
    const initial: Record<string, any> = {};
    MOCK_STUDENTS.forEach((student, index) => {
      initial[student.id] = {
        id: student.id,
        name: student.name,
        rollNumber: student.studentId || `STU00${index + 1}`,
        status: index % 4 === 0 ? "Absent" : "Present",
      };
    });
    return initial;
  });

  // Bulk Selection State for Manual Tab
  const [selectedManualIds, setSelectedManualIds] = useState<Set<string>>(new Set());

  const manualStudents = useMemo(() => {
    return Object.values(manualStudentStates);
  }, [manualStudentStates]);

  // Bulk Selection Handlers (Manual Sheets)
  const handleSelectAllManual = (checked: boolean) => {
    if (checked) {
      setSelectedManualIds(new Set(manualStudents.map((s) => s.id)));
    } else {
      setSelectedManualIds(new Set());
    }
  };

  const handleSelectRowManual = (studentId: string, checked: boolean) => {
    setSelectedManualIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(studentId);
      } else {
        next.delete(studentId);
      }
      return next;
    });
  };

  // Bulk Action Dispatchers (Manual Sheets)
  const handleBulkManualStatus = (status: "Present" | "Absent" | "Late" | "Excused") => {
    if (selectedManualIds.size === 0) return;

    setManualStudentStates((prev) => {
      const next = { ...prev };
      selectedManualIds.forEach((id) => {
        if (next[id]) {
          next[id] = {
            ...next[id],
            status,
          };
        }
      });
      return next;
    });

    toast({
      title: "Bulk Action Applied",
      description: `Marked ${selectedManualIds.size} student(s) as ${status}.`,
    });
    setSelectedManualIds(new Set()); // Clear selections
  };

  const handleSaveManualAttendance = () => {
    const present = manualStudents.filter((s) => s.status === "Present" || s.status === "Late").length;
    const absent = manualStudents.length - present;
    toast({
      title: "Daily Attendance Sheet Saved",
      description: `Class attendance sheet saved for ${format(new Date(selectedDate), "PPP")}. ${present} Present, ${absent} Absent.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">Present</Badge>;
      case "partial":
      case "late":
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">Late / Partial</Badge>;
      case "absent":
        return <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-500/20">Absent</Badge>;
      case "did_not_join":
      case "did not join":
        return <Badge className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-slate-500/20">Did Not Join</Badge>;
      case "excused":
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">Excused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 relative pb-20">
      {/* Breadcrumb */}
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Attendance" }
        ]}
        className="mb-2"
      />

      {/* Page Title */}
      <PageHeader
        title="Attendance Management"
        description="Track student participation and oversee daily course rosters"
      />

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Daily Average Attendance"
          value="94.2%"
          hint="Across your assigned courses"
          icon={Award}
          trend={1.8}
          color="green"
        />
        <KPICard
          title="Students Present Today"
          value="182"
          hint="Across active rosters"
          icon={TrendingUp}
          trend={3}
          color="blue"
        />
        <KPICard
          title="Excused / Late"
          value="13"
          hint="Validation pending"
          icon={Clock}
          trend={-2}
          color="orange"
        />
        <KPICard
          title="Live Class Join Rate"
          value={`${liveStats.rate}%`}
          hint="Selected virtual class"
          icon={Video}
          trend={liveStats.rate > 80 ? 4.5 : -1.2}
          color="purple"
        />
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-border mb-4">
        <button
          onClick={() => setActiveTab("live")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === "live"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Video className="h-4 w-4" />
          Live Class Sessions
        </button>
        <button
          onClick={() => setActiveTab("manual")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === "manual"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          Manual Daily Sheets
        </button>
      </div>

      {/* --- Live Classes Tab --- */}
      {activeTab === "live" && (
        <div className="space-y-6">
          <Card className="p-6 border border-border shadow-sm">
            <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" /> Filter Session & Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Select Live Class</label>
                <Select onValueChange={setSelectedMeetingId} value={selectedMeetingId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pick a session" />
                  </SelectTrigger>
                  <SelectContent>
                    {liveClasses.map((meeting) => (
                      <SelectItem key={meeting.id} value={meeting.id}>
                        {meeting.name} ({meeting.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedMeeting && (
                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border border-border text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Duration</span>
                    <span className="font-semibold text-foreground">{selectedMeeting.duration} mins</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Password</span>
                    <span className="font-semibold text-foreground">{selectedMeeting.password || "None"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Status</span>
                    <Badge variant={selectedMeeting.status === "live" ? "default" : "outline"} className="mt-0.5 capitalize">
                      {selectedMeeting.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Required Join Threshold</span>
                    <span className="font-semibold text-foreground">
                      {selectedMeeting.attendance.tracking_enabled 
                        ? `${selectedMeeting.attendance.threshold_percentage}%` 
                        : "Disabled"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Session Attendance Report */}
          <Card className="border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-gradient-to-b from-background to-muted/10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Attendance Logs</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Select rows to apply bulk select actions below.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 text-xs px-2.5 py-1">
                  Present / Partial: {liveStats.present}
                </Badge>
                <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-500/20 text-xs px-2.5 py-1">
                  Absent / Unjoined: {liveStats.absent}
                </Badge>
                <Button className="gap-2" onClick={handleSaveLiveChanges}>
                  <Save className="h-4 w-4" /> Save Logs
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[50px] text-center">
                      <Checkbox
                        checked={liveAttendees.length > 0 && selectedLiveIds.size === liveAttendees.length}
                        onCheckedChange={(checked) => handleSelectAllLive(!!checked)}
                      />
                    </TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Joined At</TableHead>
                    <TableHead>Left At</TableHead>
                    <TableHead className="text-center">Minutes Attended</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveAttendees.map((student) => {
                    const isSelected = selectedLiveIds.has(student.student_id);
                    return (
                      <TableRow 
                        key={student.student_id} 
                        className={cn(
                          "hover:bg-muted/10 transition-colors",
                          isSelected && "bg-primary/5 hover:bg-primary/10"
                        )}
                      >
                        <TableCell className="text-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleSelectRowLive(student.student_id, !!checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.avatar_url} />
                              <AvatarFallback className="text-xs bg-primary/15 text-primary font-bold">
                                {student.student_name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-sm">{student.student_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {student.joined_at === "—" 
                            ? "—" 
                            : format(new Date(student.joined_at), "hh:mm a")}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {student.left_at === "—" 
                            ? "—" 
                            : format(new Date(student.left_at), "hh:mm a")}
                        </TableCell>
                        <TableCell className="text-center text-sm font-medium">
                          {student.minutes_present} mins
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-sm font-semibold ${
                            student.percentage >= (selectedMeeting?.attendance.threshold_percentage || 80)
                              ? "text-emerald-600 dark:text-emerald-400"
                              : student.percentage > 0
                              ? "text-amber-500"
                              : "text-muted-foreground"
                          }`}>
                            {student.percentage}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(student.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Floating Bulk Action Bar for Live Classes */}
          {selectedLiveIds.size > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background/85 dark:bg-background/90 backdrop-blur-md border border-border px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-4 fade-in duration-300 max-w-lg w-full">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                <div className="text-sm font-semibold text-foreground leading-none">
                  {selectedLiveIds.size} Selected
                </div>
              </div>
              <div className="h-6 w-px bg-border shrink-0" />
              <div className="flex-1 flex gap-2 justify-end">
                <Button 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                  onClick={() => handleBulkLiveStatus("present")}
                >
                  <Check className="h-3.5 w-3.5" /> Mark Present
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="gap-1"
                  onClick={() => handleBulkLiveStatus("absent")}
                >
                  <X className="h-3.5 w-3.5" /> Mark Absent
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 hover:bg-muted"
                  onClick={() => setSelectedLiveIds(new Set())}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Manual Sheets Tab --- */}
      {activeTab === "manual" && (
        <div className="space-y-6">
          <Card className="p-6 border border-border shadow-sm">
            <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Daily Class Sheet Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Target Academic Class</label>
                <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pick a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} ({cls.courseCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Attendance Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-10 border border-input rounded-md px-3 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-sm"
                />
              </div>

              <div>
                <Button className="w-full gap-2" onClick={handleSaveManualAttendance}>
                  <Save className="h-4 w-4" /> Save Daily Sheet
                </Button>
              </div>
            </div>
          </Card>

          {/* Manual Register Table */}
          <Card className="border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-gradient-to-b from-background to-muted/10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Student Attendance Grid</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Select rows to apply bulk select actions below.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[80px] text-center">
                      <Checkbox 
                        checked={manualStudents.length > 0 && selectedManualIds.size === manualStudents.length}
                        onCheckedChange={(checked) => handleSelectAllManual(!!checked)}
                      />
                    </TableHead>
                    <TableHead>Roll ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center">Status Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manualStudents.map((student) => {
                    const isSelected = selectedManualIds.has(student.id);
                    return (
                      <TableRow 
                        key={student.id} 
                        className={cn(
                          "hover:bg-muted/10 transition-colors",
                          isSelected && "bg-primary/5 hover:bg-primary/10"
                        )}
                      >
                        <TableCell className="text-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleSelectRowManual(student.id, !!checked)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                          {student.rollNumber}
                        </TableCell>
                        <TableCell className="font-semibold text-sm">
                          {student.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(student.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Floating Bulk Action Bar for Manual Attendance */}
          {selectedManualIds.size > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background/85 dark:bg-background/90 backdrop-blur-md border border-border px-6 py-4 rounded-2xl shadow-2xl flex flex-wrap items-center gap-4 animate-in slide-in-from-bottom-4 fade-in duration-300 max-w-xl w-full">
              <div className="flex items-center gap-2 shrink-0">
                <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                <div className="text-sm font-semibold text-foreground leading-none">
                  {selectedManualIds.size} Selected
                </div>
              </div>
              <div className="h-6 w-px bg-border shrink-0 hidden sm:block" />
              <div className="flex-1 flex flex-wrap gap-1.5 justify-end">
                <Button 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs px-2.5"
                  onClick={() => handleBulkManualStatus("Present")}
                >
                  Present
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="h-8 text-xs px-2.5"
                  onClick={() => handleBulkManualStatus("Absent")}
                >
                  Absent
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-xs px-2.5 border-amber-200 hover:bg-amber-50 text-amber-700 dark:border-amber-900 dark:hover:bg-amber-950/20"
                  onClick={() => handleBulkManualStatus("Late")}
                >
                  Late
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-xs px-2.5 border-blue-200 hover:bg-blue-50 text-blue-700 dark:border-blue-900 dark:hover:bg-blue-950/20"
                  onClick={() => handleBulkManualStatus("Excused")}
                >
                  Excused
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 hover:bg-muted"
                  onClick={() => setSelectedManualIds(new Set())}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
