"use client";

import { useRouter } from "next/navigation";
import { QuestionBuilder, QuizQuestion } from "@/components/instructor/quizzes/QuestionBuilder";

export function QuestionBuilderWrapper({ quizId }: { quizId: string }) {
  const router = useRouter();

  const handleSave = (questions: QuizQuestion[]) => {
    console.log(`Saving ${questions.length} questions for quiz ${quizId}`, questions);
    alert("Quiz questions saved successfully!");
    router.push("/instructor/quizzes");
  };

  return <QuestionBuilder onSave={handleSave} />;
}
