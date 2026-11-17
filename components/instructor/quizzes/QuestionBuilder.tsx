"use client";

import { useState } from "react";
import { PlusCircle, Trash2, CheckCircle2, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  content: string;
  options: QuizOption[];
}

interface QuestionBuilderProps {
  initialQuestions?: QuizQuestion[];
  onSave: (questions: QuizQuestion[]) => void;
}

function plainText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}

function questionError(question: QuizQuestion): string | null {
  if (!plainText(question.content)) {
    return "Write a question prompt before continuing.";
  }
  if (!question.options.some((option) => option.text.trim())) {
    return "Add text to at least one option before continuing.";
  }
  return null;
}

function createQuestion(): QuizQuestion {
  const stamp = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  return {
    id: `q_${stamp}`,
    content: "",
    options: [
      { id: `opt_${stamp}_1`, text: "", isCorrect: true },
      { id: `opt_${stamp}_2`, text: "", isCorrect: false },
    ],
  };
}

export function QuestionBuilder({ initialQuestions = [], onSave }: QuestionBuilderProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    initialQuestions.length > 0
      ? initialQuestions
      : [{ id: `q_${Date.now()}`, content: "", options: [{ id: `opt_${Date.now()}`, text: "", isCorrect: true }] }]
  );
  const [activeStep, setActiveStep] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);

  const question = questions[Math.min(activeStep, questions.length - 1)];
  const stepNumber = Math.min(activeStep, questions.length - 1) + 1;

  const addQuestion = () => {
    const next = [...questions, createQuestion()];
    setQuestions(next);
    setActiveStep(next.length - 1);
    setStepError(null);
  };

  const removeQuestion = (qId: string) => {
    if (questions.length <= 1) return;
    const index = questions.findIndex((q) => q.id === qId);
    if (index < 0) return;
    const next = questions.filter((q) => q.id !== qId);
    setQuestions(next);
    setActiveStep((current) => {
      if (current > index) return current - 1;
      return Math.min(current, next.length - 1);
    });
    setStepError(null);
  };

  const updateQuestionContent = (qId: string, content: string) => {
    setQuestions(questions.map((q) => (q.id === qId ? { ...q, content } : q)));
    setStepError(null);
  };

  const addOption = (qId: string) => {
    setQuestions(questions.map((q) => {
      if (q.id === qId) {
        return {
          ...q,
          options: [...q.options, { id: `opt_${Date.now()}`, text: "", isCorrect: false }],
        };
      }
      return q;
    }));
  };

  const removeOption = (qId: string, optId: string) => {
    setQuestions(questions.map((q) => {
      if (q.id === qId) {
        if (q.options.length <= 1) return q;
        const newOptions = q.options.filter((o) => o.id !== optId);
        if (!newOptions.some((o) => o.isCorrect) && newOptions.length > 0) {
          newOptions[0].isCorrect = true;
        }
        return { ...q, options: newOptions };
      }
      return q;
    }));
    setStepError(null);
  };

  const updateOptionText = (qId: string, optId: string, text: string) => {
    setQuestions(questions.map((q) => {
      if (q.id === qId) {
        return {
          ...q,
          options: q.options.map((o) => (o.id === optId ? { ...o, text } : o)),
        };
      }
      return q;
    }));
    setStepError(null);
  };

  const setCorrectOption = (qId: string, optId: string) => {
    setQuestions(questions.map((q) => {
      if (q.id === qId) {
        return {
          ...q,
          options: q.options.map((o) => ({ ...o, isCorrect: o.id === optId })),
        };
      }
      return q;
    }));
  };

  const goToStep = (index: number) => {
    setActiveStep(index);
    setStepError(null);
  };

  const goNext = () => {
    const error = questionError(question);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError(null);
    setActiveStep((current) => Math.min(current + 1, questions.length - 1));
  };

  const goBack = () => {
    setStepError(null);
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const handleSave = () => {
    const invalidIndex = questions.findIndex((item) => questionError(item));
    if (invalidIndex >= 0) {
      setActiveStep(invalidIndex);
      setStepError(questionError(questions[invalidIndex]));
      return;
    }
    onSave(questions);
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h2 className="text-xl font-bold">Quiz Questions</h2>
        <p className="text-sm text-muted-foreground">Build one question at a time. Each new question adds a step.</p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex w-max gap-2 sm:w-full sm:flex-wrap" role="tablist" aria-label="Quiz question steps">
          {questions.map((item, index) => {
            const isActive = index === activeStep;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Question ${index + 1}`}
                onClick={() => goToStep(index)}
                className={cn(
                  "flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-semibold transition-colors",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/40"
                )}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-semibold">Question {stepNumber}</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => removeQuestion(question.id)}
            disabled={questions.length === 1}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove this question
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Question Prompt</Label>
          <RichTextEditor
            key={question.id}
            value={question.content}
            onChange={(html) => updateQuestionContent(question.id, html)}
          />
        </div>

        <div className="space-y-3 rounded-md border border-border bg-muted/20 p-4">
          <Label className="text-sm font-medium">Options</Label>
          <p className="mb-4 text-xs text-muted-foreground">Provide possible answers and mark the correct one.</p>

          <div className="space-y-3">
            {question.options.map((option, optIdx) => (
              <div key={option.id} className="flex items-start gap-3 rounded-md border border-border bg-background p-3 transition-colors hover:border-primary/30">
                <button
                  type="button"
                  onClick={() => setCorrectOption(question.id, option.id)}
                  className={`mt-2 flex shrink-0 items-center justify-center transition-colors ${
                    option.isCorrect ? "text-emerald-500" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={option.isCorrect ? "Correct Answer" : "Mark as correct"}
                  aria-label={option.isCorrect ? "Correct Answer" : "Mark as correct"}
                >
                  {option.isCorrect ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                </button>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-sm font-semibold text-muted-foreground">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <Input
                      value={option.text}
                      onChange={(e) => updateOptionText(question.id, option.id, e.target.value)}
                      placeholder="Type option here..."
                      aria-label={`Option ${String.fromCharCode(65 + optIdx)}`}
                      className={option.isCorrect ? "border-emerald-500/50 focus-visible:ring-emerald-500" : ""}
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-1 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeOption(question.id, option.id)}
                  title="Remove this option"
                  aria-label="Remove this option"
                  disabled={question.options.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="border-dashed"
              onClick={() => addOption(question.id)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              More Options
            </Button>
          </div>
        </div>

        {stepError ? (
          <p className="text-sm font-medium text-destructive" role="alert">
            {stepError}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-foreground">
          Step {stepNumber} of {questions.length}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={goBack} disabled={activeStep === 0}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={goNext} disabled={activeStep >= questions.length - 1}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={addQuestion}>
            <PlusCircle className="h-4 w-4" />
            Add question
          </Button>
          <Button onClick={handleSave}>Save Quiz</Button>
        </div>
      </div>
    </div>
  );
}
