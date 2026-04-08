import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lesson, LessonType } from "./CurriculumBuilder";

interface LessonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (moduleId: string, data: any) => void;
  moduleId: string | null;
  editingLesson?: Lesson;
}

export function LessonFormModal({ isOpen, onClose, onSave, moduleId, editingLesson }: LessonFormModalProps) {
  const [title, setTitle] = useState("");
  const [lessonType, setLessonType] = useState<LessonType>("video");
  const [videoUrl, setVideoUrl] = useState("");
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (editingLesson) {
        setTitle(editingLesson.title);
        setLessonType(editingLesson.lessonType);
      } else {
        setTitle("");
        setLessonType("video");
      }
      setVideoUrl("");
      setTextContent("");
    }
  }, [isOpen, editingLesson]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleId || !title) return;

    onSave(moduleId, {
      title,
      lessonType,
      videoUrl: lessonType === 'video' ? videoUrl : undefined,
      textContent: lessonType === 'text' ? textContent : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingLesson ? "Edit Content" : "Add Content"}</DialogTitle>
            <DialogDescription>
              Configure the specific properties for this curriculum material.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to Variables"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Content Type</Label>
              <Select 
                value={lessonType} 
                onValueChange={(val: LessonType) => setLessonType(val)}
                disabled={!!editingLesson} // Usually restrict changing type of existing content
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="text">Rich Text</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Rendering Based on selected Lesson Type */}
            {lessonType === "video" && (
              <div className="grid gap-2 mt-2 p-4 bg-muted/20 border border-border rounded-md">
                <Tabs defaultValue="url" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="url">External URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="url" className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      placeholder="https://youtube.com/..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Provide a link to YouTube, Vimeo, or a direct MP4 file.</p>
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-2">
                    <Label htmlFor="videoUpload">Upload Video (.mp4, .webm)</Label>
                    <Input id="videoUpload" type="file" accept="video/mp4,video/webm" />
                    <p className="text-xs text-muted-foreground">Select a video file directly from your computer.</p>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {(lessonType === "pdf" || lessonType === "audio") && (
              <div className="grid gap-2 mt-2 p-4 bg-muted/20 border border-border rounded-md">
                <Label htmlFor="fileUpload">Upload File ({lessonType.toUpperCase()})</Label>
                <Input id="fileUpload" type="file" />
                <p className="text-xs text-muted-foreground">Select a file from your computer.</p>
              </div>
            )}

            {lessonType === "text" && (
              <div className="grid gap-2 mt-2 p-4 bg-muted/20 border border-border rounded-md">
                <Label htmlFor="textContent">Text Content</Label>
                <textarea 
                  id="textContent"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter lesson text here..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
              </div>
            )}

            {(lessonType === "quiz" || lessonType === "assignment") && (
              <div className="mt-2 p-4 bg-primary/5 text-primary border border-primary/20 rounded-md">
                <p className="text-sm">You are registering a {lessonType}. Once created, click on it to open the dedicated builder interface.</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingLesson ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
