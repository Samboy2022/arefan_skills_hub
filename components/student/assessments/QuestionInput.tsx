'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface QuestionOption {
  id: number;
  option_text: string;
}

interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  points: number;
  options?: QuestionOption[];
}

interface QuestionInputProps {
  question: QuizQuestion;
  value: any;
  onChange: (value: any) => void;
}

export function QuestionInput({ question, value, onChange }: QuestionInputProps) {
  switch (question.question_type) {
    case 'multiple_choice':
      return <MultipleChoiceInput question={question} value={value} onChange={onChange} />;
    
    case 'true_false':
      return <TrueFalseInput value={value} onChange={onChange} />;
    
    case 'fill_blank':
      return <FillBlankInput value={value} onChange={onChange} />;
    
    case 'essay':
      return <EssayInput value={value} onChange={onChange} />;
    
    default:
      return <div className="text-red-500">Unsupported question type.</div>;
  }
}

function MultipleChoiceInput({ question, value, onChange }: QuestionInputProps) {
  if (!question.options) return null;
  
  return (
    <RadioGroup value={value?.toString()} onValueChange={(v) => onChange(parseInt(v))}>
      <div className="space-y-3">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              value === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onChange(option.id)}
          >
            <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
            <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
              {option.option_text}
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}

function TrueFalseInput({ value, onChange }: Omit<QuestionInputProps, 'question'>) {
  return (
    <RadioGroup value={value?.toString()} onValueChange={onChange}>
      <div className="space-y-3">
        <div
          className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            value === 'true' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onChange('true')}
        >
          <RadioGroupItem value="true" id="true" />
          <Label htmlFor="true" className="flex-1 cursor-pointer font-medium">True</Label>
        </div>
        
        <div
          className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            value === 'false' ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onChange('false')}
        >
          <RadioGroupItem value="false" id="false" />
          <Label htmlFor="false" className="flex-1 cursor-pointer font-medium">False</Label>
        </div>
      </div>
    </RadioGroup>
  );
}

function FillBlankInput({ value, onChange }: Omit<QuestionInputProps, 'question'>) {
  return (
    <Input
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your answer here..."
      className="text-lg py-6"
    />
  );
}

function EssayInput({ value, onChange }: Omit<QuestionInputProps, 'question'>) {
  return (
    <Textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write your comprehensive answer here..."
      rows={10}
      className="text-base p-4"
    />
  );
}
