"use client";

import { useState } from "react";
import { Plus, FolderPlus, Upload, Search, Download, Share2, Trash2, File as FileIcon, Image as ImageIcon, Music, Video as VideoIcon, HardDrive, Link as LinkIcon, FileText, FileArchive, Eye, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MOCK_INSTRUCTOR_COURSES, MOCK_MODULES, MOCK_LESSONS } from "@/lib/instructor-mock-data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// ── Types ────────────────────────────────────────────────────────────────
type LocalFolder = {
  id: string;
  course_id: string;
  name: string;
  created_at: string;
};

type TargetLevel = "course" | "module" | "lesson";

type LocalFile = {
  id: string;
  course_id: string;
  folder_id: string | null;
  target_level: TargetLevel;
  target_id: string;
  name: string;
  type: "pdf" | "zip" | "document" | "image" | "link" | "video";
  size: string;
  date: string;
};

// ── Dummy Pre-Seed ───────────────────────────────────────────────────────
const SIZES = ["1.2 MB", "4.5 MB", "12 MB", "550 KB", "1.5 GB", "340 MB"];
const getRandomSize = () => SIZES[Math.floor(Math.random() * SIZES.length)];

const INITIAL_FOLDERS: LocalFolder[] = [
  { id: "f1", course_id: "course-1", name: "Lecture Videos", created_at: new Date().toISOString() },
  { id: "f2", course_id: "course-1", name: "Slides & Assets", created_at: new Date().toISOString() },
  { id: "f3", course_id: "course-2", name: "Database Dumps", created_at: new Date().toISOString() },
];

const INITIAL_FILES: LocalFile[] = [
  { id: "file1", course_id: "course-1", folder_id: "f1", target_level: "course", target_id: "course-1", name: "CS101_Intro.mp4", type: "video", size: "1.5 GB", date: "Feb 15, 2024" },
  { id: "file2", course_id: "course-1", folder_id: "f2", target_level: "module", target_id: "module-1", name: "Week1_Slides.pdf", type: "pdf", size: "12 MB", date: "Feb 10, 2024" },
  { id: "file3", course_id: "course-2", folder_id: "f3", target_level: "lesson", target_id: "lesson-3", name: "MySQL_Dump.zip", type: "zip", size: "45 MB", date: "Jan 12, 2024" },
  { id: "file4", course_id: "course-1", folder_id: null, target_level: "course", target_id: "course-1", name: "Syllabus_Fallback.pdf", type: "pdf", size: "1.2 MB", date: "Jan 5, 2024" },
];

