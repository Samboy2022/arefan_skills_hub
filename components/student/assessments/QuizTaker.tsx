'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, Loader2, CheckCircleIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { QuestionInput } from './QuestionInput';

interface QuizTakerProps {
  quiz: any;
  onComplete: (score: number) => void;
}

export function QuizTaker({ quiz, onComplete }: QuizTakerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(
    quiz.time_limit_minutes ? quiz.time_limit_minutes * 60 : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Timer countdown
  useEffect(() => {
    if (timeLeft === null) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const allQuestionsAnswered = quiz.questions.every((q: any) => answers[q.id] !== undefined && answers[q.id] !== '');
  
  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (!allQuestionsAnswered && timeLeft && timeLeft > 0) {
      const unansweredCount = quiz.questions.filter((q: any) => !answers[q.id]).length;
      if (!window.confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`)) {
        return;
      }
    }
    
    setIsSubmitting(true);
    
    // Simulate API submission network delay
    setTimeout(() => {
      // Calculate a dummy score based on number of questions
      const dummyScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
      setIsSubmitting(false);
      onComplete(dummyScore);
    }, 1500);
  };
  
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  const answeredCount = Object.keys(answers).filter(k => answers[parseInt(k)] !== undefined && answers[parseInt(k)] !== '').length;
  const progressPercent = (answeredCount / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 w-full">
      {/* Quiz Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600 mt-1 font-medium">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>
          
          {/* Timer */}
          {timeLeft !== null && (
            <div className="sm:text-right bg-gray-50 p-3 rounded-lg border border-gray-200 self-start sm:self-auto min-w-[140px]">
              <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Time Remaining</div>
              <div className={`text-3xl font-mono font-bold ${
                timeLeft < 60 ? 'text-rose-600 animate-pulse' : 'text-gray-900'
              }`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span className="text-gray-600">Completion Progress</span>
            <span className="text-blue-600">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2.5" />
        </div>
      </div>
      
      {/* Question Card */}
      <Card className="mb-6 shadow-md border-0 ring-1 ring-gray-200">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
                Question {currentQuestionIndex + 1}
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                {currentQuestion.question_text}
              </h2>
            </div>
            <Badge variant="outline" className="bg-white font-semibold text-sm py-1">
              {currentQuestion.points} {currentQuestion.points === 1 ? 'pt' : 'pts'}
            </Badge>
          </div>
          
          {/* Question Image */}
          {currentQuestion.question_image_url && (
            <div className="mt-6 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={currentQuestion.question_image_url}
                alt="Question illustration"
                width={800}
                height={400}
                className="w-full object-cover max-h-96"
              />
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-6 pb-8">
          <QuestionInput
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={(value) => handleAnswer(currentQuestion.id, value)}
          />
        </CardContent>
      </Card>
      
      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="w-full sm:w-auto"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {/* Question Navigator (Dots) - Hidden on very small screens if lots of questions */}
        <div className="flex flex-wrap justify-center gap-2 max-w-full overflow-x-auto pb-2 sm:pb-0">
          {quiz.questions.map((q: any, index: number) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-9 h-9 rounded-full font-semibold text-sm flex items-center justify-center transition-all ${
                index === currentQuestionIndex
                  ? 'bg-blue-600 text-white shadow-md transform scale-110'
                  : answers[q.id] !== undefined && answers[q.id] !== ''
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-white border border-gray-300 text-gray-500 hover:border-gray-400'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Quiz
                <CheckIcon className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            Next Question
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      
      {/* Auto-save indicator */}
      <div className="text-center text-sm font-medium text-gray-500 mt-8 flex items-center justify-center">
        <CheckCircleIcon className="w-4 h-4 mr-1.5 text-emerald-500" />
        Answers are saved automatically to your browser
      </div>
    </div>
  );
}
