"use client";

import { useState } from "react";
import { PlusCircle, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

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

export function QuestionBuilder({ initialQuestions = [], onSave }: QuestionBuilderProps) {
  // If no initial questions, start with one empty question
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    initialQuestions.length > 0 
      ? initialQuestions 
      : [{ id: `q_${Date.now()}`, content: "", options: [{ id: `opt_${Date.now()}`, text: "", isCorrect: true }] }]
  );

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q_${Date.now()}`,
        content: "",
        options: [
          { id: `opt_${Date.now()}_1`, text: "", isCorrect: true },
          { id: `opt_${Date.now()}_2`, text: "", isCorrect: false }
        ]
      }
    ]);
  };

  const removeQuestion = (qId: string) => {
    setQuestions(questions.filter(q => q.id !== qId));
  };

  const updateQuestionContent = (qId: string, content: string) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, content } : q));
  };

  const addOption = (qId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: [...q.options, { id: `opt_${Date.now()}`, text: "", isCorrect: false }]
        };
      }
      return q;
    }));
  };

  const removeOption = (qId: string, optId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        // Don't allow removing the last option
        if (q.options.length <= 1) return q;
        const newOptions = q.options.filter(o => o.id !== optId);
        // If we removed the only correct option, make the first remaining one correct
        if (!newOptions.some(o => o.isCorrect) && newOptions.length > 0) {
          newOptions[0].isCorrect = true;
        }
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const updateOptionText = (qId: string, optId: string, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: q.options.map(o => o.id === optId ? { ...o, text } : o)
        };
      }
      return q;
    }));
  };

  const setCorrectOption = (qId: string, optId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          // Set only the selected option as correct, others to false
          options: q.options.map(o => ({ ...o, isCorrect: o.id === optId }))
        };
      }
      return q;
    }));
  };

  const handleSave = () => {
    // Basic validation before saving could go here
    onSave(questions);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Quiz Questions</h2>
          <p className="text-sm text-muted-foreground">Add your questions and define the correct answers here.</p>
        </div>
        <Button onClick={handleSave} className="px-8">Save Quiz</Button>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="p-6 border border-border rounded-lg bg-card shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-semibold text-lg">Question {index + 1}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => removeQuestion(question.id)}
                disabled={questions.length === 1}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                (Remove this Question)
              </Button>
            </div>

            {/* Question Text Editor */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Question Prompt</Label>
              <RichTextEditor 
                value={question.content} 
                onChange={(html) => updateQuestionContent(question.id, html)} 
              />
            </div>

            {/* Options List */}
            <div className="space-y-3 bg-muted/20 p-4 rounded-md border border-border">
              <Label className="text-sm font-medium">Options</Label>
              <p className="text-xs text-muted-foreground mb-4">Provide possible answers and mark the correct one.</p>
              
              <div className="space-y-3">
                {question.options.map((option, optIdx) => (
                  <div key={option.id} className="flex gap-3 items-start p-3 bg-background border border-border rounded-md transition-colors hover:border-primary/30">
                    {/* Correct Toggle */}
                    <button 
                      type="button"
                      onClick={() => setCorrectOption(question.id, option.id)}
                      className={`mt-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        option.isCorrect ? "text-emerald-500" : "text-muted-foreground hover:text-foreground"
                      }`}
                      title={option.isCorrect ? "Correct Answer" : "Mark as correct"}
                    >
                      {option.isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>
                    
                    {/* Option Text Input */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                         <span className="text-sm font-semibold text-muted-foreground w-6">
                            {String.fromCharCode(65 + optIdx)}.
                         </span>
                         <Input 
                           value={option.text}
                           onChange={(e) => updateOptionText(question.id, option.id, e.target.value)}
                           placeholder="Type option here..."
                           className={option.isCorrect ? "border-emerald-500/50 focus-visible:ring-emerald-500" : ""}
                         />
                      </div>
                    </div>
                    
                    {/* Remove Option Button */}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="mt-1 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeOption(question.id, option.id)}
                      title="(Remove this option)"
                      disabled={question.options.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add Option Trigger */}
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-dashed"
                  onClick={() => addOption(question.id)}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  More Options
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-center">
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={addQuestion}
          className="w-full max-w-md border border-dashed border-primary/50 text-primary hover:bg-primary/10"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add more Question
        </Button>
      </div>
    </div>
  );
}