// ── UI Config ────────────────────────────────────────────────────────────
const typeConfig: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  pdf:      { label: "PDF",      icon: <FileText className="h-5 w-5" />,    cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  zip:      { label: "ZIP",      icon: <FileArchive className="h-5 w-5" />, cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  document: { label: "DOC",      icon: <FileIcon className="h-5 w-5" />,    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  image:    { label: "IMG",      icon: <ImageIcon className="h-5 w-5" />,   cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  link:     { label: "LINK",     icon: <LinkIcon className="h-5 w-5" />,    cls: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  video:    { label: "VIDEO",    icon: <VideoIcon className="h-5 w-5" />,   cls: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
};

const getType = (t: string) => typeConfig[t] ?? typeConfig.document;

function getTargetName(file: LocalFile): string {
  if (file.target_level === "course") {
    return MOCK_INSTRUCTOR_COURSES.find(c => c.id === file.target_id)?.code || "Unknown Course";
  }
  if (file.target_level === "module") {
    return MOCK_MODULES.find(m => m.id === file.target_id)?.title || "Unknown Module";
  }
  if (file.target_level === "lesson") {
    return MOCK_LESSONS.find(l => l.id === file.target_id)?.title || "Unknown Lesson";
  }
  return "Unknown";
}

// ── Components ───────────────────────────────────────────────────────────

export default function ResourcesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State DB
  const [folders, setFolders] = useState<LocalFolder[]>(INITIAL_FOLDERS);
  const [files, setFiles] = useState<LocalFile[]>(INITIAL_FILES);

  // Modals
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Filter Variables
  const activeFolders = selectedCourseId === "all" 
    ? folders 
    : folders.filter(f => f.course_id === selectedCourseId);
    
  let activeFiles = selectedCourseId === "all" 
    ? files 
    : files.filter(f => f.course_id === selectedCourseId);

  // Apply search
  if (searchQuery.trim()) {
    activeFiles = activeFiles.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  const deleteFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFolders(prev => prev.filter(f => f.id !== folderId));
    setFiles(prev => prev.filter(f => f.folder_id !== folderId));
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
  };

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // ── Render Helpers ──
  const InstructorMaterialRow = ({ file }: { file: LocalFile }) => {
    const tc = getType(file.type);
    
    return (
      <div className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", tc.cls)}>
          {tc.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground line-clamp-1">{file.name}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
            <span className="font-medium uppercase text-[10px] px-1.5 py-0.5 rounded border border-border bg-muted/30">{tc.label}</span>
            <span>{file.size}</span>
            <span>·</span>
            <span className="flex items-center gap-1 font-medium italic text-foreground"><LinkIcon className="h-3 w-3" />{getTargetName(file)}</span>
            <span>·</span>
            <span>Added {file.date}</span>
            {file.folder_id && !selectedFolderId && (
              <>
                <span>·</span>
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 px-1 py-0.5">Dir: {folders.find(f => f.id === file.folder_id)?.name}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground h-8 text-xs">
            <Eye className="h-3.5 w-3.5" /> View
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs hidden md:flex">
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
          <Button variant="ghost" size="sm" onClick={() => deleteFile(file.id)} className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 transition-colors">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // ── Drilldown View ──
  if (selectedFolderId) {
    const targetFolder = folders.find(f => f.id === selectedFolderId)!;
    const folderFiles = files.filter(f => f.folder_id === selectedFolderId);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
         <Breadcrumb 
          showHome={false}
          items={[
            { label: "File Management", href: "#", onClick: () => setSelectedFolderId(null) },
            { label: targetFolder.name }
          ]} 
        />
        
        <div>
          <Button variant="ghost" size="sm" onClick={() => setSelectedFolderId(null)} className="gap-2 -ml-1 text-muted-foreground mb-1">
            <ArrowLeft className="h-4 w-4" /> Back to Files Hub
          </Button>
          <PageHeader
            title={targetFolder.name}
            description={`Viewing explicit payload contents of this directory.`}
          >
            <Button className="gap-2 shrink-0" onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="h-4 w-4" />
              Upload into Flow
            </Button>
          </PageHeader>
        </div>

        <Card className="border-border overflow-hidden">
          <div className="px-5 py-3 bg-muted/30 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Directory Documents</p>
          </div>
          {folderFiles.length === 0 ? (
            <div className="px-5 py-12 text-center bg-muted/5">
              <FolderPlus className="h-8 w-8 opacity-20 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">This directory is isolated and empty.</p>
            </div>
          ) : (
            <div className="divide-y divide-border bg-card">
               {folderFiles.map(file => <InstructorMaterialRow key={file.id} file={file} />)}
            </div>
          )}
        </Card>

        {/* Share Modal Subcomponents when drilled down */}
        <UploadFileModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)}
          activeCourseId={targetFolder.course_id}
          activeFolderId={targetFolder.id}
          folders={folders}
          onCreate={(f) => setFiles(prev => [f, ...prev])}
        />
      </div>
    );
  }

  // ── Root View ──
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "File Management" }
        ]} 
      />
      <div>
        <PageHeader
          title="Resources & File Explorer"
          description="Organize rigid payload structures, define specific module dependencies, and upload heavy assets to student curriculums."
        >
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" className="gap-2" onClick={() => setIsFolderModalOpen(true)}>
              <FolderPlus className="h-4 w-4" />
              New Folder
            </Button>
            <Button className="gap-2" onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </div>
        </PageHeader>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="w-full md:w-72">
          <Label className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-1 block">Active Workspace</Label>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Courses Overview" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🌐 All Courses Overview</SelectItem>
              {MOCK_INSTRUCTOR_COURSES.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.code} — {c.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-96 relative">
          <Label className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-1 block">Local Filter</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search explicitly by filename..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 w-full bg-background"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Active Directories</h3>
        </div>
        
        {activeFolders.length === 0 ? (
          <div className="py-12 border border-dashed rounded-lg text-center bg-muted/10">
            <FolderPlus className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">No folders instantiated</p>
            <p className="text-xs text-muted-foreground">Isolate curriculums by creating a new directory mapped to this workspace.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {activeFolders.map((folder) => {
              const fileCount = files.filter(f => f.folder_id === folder.id).length;
              const courseLabel = MOCK_INSTRUCTOR_COURSES.find(c => c.id === folder.course_id)?.code;

              return (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className="rounded-lg border border-border bg-card p-5 hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer group shadow-sm flex flex-col justify-between h-32"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
                      <FolderPlus className="h-5 w-5 text-blue-700 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                       onClick={(e) => deleteFolder(folder.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={folder.name}>
                      {folder.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[11px] font-semibold text-muted-foreground">{fileCount} objects</p>
                      {courseLabel && selectedCourseId === "all" && (
                         <p className="text-[9px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 px-1 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                           {courseLabel}
                         </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Loose Payload Registry</h3>
        </div>
        
        {activeFiles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-16 text-center bg-muted/10">
             <Upload className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
             <p className="text-sm font-medium text-foreground">File Registry is empty</p>
             <p className="text-xs text-muted-foreground mt-1 mb-4">You have not injected any binaries or assets here yet.</p>
             <Button variant="outline" size="sm" onClick={() => setIsUploadModalOpen(true)}>Upload First Payload</Button>
          </div>
        ) : (
          <Card className="border-border bg-card shadow-sm overflow-hidden">
            <div className="divide-y divide-border">
               {activeFiles.map((file) => (
                 <InstructorMaterialRow key={file.id} file={file} />
               ))}
            </div>
          </Card>
        )}
      </div>

      {/* ── Folder Creation Modal ── */}
      <CreateFolderModal 
        isOpen={isFolderModalOpen} 
        onClose={() => setIsFolderModalOpen(false)}
        activeCourseId={selectedCourseId}
        onCreate={(f) => setFolders(prev => [...prev, f])}
      />

      {/* ── File Upload Modal ── */}
      <UploadFileModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        activeCourseId={selectedCourseId}
        activeFolderId="none"
        folders={folders}
        onCreate={(f) => setFiles(prev => [f, ...prev])}
      />
    </div>
  );
}

// ── Modals Subcomponents ──────────────────────────────────────────────────

function CreateFolderModal({ 
  isOpen, 
  onClose, 
  activeCourseId, 
  onCreate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  activeCourseId: string;
  onCreate: (f: LocalFolder) => void;
}) {
  const [folderName, setFolderName] = useState("");
  const [targetCourse, setTargetCourse] = useState(activeCourseId === "all" ? "" : activeCourseId);

  const handleCreate = () => {
    if (!folderName.trim() || !targetCourse) return;
    onCreate({
      id: `f_${Date.now()}`,
      course_id: targetCourse,
      name: folderName,
      created_at: new Date().toISOString()
    });
    setFolderName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Instantiate Directory</DialogTitle>
          <DialogDescription>
            Create an architecture bounds for storing curriculums offline payloads.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="targetCourse">Bind to Course Hierarchy *</Label>
            <Select value={targetCourse} onValueChange={setTargetCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select course scope" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_INSTRUCTOR_COURSES.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="folderName">Directory String *</Label>
            <Input
              id="folderName"
              placeholder="e.g. Week 1 Archives"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!folderName.trim() || !targetCourse}>Create Directory</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UploadFileModal({ 
  isOpen, 
  onClose, 
  activeCourseId,
  activeFolderId,
  folders, 
  onCreate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  activeCourseId: string;
  activeFolderId: string;
  folders: LocalFolder[];
  onCreate: (f: LocalFile) => void;
}) {
  const [fileName, setFileName] = useState("");
  // If we are drilled down into a folder, lock the initial states tightly.
  const [courseId, setCourseId] = useState(activeCourseId === "all" ? "" : activeCourseId);
  const [folderId, setFolderId] = useState<string>(activeFolderId);
  const [targetLevel, setTargetLevel] = useState<TargetLevel>("course");
  const [targetId, setTargetId] = useState<string>("");

  const validModules = MOCK_MODULES; 
  const validLessons = MOCK_LESSONS.filter(l => l.courseId === courseId);
  const validFolders = folders.filter(f => f.course_id === courseId);

  const getFileType = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === "pdf") return "pdf";
    if (ext === "zip") return "zip";
    if (['mp4', 'mov', 'avi'].includes(ext || '')) return "video";
    if (['png', 'jpg', 'jpeg'].includes(ext || '')) return "image";
    return "document";
  }

  const handleUpload = () => {
    if (!fileName.trim() || !courseId || !targetLevel) return;
    if (targetLevel === "module" && !targetId) return;
    if (targetLevel === "lesson" && !targetId) return;

    onCreate({
      id: `file_${Date.now()}`,
      course_id: courseId,
      folder_id: folderId === "none" ? null : folderId,
      target_level: targetLevel,
      target_id: targetLevel === "course" ? courseId : targetId,
      name: fileName,
      type: getFileType(fileName) as LocalFile["type"],
      size: getRandomSize(),
      date: format(new Date(), "MMM dd, yyyy")
    });
    setFileName("");
    setTargetId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Pipeline Payload</DialogTitle>
          <DialogDescription>
            Inject a file dependency into the routing hierarchy.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          
          <div className="grid gap-2 border-b pb-4">
            <Label>Mock File Selection *</Label>
            <div className="flex gap-2 items-center">
               <Input
                  placeholder="Simulate a filename (e.g. report.pdf)"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full"
                />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Root Course *</Label>
            <Select value={courseId} onValueChange={(val) => {
              setCourseId(val);
              setTargetId("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select course scope" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_INSTRUCTOR_COURSES.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {courseId && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
              <div className="grid gap-2">
                <Label>Directory Folder (Optional)</Label>
                <Select value={folderId} onValueChange={setFolderId}>
                  <SelectTrigger disabled={activeFolderId !== "none"}>
                    <SelectValue placeholder="No Folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Root Access --</SelectItem>
                    {validFolders.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2 border-l pl-4">
                <Label>Bind Target Hierarchy *</Label>
                <Select value={targetLevel} onValueChange={(val: TargetLevel) => {
                  setTargetLevel(val);
                  setTargetId("");
                }}>
                  <SelectTrigger className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
                    <SelectValue placeholder="Target Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Entire Class</SelectItem>
                    <SelectItem value="module">Specific Module</SelectItem>
                    <SelectItem value="lesson">Specific Lesson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {targetLevel === "module" && courseId && (
            <div className="grid gap-2 animate-in slide-in-from-right-4 bg-muted/30 p-3 rounded-lg border">
              <Label className="text-blue-600 dark:text-blue-400">Select Specific Module Payload *</Label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Module dependency" />
                </SelectTrigger>
                <SelectContent>
                  {validModules.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {targetLevel === "lesson" && courseId && (
             <div className="grid gap-2 animate-in slide-in-from-right-4 bg-muted/30 p-3 rounded-lg border">
              <Label className="text-blue-600 dark:text-blue-400">Select Specific Lesson Payload *</Label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Lesson dependency" />
                </SelectTrigger>
                <SelectContent>
                  {validLessons.map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Abort</Button>
          <Button 
            onClick={handleUpload} 
            disabled={!fileName.trim() || !courseId || (targetLevel !== "course" && !targetId)}
          >
            Inject Payload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
