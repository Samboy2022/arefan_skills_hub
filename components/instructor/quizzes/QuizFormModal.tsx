"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export type QuizType = "course" | "module" | "lesson";

// Type representing the Quiz settings
export interface QuizConfig {
  id?: string;
  type: QuizType;
  targetId: string; // Course ID, Module ID, or Lesson ID
  title: string;
  isGradable: boolean;
  gradePoints?: number;
  isTimed: boolean;
  timeLimit?: number;
  randomizeQuestions: boolean;
  hasDeadline: boolean;
  startDate?: string;
  endDate?: string;
  questionsAllowed: number;
  attemptsAllowed: number;
  emailNotifications: boolean;
}

interface QuizFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: QuizConfig) => void;
  editingQuiz?: QuizConfig | null;
  courses: { id: string; title: string }[]; // Mock courses for selection
}

export function QuizFormModal({ isOpen, onClose, onSave, editingQuiz, courses }: QuizFormModalProps) {
  // Form State
  const [type, setType] = useState<QuizType>("course");
  const [targetId, setTargetId] = useState("");
  const [title, setTitle] = useState("");
  
  const [isGradable, setIsGradable] = useState(false);
  const [gradePoints, setGradePoints] = useState<number>(100);
  
  const [isTimed, setIsTimed] = useState(false);
  const [timeLimit, setTimeLimit] = useState<number>(30);
  
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  
  const [hasDeadline, setHasDeadline] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [questionsAllowed, setQuestionsAllowed] = useState<number>(10);
  const [attemptsAllowed, setAttemptsAllowed] = useState<number>(1);
  const [emailNotifications, setEmailNotifications] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingQuiz) {
        setType(editingQuiz.type);
        setTargetId(editingQuiz.targetId);
        setTitle(editingQuiz.title);
        setIsGradable(editingQuiz.isGradable);
        setGradePoints(editingQuiz.gradePoints || 100);
        setIsTimed(editingQuiz.isTimed);
        setTimeLimit(editingQuiz.timeLimit || 30);
        setRandomizeQuestions(editingQuiz.randomizeQuestions);
        setHasDeadline(editingQuiz.hasDeadline);
        setStartDate(editingQuiz.startDate || "");
        setEndDate(editingQuiz.endDate || "");
        setQuestionsAllowed(editingQuiz.questionsAllowed);
        setAttemptsAllowed(editingQuiz.attemptsAllowed);
        setEmailNotifications(editingQuiz.emailNotifications);
      } else {
        // Reset defaults
        setType("course");
        setTargetId("");
        setTitle("");
        setIsGradable(false);
        setGradePoints(100);
        setIsTimed(false);
        setTimeLimit(30);
        setRandomizeQuestions(false);
        setHasDeadline(false);
        setStartDate("");
        setEndDate("");
        setQuestionsAllowed(10);
        setAttemptsAllowed(1);
        setEmailNotifications(false);
      }
    }
  }, [isOpen, editingQuiz]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetId) return;

    onSave({
      id: editingQuiz?.id,
      type,
      targetId,
      title,
      isGradable,
      gradePoints: isGradable ? gradePoints : undefined,
      isTimed,
      timeLimit: isTimed ? timeLimit : undefined,
      randomizeQuestions,
      hasDeadline,
      startDate: hasDeadline ? startDate : undefined,
      endDate: hasDeadline ? endDate : undefined,
      questionsAllowed,
      attemptsAllowed,
      emailNotifications
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingQuiz ? "Edit Quiz Settings" : "Create New Quiz"}</DialogTitle>
            <DialogDescription>
              Configure the parameters and rules for this assessment.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* Core Settings */}
            <div className="grid gap-4 bg-muted/20 p-4 rounded-lg border border-border">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2 mb-2">Primary Info</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quizType">Quiz Type</Label>
                  <Select value={type} onValueChange={(val: QuizType) => setType(val)}>
                    <SelectTrigger id="quizType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="course">Course Quiz</SelectItem>
                      <SelectItem value="module">Module Quiz</SelectItem>
                      <SelectItem value="lesson">Lesson Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="targetCourse">Target Course / Instance</Label>
                  <Select value={targetId} onValueChange={setTargetId}>
                    <SelectTrigger id="targetCourse">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quizTitle">Quiz Name <span className="text-destructive">*</span></Label>
                <Input
                  id="quizTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Evaluation"
                  required
                />
              </div>
            </div>

            {/* Assessment Rules */}
            <div className="grid gap-4 bg-muted/20 p-4 rounded-lg border border-border">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2 mb-2">Assessment Rules</h3>
              
              {/* Gradable */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Gradable Quiz</Label>
                  <p className="text-xs text-muted-foreground">Will this quiz affect the student's final grade?</p>
                </div>
                <Switch checked={isGradable} onCheckedChange={setIsGradable} />
              </div>
              {isGradable && (
                <div className="grid gap-2 pl-4 border-l-2 border-primary/20 transition-all">
                  <Label htmlFor="gradePoints">Quiz Grade (Points)</Label>
                  <Input id="gradePoints" type="number" min={1} value={gradePoints.toString()} onChange={(e) => setGradePoints(Number(e.target.value))} />
                </div>
              )}

              {/* Timed */}
              <div className="flex items-center justify-between mt-2">
                <div>
                  <Label className="text-base">Timed Quiz</Label>
                  <p className="text-xs text-muted-foreground">Enforce a strict time limit for submission.</p>
                </div>
                <Switch checked={isTimed} onCheckedChange={setIsTimed} />
              </div>
              {isTimed && (
                <div className="grid gap-2 pl-4 border-l-2 border-primary/20 transition-all">
                  <Label htmlFor="timeLimit">Time Limit (Minutes)</Label>
                  <Input id="timeLimit" type="number" min={1} value={timeLimit.toString()} onChange={(e) => setTimeLimit(Number(e.target.value))} />
                </div>
              )}

              {/* Randomize */}
              <div className="flex items-center justify-between mt-2">
                <div>
                  <Label className="text-base">Randomize Questions</Label>
                  <p className="text-xs text-muted-foreground">Shuffle question order for each student.</p>
                </div>
                <Switch checked={randomizeQuestions} onCheckedChange={setRandomizeQuestions} />
              </div>
            </div>

            {/* Availability & Limits */}
            <div className="grid gap-4 bg-muted/20 p-4 rounded-lg border border-border">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2 mb-2">Availability & Limits</h3>

              {/* Deadline */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Set Deadline</Label>
                  <p className="text-xs text-muted-foreground">Restrict when this quiz can be taken.</p>
                </div>
                <Switch checked={hasDeadline} onCheckedChange={setHasDeadline} />
              </div>
              {hasDeadline && (
                <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20 transition-all">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              )}

              {/* Counts */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="grid gap-2">
                  <Label htmlFor="questionsAllowed">Questions Allowed</Label>
                  <Input id="questionsAllowed" type="number" min={1} value={questionsAllowed.toString()} onChange={(e) => setQuestionsAllowed(Number(e.target.value))} />
                  <p className="text-[10px] text-muted-foreground">Max questions shown from bank.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="attemptsAllowed">Attempts Allowed</Label>
                  <Input id="attemptsAllowed" type="number" min={1} value={attemptsAllowed.toString()} onChange={(e) => setAttemptsAllowed(Number(e.target.value))} />
                  <p className="text-[10px] text-muted-foreground">Number of retries per student.</p>
                </div>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between mt-2 pt-4 border-t border-border">
                <div>
                  <Label className="text-base">Submission Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive an email when a student submits.</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
            </div>

          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title || !targetId}>
              {editingQuiz ? "Save Changes" : "Create Quiz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
