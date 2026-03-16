'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CalendarIcon, 
  UploadIcon, 
  FileTextIcon, 
  FileIcon, 
  XIcon, 
  AlertTriangleIcon, 
  CheckIcon, 
  XCircleIcon,
  Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

interface AssignmentSubmissionProps {
  assignment: any;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateString));
}

export function AssignmentSubmission({ assignment }: AssignmentSubmissionProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [submissionType, setSubmissionType] = useState<'text' | 'file' | 'link'>(
    assignment.submission_type === 'multiple_files' ? 'file' : assignment.submission_type
  );
  const [textSubmission, setTextSubmission] = useState('');
  const [linkSubmission, setLinkSubmission] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate file size
    const oversizedFiles = selectedFiles.filter(
      f => f.size > assignment.max_file_size_mb * 1024 * 1024
    );
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `Some files exceed ${assignment.max_file_size_mb}MB limit`,
        variant: "destructive"
      });
      return;
    }
    
    // Validate file types
    const invalidFiles = selectedFiles.filter(f => {
      const extension = f.name.split('.').pop()?.toLowerCase() || '';
      return !assignment.allowed_file_types.includes(extension) && assignment.allowed_file_types.length > 0;
    });
    
    if (invalidFiles.length > 0 && assignment.allowed_file_types.length > 0) {
      toast({
        title: "Invalid file type",
        description: `Only ${assignment.allowed_file_types.join(', ')} files are allowed`,
        variant: "destructive"
      });
      return;
    }
    
    setFiles(prev => [...prev, ...selectedFiles]);
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Success",
        description: 'Assignment submitted successfully!',
      });
      router.push(`/student/courses/${assignment.course_id}`);
    }, 1500);
  };
  
  const isLate = assignment.due_date && new Date() > new Date(assignment.due_date);
  const canSubmit = isLate ? assignment.late_submission_allowed : true;
  
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 w-full">
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="bg-gray-50/80 border-b border-gray-100 pb-6 rounded-t-xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-900">{assignment.title}</CardTitle>
              <CardDescription className="mt-3 text-base text-gray-700 leading-relaxed max-w-2xl">
                {assignment.description}
              </CardDescription>
            </div>
            
            <Badge className="self-start md:self-auto bg-blue-100 text-blue-800 hover:bg-blue-200 border-0 text-sm px-3 py-1 font-semibold whitespace-nowrap">
              {assignment.points} points
            </Badge>
          </div>
          
          {/* Due Date */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="flex items-center text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className={isLate ? 'text-rose-600 font-bold' : 'text-gray-700'}>
                Due: {assignment.due_date ? formatDate(assignment.due_date) : 'No due date'}
              </span>
            </div>
            
            {isLate && (
              <Badge variant="destructive" className="bg-rose-500 font-semibold px-3 py-1">OVERDUE</Badge>
            )}
          </div>
          
          {/* Instructions Document */}
          {assignment.instructions_document_url && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <a
                href={assignment.instructions_document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-medium text-sm rounded-lg hover:bg-blue-50 border border-blue-100 transition-colors shadow-sm"
              >
                <FileTextIcon className="w-4 h-4 mr-2" />
                Download Instructions Document
              </a>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-8">
          {canSubmit ? (
            <div className="space-y-8">
              {/* Submission Type Selector */}
              {assignment.submission_type === 'multiple_files' && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <Label className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 block">Submission Format</Label>
                  <RadioGroup value={submissionType} onValueChange={setSubmissionType as any}>
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                      <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 flex-1 hover:border-blue-300 transition-colors">
                        <RadioGroupItem value="file" id="file" />
                        <Label htmlFor="file" className="font-medium cursor-pointer flex-1">Upload Files</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 flex-1 hover:border-blue-300 transition-colors">
                        <RadioGroupItem value="text" id="text" />
                        <Label htmlFor="text" className="font-medium cursor-pointer flex-1">Text Entry</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 flex-1 hover:border-blue-300 transition-colors">
                        <RadioGroupItem value="link" id="link" />
                        <Label htmlFor="link" className="font-medium cursor-pointer flex-1">Website URL</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              {/* Text Submission */}
              {submissionType === 'text' && (
                <div className="space-y-3">
                  <Label htmlFor="text-submission" className="text-base font-semibold text-gray-800">Your Submission Entry</Label>
                  <Textarea
                    id="text-submission"
                    value={textSubmission}
                    onChange={(e) => setTextSubmission(e.target.value)}
                    placeholder="Type or paste your massive assignment text submission here..."
                    rows={12}
                    className="mt-2 text-base leading-relaxed p-4 resize-y bg-gray-50/30 focus:bg-white"
                  />
                </div>
              )}
              
              {/* Link Submission */}
              {submissionType === 'link' && (
                <div className="space-y-3">
                  <Label htmlFor="link-submission" className="text-base font-semibold text-gray-800">Submission URL</Label>
                  <Input
                    id="link-submission"
                    type="url"
                    value={linkSubmission}
                    onChange={(e) => setLinkSubmission(e.target.value)}
                    placeholder="https://github.com/yourusername/project"
                    className="mt-2 text-lg py-6 bg-gray-50/30 focus:bg-white font-mono"
                  />
                  <p className="text-sm text-gray-500">Provide a direct link to your work (Google Doc, GitHub Repo, Figma file, etc.)</p>
                </div>
              )}
              
              {/* File Upload */}
              {submissionType === 'file' && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-800">Upload Files</Label>
                  <div className="mt-2">
                    <div className="border-2 border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50/80 rounded-xl p-10 text-center transition-colors shadow-sm">
                      <input
                        type="file"
                        multiple={assignment.submission_type === 'multiple_files'}
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept={assignment.allowed_file_types?.map((t: string) => `.${t}`).join(',')}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer block">
                        <div className="bg-white w-16 h-16 rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-blue-100">
                          <UploadIcon className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="text-lg font-medium text-blue-900 mb-1">
                          Click to browse or drag and drop
                        </p>
                        <p className="text-sm text-blue-600/70 font-medium">
                          {assignment.allowed_file_types?.length > 0 
                            ? assignment.allowed_file_types.join(', ').toUpperCase()
                            : 'Any file type'} 
                          {' '}(Max {assignment.max_file_size_mb}MB per file)
                        </p>
                      </label>
                    </div>
                    
                    {/* Uploaded Files List */}
                    {files.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <Label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Ready to submit ({files.length})</Label>
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 shadow-sm rounded-lg"
                          >
                            <div className="flex items-center overflow-hidden">
                              <div className="bg-gray-100 p-2 rounded mr-4 flex-shrink-0">
                                <FileIcon className="w-6 h-6 text-gray-500" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs font-medium text-gray-500 mt-0.5">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 flex-shrink-0 bg-transparent h-10 w-10 p-0 rounded-full"
                            >
                              <XIcon className="w-5 h-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Late Penalty Warning */}
              {isLate && assignment.late_penalty_percent > 0 && (
                <Alert variant="destructive" className="bg-rose-50 border-rose-200 text-rose-900">
                  <AlertTriangleIcon className="w-5 h-5 text-rose-600" />
                  <AlertTitle className="text-base font-bold text-rose-800">Late Submission Penalty applies</AlertTitle>
                  <AlertDescription className="text-sm mt-1">
                    This submission is past the due date. A <strong>{assignment.late_penalty_percent}% penalty</strong> will be applied to your final grade by the instructor.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Submit Button */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => router.back()}
                  className="font-medium bg-white text-gray-700"
                >
                  Cancel
                </Button>
                
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting || (
                    (submissionType === 'text' && !textSubmission) ||
                    (submissionType === 'link' && !linkSubmission) ||
                    (submissionType === 'file' && files.length === 0)
                  )}
                  className="bg-blue-600 hover:bg-blue-700 font-medium px-8 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Uploading Submission...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-5 h-5 mr-2" />
                      Submit Assignment
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 bg-gray-50 rounded-xl border border-gray-200 text-center px-4">
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircleIcon className="w-10 h-10 text-rose-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Submissions Closed</h3>
              <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                The due date has passed and late submissions are unfortunately not allowed for this assignment. Please contact your instructor if you need an extension.
              </p>
              <Button variant="outline" className="mt-8 px-6" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
