"use client";

import * as React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { StudentHeroCard } from "@/components/instructor/students/StudentHeroCard";
import { StudentTabStrip } from "@/components/instructor/students/StudentTabStrip";
import { MessageThread } from "@/components/instructor/students/MessageThread";
import { MessageComposer } from "@/components/instructor/students/MessageComposer";
import { MOCK_STUDENTS, MOCK_INSTRUCTOR_COURSES, MOCK_MESSAGES, MessageThread as MessageType } from "@/lib/instructor-mock-data";

export default function StudentMessagePage({ params }: { params: Promise<{ studentId: string }> }) {
  const unwrappedParams = React.use(params);
  const student = MOCK_STUDENTS.find(s => s.id === unwrappedParams.studentId) || MOCK_STUDENTS[0];
  const enrolledCourses = MOCK_INSTRUCTOR_COURSES.filter((c) => student.enrolledCourses.includes(c.id));

  const initialMessages = MOCK_MESSAGES[student.id] || [];
  const [messages, setMessages] = React.useState<MessageType[]>(initialMessages);

  const handleSend = (text: string) => {
    const newMessage: MessageType = {
      id: `msg-${Date.now()}`,
      senderId: "instructor-1", // assuming current user
      senderName: "You",
      senderRole: "instructor",
      body: text,
      sentAt: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Students", href: "/instructor/students" },
          { label: student.name, href: `/instructor/students/${student.id}` },
          { label: "Message" }
        ]} 
      />

      <StudentHeroCard student={student} courses={enrolledCourses} />
      <StudentTabStrip studentId={student.id} />

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="h-[55vh] overflow-y-auto border-b bg-background">
          <MessageThread messages={messages} />
        </div>
        <div className="p-4 bg-muted/20">
          <MessageComposer onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
