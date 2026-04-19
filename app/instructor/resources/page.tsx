"use client";

import { useState } from "react";
import { Plus, FolderPlus, Upload, Search, Download, Trash2, File as FileIcon, Image as ImageIcon, Video as VideoIcon, Link as LinkIcon, FileText, FileArchive, Eye, ArrowLeft, Folder, ExternalLink } from "lucide-react";
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
  url?: string; // for preview simulation
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
  { id: "file1", course_id: "course-1", folder_id: "f1", target_level: "course", target_id: "course-1", name: "CS101_Intro.mp4", type: "video", size: "1.5 GB", date: "Feb 15, 2024", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: "file2", course_id: "course-1", folder_id: "f2", target_level: "module", target_id: "module-1", name: "Week1_Slides.pdf", type: "pdf", size: "12 MB", date: "Feb 10, 2024", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { id: "file3", course_id: "course-2", folder_id: "f3", target_level: "lesson", target_id: "lesson-3", name: "MySQL_Dump.zip", type: "zip", size: "45 MB", date: "Jan 12, 2024" },
  { id: "file4", course_id: "course-1", folder_id: null, target_level: "course", target_id: "course-1", name: "Syllabus_Fallback.pdf", type: "pdf", size: "1.2 MB", date: "Jan 5, 2024", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { id: "file5", course_id: "course-2", folder_id: null, target_level: "module", target_id: "module-3", name: "Reference Diagram.png", type: "image", size: "2.4 MB", date: "Jan 2, 2024", url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" },
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
  const [previewFile, setPreviewFile] = useState<LocalFile | null>(null);

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
      <div className="flex items-center gap-4 px-5 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
        <div className={cn("h-10 w-10 flex shrink-0 items-center justify-center rounded-lg border", tc.cls)}>
          {tc.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground line-clamp-1">{file.name}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
            <span className="font-bold tracking-widest uppercase text-[10px] text-muted-foreground">{tc.label}</span>
            <span>&bull;</span>
            <span>{file.size}</span>
            <span>&bull;</span>
            <span className="font-medium text-foreground opacity-80">{getTargetName(file)}</span>
            {file.folder_id && !selectedFolderId && (
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1 font-medium bg-muted px-1.5 py-0.5 rounded text-foreground">
                  <Folder className="h-3 w-3" /> {folders.find(f => f.id === file.folder_id)?.name}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1 shrink-0 justify-end">
          <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30" onClick={() => setPreviewFile(file)}>
            <Eye className="h-4 w-4" /> <span className="hidden sm:inline">View</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => deleteFile(file.id)}>
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
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-[1400px] mx-auto">
         <Breadcrumb 
          showHome={false}
          items={[
            { label: "Resource Library", href: "#", onClick: () => setSelectedFolderId(null) },
            { label: targetFolder.name }
          ]} 
        />
        
        <div>
          <Button variant="ghost" size="sm" onClick={() => setSelectedFolderId(null)} className="gap-2 -ml-2 text-muted-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Files
          </Button>
          <PageHeader
            title={targetFolder.name}
            description="Manage the documents and files localized within this folder."
          >
            <Button className="gap-2" onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="h-4 w-4" />
              Upload Reference
            </Button>
          </PageHeader>
        </div>

        <div className="border bg-card rounded-xl shadow-sm overflow-hidden">
          {folderFiles.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderPlus className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Empty Folder</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1 max-w-sm mx-auto">This folder doesn't have any files. Start uploading references, reading materials, or assets.</p>
              <Button onClick={() => setIsUploadModalOpen(true)} className="mt-6" variant="secondary">Upload File</Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
               {folderFiles.map(file => <InstructorMaterialRow key={file.id} file={file} />)}
            </div>
          )}
        </div>

        <UploadFileModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)}
          activeCourseId={targetFolder.course_id}
          activeFolderId={targetFolder.id}
          folders={folders}
          onCreate={(f) => setFiles(prev => [f, ...prev])}
        />

        {previewFile && (
            <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
        )}
      </div>
    );
  }

  // ── Root View ──
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto pb-12">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Breadcrumb 
            showHome={false}
            items={[
            { label: "Dashboard", href: "/instructor" },
            { label: "Resource Library" }
            ]} 
          />
          <div className="w-full md:w-auto relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Quick search by name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 w-full bg-card shadow-sm border-muted"
            />
          </div>
      </div>

      <div>
        <PageHeader
          title="Resource Library"
          description="A centralized hub to upload, structure, and dispatch curriculum assets to your students."
          action={
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 shadow-sm" onClick={() => setIsFolderModalOpen(true)}>
                <FolderPlus className="h-4 w-4 text-emerald-600" />
                New Folder
              </Button>
              <Button className="gap-2 shadow-sm" onClick={() => setIsUploadModalOpen(true)}>
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
            </div>
          }
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 py-2 border-b">
        <Label className="font-semibold text-muted-foreground whitespace-nowrap">Filter Resources:</Label>
        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
        <SelectTrigger className="w-[300px] bg-card border-muted font-medium">
            <SelectValue placeholder="All Courses Overview" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">All Enlisted Courses</SelectItem>
            {MOCK_INSTRUCTOR_COURSES.map(c => (
            <SelectItem key={c.id} value={c.id}>{c.code} — {c.title}</SelectItem>
            ))}
        </SelectContent>
        </Select>
      </div>

      {/* Folders Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground">Course Folders</h3>
        {activeFolders.length === 0 ? (
          <div className="py-12 rounded-xl text-center border bg-muted/10">
            <Folder className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-base font-semibold text-foreground">No folders structured yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4 hidden sm:block">Keep your modules tightly organized by clustering assets into specific directories.</p>
            <Button variant="outline" size="sm" onClick={() => setIsFolderModalOpen(true)}>Create a New Folder</Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {activeFolders.map((folder) => {
              const fileCount = files.filter(f => f.folder_id === folder.id).length;
              const courseLabel = MOCK_INSTRUCTOR_COURSES.find(c => c.id === folder.course_id)?.code;

              return (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className="rounded-xl border bg-card p-5 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between min-h-[140px]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Folder className="h-6 w-6 fill-current opacity-20 absolute" />
                      <Folder className="h-6 w-6 relative z-10" />
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
                    <h4 className="font-bold text-foreground text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1" title={folder.name}>
                      {folder.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{fileCount} files</span>
                      {courseLabel && selectedCourseId === "all" && (
                         <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 truncate">
                           {courseLabel}
                         </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Files Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-xl font-bold tracking-tight text-foreground">Uncategorized Files</h3>
        
        {activeFiles.length === 0 ? (
          <div className="rounded-xl border py-16 text-center bg-card shadow-sm">
             <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <FileIcon className="h-8 w-8 text-muted-foreground opacity-50" />
             </div>
             <p className="text-base font-semibold text-foreground">Resource library is empty</p>
             <p className="text-sm text-muted-foreground mt-1 mb-4 hidden sm:block">Upload study materials directly to the workspace outside of specific folders.</p>
             <Button variant="secondary" onClick={() => setIsUploadModalOpen(true)}>Upload Your First File</Button>
          </div>
        ) : (
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="divide-y divide-border">
               {activeFiles.map((file) => (
                 <InstructorMaterialRow key={file.id} file={file} />
               ))}
            </div>
          </div>
        )}
      </div>

      <CreateFolderModal 
        isOpen={isFolderModalOpen} 
        onClose={() => setIsFolderModalOpen(false)}
        activeCourseId={selectedCourseId}
        onCreate={(f) => setFolders(prev => [...prev, f])}
      />

      <UploadFileModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        activeCourseId={selectedCourseId}
        activeFolderId="none"
        folders={folders}
        onCreate={(f) => setFiles(prev => [f, ...prev])}
      />

      {previewFile && (
          <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
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
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Organize materials cleanly by keeping them in scoped folders.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label className="font-semibold">Assign to Course Context <span className="text-red-500">*</span></Label>
            <Select value={targetCourse} onValueChange={setTargetCourse}>
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="Select course scope" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_INSTRUCTOR_COURSES.map(c => (
                  <SelectItem key={c.id} value={c.id} className="font-medium">{c.code} — {c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label className="font-semibold">Folder Name <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g. Week 1 Archives"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="bg-muted/50"
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
  const [fileUrl, setFileUrl] = useState("");
  // Lock local states if we arrived via drilldown
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
      date: format(new Date(), "MMM dd, yyyy"),
      url: fileUrl || undefined
    });
    setFileName("");
    setFileUrl("");
    setTargetId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Resource File</DialogTitle>
          <DialogDescription>
            Attach a new document or asset to a course curriculum.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          
          <div className="grid gap-2">
            <Label htmlFor="fileUpload">Select File <span className="text-red-500">*</span></Label>
            <Input
                id="fileUpload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFileName(file.name);
                    // Use a temporary local URL so the browser can preview the uploaded file
                    setFileUrl(URL.createObjectURL(file));
                  }
                }}
                className="bg-muted/50 cursor-pointer file:cursor-pointer file:text-blue-600"
                required
            />
          </div>

          <div className="grid gap-2">
            <Label>Context Course <span className="text-red-500">*</span></Label>
            <Select value={courseId} onValueChange={(val) => {
              setCourseId(val);
              setTargetId("");
            }}>
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="Select course scope" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_INSTRUCTOR_COURSES.map(c => (
                  <SelectItem key={c.id} value={c.id} className="font-medium">{c.code} — {c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {courseId && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="grid gap-2">
                <Label>Directory Target</Label>
                <Select value={folderId} onValueChange={setFolderId} disabled={activeFolderId !== "none"}>
                  <SelectTrigger className="bg-muted/50">
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

              <div className="grid gap-2">
                <Label>Curriculum Target</Label>
                <Select value={targetLevel} onValueChange={(val: TargetLevel) => {
                  setTargetLevel(val);
                  setTargetId("");
                }}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Target Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">General Class Material</SelectItem>
                    <SelectItem value="module">Specific Module</SelectItem>
                    <SelectItem value="lesson">Specific Lesson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {targetLevel === "module" && courseId && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
              <Label>Select Target Module <span className="text-red-500">*</span></Label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger className="bg-muted/50">
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
             <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
              <Label>Select Target Lesson <span className="text-red-500">*</span></Label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger className="bg-muted/50">
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
        <DialogFooter className="border-t pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleUpload} 
            disabled={!fileName.trim() || !courseId || (targetLevel !== "course" && !targetId)}
          >
            Upload File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FilePreviewModal({ 
  file, 
  onClose 
}: { 
  file: LocalFile; 
  onClose: () => void; 
}) {
  const tc = getType(file.type);
  const fallbackUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  const renderViewer = () => {
      if (file.type === "image") {
          return <img src={file.url || "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070"} alt="preview" className="max-w-full max-h-[70vh] object-contain rounded-xl border shadow-sm mx-auto bg-black/5" />
      }
      if (file.type === "video") {
          return <video src={file.url || "https://www.w3schools.com/html/mov_bbb.mp4"} controls className="w-full max-h-[70vh] rounded-xl border shadow-sm bg-black" />
      }
      if (file.type === "pdf" || file.type === "document") {
          return <iframe src={file.url || fallbackUrl} className="w-full h-[70vh] rounded-xl border shadow-sm bg-white" />
      }
      return (
          <div className="py-24 px-12 border border-dashed rounded-xl bg-muted/20 text-center flex flex-col items-center justify-center">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  {tc.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">No Native Preview Available</h3>
              <p className="text-muted-foreground max-w-sm mb-6">This file type ({tc.label}) cannot be embedded directly in the browser preview frame.</p>
              <Button asChild className="gap-2">
                  <a href={file.url || "#"} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /> Open Remotely</a>
              </Button>
          </div>
      )
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-muted/10">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
            <div className="flex items-center gap-3">
                <div className={cn("h-10 w-10 flex items-center justify-center rounded-lg border", tc.cls)}>
                    {tc.icon}
                </div>
                <div>
                    <DialogTitle className="text-lg font-bold">{file.name}</DialogTitle>
                    <DialogDescription className="mt-0.5">{tc.label} &bull; {file.size} &bull; {file.date}</DialogDescription>
                </div>
            </div>
            <div className="flex gap-2 hidden sm:flex">
                <Button variant="outline" size="sm" className="gap-2"><Download className="h-3.5 w-3.5" /> Download Asset</Button>
            </div>
        </div>
        <div className="p-4 md:p-6 bg-muted/10 max-h-[80vh] overflow-y-auto">
            {renderViewer()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
