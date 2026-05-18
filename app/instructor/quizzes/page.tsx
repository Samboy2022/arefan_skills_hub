"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MoreHorizontal, Edit, Eye, Trash2, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MOCK_QUIZZES, MOCK_INSTRUCTOR_COURSES } from "@/lib/instructor-mock-data";
import { QuizFormModal, QuizConfig } from "@/components/instructor/quizzes/QuizFormModal";
import { QuizPreviewModal } from "@/components/instructor/quizzes/QuizPreviewModal";
import { OverrideStudentModal } from "@/components/instructor/quizzes/OverrideStudentModal";

type LocalQuiz = typeof MOCK_QUIZZES[0] & Partial<QuizConfig>;

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<LocalQuiz[]>(MOCK_QUIZZES as LocalQuiz[]);
  
  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizConfig | null>(null);
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [activeQuizForModals, setActiveQuizForModals] = useState<LocalQuiz | null>(null);

  const handleOpenCreateModal = () => {
    setEditingQuiz(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (quiz: LocalQuiz) => {
    setEditingQuiz({
      id: quiz.id,
      title: quiz.title,
      type: "course", 
      targetId: "course-1",
      isGradable: quiz.isGradable !== undefined ? quiz.isGradable : true,
      gradePoints: quiz.gradePoints || 10,
      isTimed: quiz.isTimed !== undefined ? quiz.isTimed : !!quiz.timeLimit,
      timeLimit: quiz.timeLimit || 30,
      randomizeQuestions: quiz.randomizeQuestions !== undefined ? quiz.randomizeQuestions : true,
      hasDeadline: !!quiz.dueDate,
      startDate: quiz.startDate || "",
      endDate: quiz.dueDate || "",
      questionsAllowed: quiz.questionsAllowed || 10,
      attemptsAllowed: quiz.attemptsAllowed || 1,
      emailNotifications: quiz.emailNotifications !== undefined ? quiz.emailNotifications : true,
    } as QuizConfig);
    setIsFormModalOpen(true);
  };

  const handleDeleteQuiz = (id: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
  };

  const handleSaveQuiz = (data: QuizConfig) => {
    if (data.id) {
      setQuizzes(prev => prev.map(q => {
        if (q.id === data.id) {
          const { endDate, startDate, targetId, ...restData } = data;
          return {
            ...q,
            ...restData,
            courseId: targetId,
            dueDate: endDate ? new Date(endDate) : q.dueDate,
            timeLimit: data.timeLimit || q.timeLimit,
          } as LocalQuiz;
        }
        return q;
      }));
    } else {
      const { endDate, startDate, targetId, ...restData } = data;
      const newQuiz = {
        ...restData,
        id: `quiz_${Date.now()}`,
        description: `${data.type} Assessment`,
        courseId: targetId,
        lessonsCount: data.questionsAllowed,
        durationMinutes: data.timeLimit || 0,
        published: true,
        dueDate: endDate ? new Date(endDate) : undefined,
        attempts: [],
        questions: [],
        passingScore: 50,
        createdAt: new Date(),
      } as unknown as LocalQuiz;
      setQuizzes(prev => [...prev, newQuiz]);
    }
    setIsFormModalOpen(false);
  };

  const executePreview = (quiz: LocalQuiz) => {
    setActiveQuizForModals(quiz);
    setIsPreviewOpen(true);
  };

  const executeOverride = (quiz: LocalQuiz) => {
    setActiveQuizForModals(quiz);
    setIsOverrideOpen(true);
  };

  // Helper flags mappings with fallbacks
  const getFlagStr = (val?: boolean) => val || val === undefined ? "Yes" : "No";

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Quizzes & Exams" }
        ]} 
      />
      <div>
        <PageHeader
          title="Quizzes & Exams"
          description="Create and manage assessments for your courses via DataTable."
          action={
            <Button className="gap-2" onClick={handleOpenCreateModal}>
              <Plus className="h-4 w-4" />
              New Quiz
            </Button>
          }
        />
      </div>

      <div className="w-full overflow-x-auto border border-border rounded-md bg-card shadow-sm">
        <Table className="w-full min-w-[max-content]">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Quiz Name</TableHead>
              <TableHead className="whitespace-nowrap">Attempts</TableHead>
              <TableHead className="whitespace-nowrap">Gradable</TableHead>
              <TableHead className="whitespace-nowrap">Active</TableHead>
              <TableHead className="whitespace-nowrap">Duration</TableHead>
              <TableHead className="whitespace-nowrap">Score</TableHead>
              <TableHead className="whitespace-nowrap">Submissions</TableHead>
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                   No quizzes found.
                 </TableCell>
               </TableRow>
            ) : quizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell className="font-medium text-foreground">
                  {quiz.title}
                  <Link href={`/instructor/quizzes/${quiz.id}/questions`} className="block mt-1 text-[10px] text-primary hover:underline font-normal uppercase tracking-wider">
                    Build Questions
                  </Link>
                </TableCell>
                <TableCell>{quiz.attemptsAllowed || 1}</TableCell>
                <TableCell>{quiz.isGradable === false ? "No" : "Yes"}</TableCell>
                <TableCell>
                  {quiz.published ? (
                    <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">Yes</Badge>
                  ) : (
                    <Badge variant="secondary">No</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {quiz.timeLimit ? `${quiz.timeLimit} mins` : <span className="text-muted-foreground">None</span>}
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{quiz.gradePoints || "10.00"}</span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full h-6 px-2 text-xs font-semibold">
                    {quiz.attempts?.length || 0}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => executePreview(quiz)}>
                          <Eye className="mr-2 h-4 w-4 text-emerald-500" />
                          View Quiz
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEditModal(quiz)}>
                          <Edit className="mr-2 h-4 w-4 text-primary" />
                          Edit Form
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => executeOverride(quiz)}>
                          <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />
                          Override Student
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                            <span className="text-destructive">Delete Quiz</span>
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Quiz?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the quiz
                          <span className="font-semibold text-foreground"> {quiz.title}</span> 
                          and remove all of its data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteQuiz(quiz.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <QuizFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveQuiz}
        editingQuiz={editingQuiz}
        courses={MOCK_INSTRUCTOR_COURSES.map(c => ({ id: c.id, title: c.title }))}
      />

      <QuizPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        quizTitle={activeQuizForModals?.title || ""}
      />

      <OverrideStudentModal 
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        quizTitle={activeQuizForModals?.title || ""}
      />
    </div>
  );
}
