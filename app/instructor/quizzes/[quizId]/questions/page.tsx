import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/instructor/page-header";
import { QuestionBuilder } from "@/components/instructor/quizzes/QuestionBuilder";

export default async function QuizQuestionsPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const resolvedParams = await params;
  const quizId = resolvedParams.quizId;

  if (!quizId) {
    return notFound();
  }

  // Handle mock save action (Server side logging conceptually, client side execution)
  const handleSaveQuestions = async (questions: any) => {
    "use server";
    console.log("Saving questions for quiz", quizId, questions);
    // Real implementation would save to DB here or pass an API route to the client
  };

  return (
    <div className="font-sans mx-auto max-w-4xl space-y-6 pb-12">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Dashboard", href: "/instructor" },
            { label: "Quizzes", href: "/instructor/quizzes" },
            { label: "Manage Questions" }
          ]} 
        />
      </div>

      <div className="pt-2">
        <PageHeader
          title="Question Builder"
          description="Design the questions, answers, and correct options for your assessment."
        />
      </div>

      {/* The Question Builder is a generic client component that handles state */}
      {/* For saving, we could pass an action, but standard practice in Next 15 is client-side fetch or server action.
          We will wrap it in a client component or let it handle its own API calls, but for this mock we pass a console log wrapper. 
          Wait, passing functions to client components must be Server Actions if not directly from client.
          For this UI mock, we'll just not pass a server action, but handle the save directly purely on the client. */}
      
      <QuestionBuilderWrapper quizId={quizId} />
    </div>
  );
}

// Quick wrapper to handle the client-side save alert/log
import { QuestionBuilderWrapper } from "./QuestionBuilderWrapper";
