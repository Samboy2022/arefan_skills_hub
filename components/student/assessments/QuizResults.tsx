'use client';

import Link from 'next/link';
import { 
  CheckCircle2Icon, 
  XCircleIcon, 
  RefreshCwIcon, 
  InfoIcon, 
  CheckIcon, 
  XIcon 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuizAttempt {
  score: number;
  total_points: number;
  max_points: number;
  time_spent_seconds: number;
  attempt_number: number;
  course_slug: string;
  answers: any[];
}

interface QuizResultsProps {
  attempt: QuizAttempt;
  quiz: any;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function QuizResults({ attempt, quiz }: QuizResultsProps) {
  const passed = attempt.score >= quiz.passing_score;
  
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 w-full animate-in slide-in-from-bottom-4 duration-500">
      {/* Results Header */}
      <Card className={`mb-8 border-t-8 shadow-md ${passed ? 'border-t-emerald-500' : 'border-t-rose-500'}`}>
        <CardContent className="p-8 text-center sm:p-12">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-inner ${
            passed ? 'bg-emerald-100 ring-4 ring-emerald-50' : 'bg-rose-100 ring-4 ring-rose-50'
          }`}>
            {passed ? (
              <CheckCircle2Icon className="w-16 h-16 text-emerald-600" />
            ) : (
              <XCircleIcon className="w-16 h-16 text-rose-600" />
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            {passed ? 'Congratulations! You Passed' : 'Quiz Not Passed'}
          </h1>
          
          <p className="text-xl font-medium text-gray-600 mb-8">
            You scored <span className={passed ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
              {attempt.score.toFixed(1)}%
            </span>
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center bg-gray-50/80 rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center justify-center p-2">
              <div className="text-3xl font-bold text-gray-800">{attempt.total_points}</div>
              <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 mt-1">Points Earned</div>
            </div>
            <div className="flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-gray-200 p-2">
              <div className="text-3xl font-bold text-gray-800">{attempt.max_points}</div>
              <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 mt-1">Total Points</div>
            </div>
            <div className="flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-gray-200 p-2">
              <div className="text-3xl font-bold text-gray-800">
                {formatTime(attempt.time_spent_seconds)}
              </div>
              <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 mt-1">Time Spent</div>
            </div>
          </div>
          
          {/* Passing Score Info */}
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
            <p className="text-gray-600 font-medium">
              Passing score: <span className="font-bold">{quiz.passing_score}%</span>
            </p>
            {!passed && (
              <p className="text-rose-600 font-medium bg-rose-50 inline-block px-4 py-2 rounded-lg">
                You need {(quiz.passing_score - attempt.score).toFixed(1)}% more to pass this quiz.
              </p>
            )}
          </div>
          
          {/* Attempts Info */}
          {quiz.attempts_allowed > 0 && (
            <p className="text-sm font-semibold text-gray-500 mt-4 bg-gray-100 inline-block px-3 py-1 rounded-full">
               Attempt {attempt.attempt_number} of {quiz.attempts_allowed}
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Review Answers (if enabled) */}
      {quiz.show_correct_answers && (
        <Card className="shadow-md border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200 pb-4">
            <CardTitle className="text-xl text-gray-800">Review Your Answers</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              {quiz.questions.map((question: any, index: number) => {
                const userAnswer = attempt.answers.find(a => a.question_id === question.id);
                const isCorrect = userAnswer?.is_correct;
                
                return (
                  <div key={question.id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                    {/* Question */}
                    <div className="flex items-start justify-between mb-4 gap-4">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                          Question {index + 1}
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 leading-snug">
                          {question.question_text}
                        </h3>
                      </div>
                      
                      {isCorrect ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 flex-shrink-0">
                          <CheckIcon className="w-4 h-4 mr-1" />
                          Correct
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-0 flex-shrink-0">
                          <XIcon className="w-4 h-4 mr-1" />
                          Incorrect
                        </Badge>
                      )}
                    </div>
                    
                    {/* Your Answer */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Your Answer:</p>
                      <div className={`p-4 rounded-lg border ${
                        isCorrect 
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' 
                          : 'bg-rose-50/50 border-rose-200 text-rose-900'
                      }`}>
                        {userAnswer?.answer_text || <span className="italic text-gray-400">No answer provided</span>}
                      </div>
                    </div>
                    
                    {/* Correct Answer (if wrong) */}
                    {!isCorrect && question.correct_answer_text && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Correct Answer:</p>
                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
                          {question.correct_answer_text}
                        </div>
                      </div>
                    )}
                    
                    {/* Explanation */}
                    {question.explanation && (
                      <div className="mt-4 p-4 bg-blue-50/60 border border-blue-100 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center uppercase tracking-wide">
                          <InfoIcon className="w-4 h-4 mr-1.5" />
                          Explanation
                        </p>
                        <p className="text-sm text-blue-800 leading-relaxed">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-4">
        {!passed && (!quiz.attempts_allowed || attempt.attempt_number < quiz.attempts_allowed) && (
          <Button 
            onClick={() => window.location.reload()}
            size="lg"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Retry Quiz
          </Button>
        )}
        
        <Link href={`/student/courses/${attempt.course_slug}`} className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full border-gray-300">
            Back to Course
          </Button>
        </Link>
      </div>
    </div>
  );
}
