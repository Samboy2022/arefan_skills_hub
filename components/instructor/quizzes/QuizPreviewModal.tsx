"use client";

import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export type QuizPreviewRole = "school-admin" | "instructor";

export interface PreviewQuestionOption {
  text: string;
  isCorrect?: boolean;
}

export interface PreviewQuestion {
  id: string;
  type?: string;
  content: string;
  options?: Array<string | PreviewQuestionOption>;
  correctAnswer?: string;
  order?: number;
}

export interface QuizPreviewData {
  id: string;
  title: string;
  published?: boolean;
  timeLimit?: number;
  gradePoints?: number | string;
  attemptsAllowed?: number;
  dueDate?: Date | string;
  questions?: PreviewQuestion[];
}

interface QuizPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: QuizPreviewData | null;
  role: QuizPreviewRole;
}

function plainText(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}

function formatDue(dueDate?: Date | string) {
  if (!dueDate) return "None";
  const date = dueDate instanceof Date ? dueDate : new Date(dueDate);
  if (Number.isNaN(date.getTime())) return "None";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function optionText(option: string | PreviewQuestionOption) {
  return typeof option === "string" ? option : option.text;
}

function isMarkedCorrect(option: string | PreviewQuestionOption, correctAnswer?: string) {
  if (typeof option !== "string" && option.isCorrect) return true;
  if (!correctAnswer) return false;
  return optionText(option).trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

function typeLabel(type?: string) {
  switch (type) {
    case "true-false":
      return "True / False";
    case "essay":
      return "Essay";
    case "file":
      return "File";
    case "mcq":
      return "Multiple choice";
    default:
      return "Multiple choice";
  }
}

export function QuizPreviewModal({ isOpen, onClose, quiz, role }: QuizPreviewModalProps) {
  const questions = [...(quiz?.questions ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const builderHref = quiz ? `/${role}/quizzes/${quiz.id}/questions` : "#";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Preview: {quiz?.title || "Quiz"}</DialogTitle>
          <DialogDescription>
            Read-only review of this quiz. Correct answers are marked for checking.
          </DialogDescription>
        </DialogHeader>

        {quiz ? (
          <div className="space-y-6 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={quiz.published ? "outline" : "secondary"} className={quiz.published ? "border-emerald-500/30 text-emerald-600" : ""}>
                {quiz.published ? "Published" : "Unpublished"}
              </Badge>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-md border border-border bg-muted/20 p-3">
                <dt className="text-xs text-muted-foreground">Time limit</dt>
                <dd className="mt-1 font-semibold">{quiz.timeLimit ? `${quiz.timeLimit} mins` : "None"}</dd>
              </div>
              <div className="rounded-md border border-border bg-muted/20 p-3">
                <dt className="text-xs text-muted-foreground">Points</dt>
                <dd className="mt-1 font-semibold">{quiz.gradePoints ?? "None"}</dd>
              </div>
              <div className="rounded-md border border-border bg-muted/20 p-3">
                <dt className="text-xs text-muted-foreground">Attempts</dt>
                <dd className="mt-1 font-semibold">{quiz.attemptsAllowed ?? "None"}</dd>
              </div>
              <div className="rounded-md border border-border bg-muted/20 p-3">
                <dt className="text-xs text-muted-foreground">Due date</dt>
                <dd className="mt-1 font-semibold">{formatDue(quiz.dueDate)}</dd>
              </div>
            </dl>

            {questions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                <p>This quiz has no questions yet.</p>
                <Link href={builderHref} className="mt-2 inline-block font-semibold text-primary hover:underline" onClick={onClose}>
                  Open the builder to add questions
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const kind = question.type ?? (question.options?.length ? "mcq" : "essay");
                  const showOptions = kind === "mcq" || kind === "true-false" || (!question.type && (question.options?.length ?? 0) > 0);
                  return (
                    <article key={question.id} className="space-y-3 rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold">Question {index + 1}</h3>
                        <Badge variant="secondary">{typeLabel(kind)}</Badge>
                      </div>
                      <p className="text-sm text-foreground">{plainText(question.content) || "Untitled question"}</p>
                      {showOptions && question.options && question.options.length > 0 ? (
                        <ul className="space-y-2">
                          {question.options.map((option, optionIndex) => {
                            const correct = isMarkedCorrect(option, question.correctAnswer);
                            return (
                              <li
                                key={`${question.id}-${optionIndex}`}
                                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                                  correct ? "border-emerald-500/40 bg-emerald-500/10" : "border-border"
                                }`}
                              >
                                <span className="w-5 font-semibold text-muted-foreground">{String.fromCharCode(65 + optionIndex)}.</span>
                                <span className="flex-1">{optionText(option)}</span>
                                {correct ? <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-label="Correct answer" /> : null}
                              </li>
                            );
                          })}
                        </ul>
                      ) : kind === "true-false" && question.correctAnswer ? (
                        <p className="text-sm font-medium text-emerald-600">Correct answer: {question.correctAnswer}</p>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
