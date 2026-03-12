import { Mail, MapPin, Calendar, Award, BookOpen, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";

export default function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="My Profile"
        description="View and manage your student profile"
      />

      {/* Profile Header */}
      <Card className="p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
              JD
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">John Doe</h1>
              <p className="text-lg text-muted-foreground mb-3">Student</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  john.doe@university.edu
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Computer Science, Class of 2024
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member since January 15, 2024
                </div>
              </div>
            </div>
          </div>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Active Courses</p>
          <p className="text-3xl font-bold">3</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Overall GPA</p>
          <p className="text-3xl font-bold">3.65</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Credits Earned</p>
          <p className="text-3xl font-bold">84</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Assignments Done</p>
          <p className="text-3xl font-bold">32</p>
        </Card>
      </div>

      {/* Academic Summary */}
      <Card className="p-6 mb-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Award className="h-5 w-5" />
          Academic Summary
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Average Grade</p>
            <p className="text-3xl font-bold">85.2%</p>
            <p className="text-xs text-muted-foreground mt-2">Across all courses</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Attendance Rate</p>
            <p className="text-3xl font-bold">94%</p>
            <p className="text-xs text-muted-foreground mt-2">Sessions attended</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Assignment Completion</p>
            <p className="text-3xl font-bold">100%</p>
            <p className="text-xs text-muted-foreground mt-2">All assignments submitted</p>
          </div>
        </div>
      </Card>

      {/* Current Courses */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Current Courses
        </h3>

        <div className="space-y-4">
          {[
            { name: "Introduction to Computer Science", code: "CS101", grade: "A-", progress: 65 },
            { name: "Calculus II", code: "MATH201", grade: "B+", progress: 72 },
            { name: "English Literature", code: "ENG102", grade: "B", progress: 58 },
          ].map((course, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-border hover:border-primary transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold">{course.name}</p>
                  <p className="text-sm text-muted-foreground">{course.code}</p>
                </div>
                <span className="text-2xl font-bold text-primary">{course.grade}</span>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
