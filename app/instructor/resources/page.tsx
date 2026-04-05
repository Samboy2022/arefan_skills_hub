import { Plus, FolderPlus, Upload, Search, Download, Share2, Trash2, File, Image, Music, Video as VideoIcon } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function ResourcesPage() {
  const folders = [
    { name: "Lecture Videos", count: 12, size: "2.4 GB" },
    { name: "Slides & Presentations", count: 8, size: "156 MB" },
    { name: "Reading Materials", count: 24, size: "512 MB" },
    { name: "Student Resources", count: 15, size: "89 MB" },
  ];

  const files = [
    { name: "Introduction_Lecture.mp4", type: "video", size: "345 MB", date: "Feb 15, 2024" },
    { name: "Week1_Slides.pdf", type: "document", size: "12 MB", date: "Feb 10, 2024" },
    { name: "Chapter1_Notes.pdf", type: "document", size: "2.3 MB", date: "Feb 8, 2024" },
    { name: "Assignment_Template.docx", type: "document", size: "1.2 MB", date: "Feb 5, 2024" },
    { name: "Course_Banner.png", type: "image", size: "856 KB", date: "Jan 30, 2024" },
  ];

  const getFileIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      video: <VideoIcon className="h-5 w-5 text-red-500" />,
      document: <File className="h-5 w-5 text-blue-500" />,
      image: <Image className="h-5 w-5 text-green-500" />,
      audio: <Music className="h-5 w-5 text-purple-500" />,
    };
    return icons[type] || <File className="h-5 w-5" />;
  };

  return (
    <div className="space-y-4">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Resources & File Library" }
        ]} 
      />
      <div className="pt-2">
        <PageHeader
          title="Resources & File Library"
          description="Organize and manage course materials and files"
        >
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <FolderPlus className="h-4 w-4" />
              New Folder
            </Button>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </div>
        </PageHeader>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search files and folders..."
          className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-full"
        />
      </div>

      {/* Folder Grid */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Folders</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {folders.map((folder) => (
            <div
              key={folder.name}
              className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <FolderPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h4 className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{folder.name}</h4>
              <p className="text-xs text-muted-foreground mt-2">{folder.count} files</p>
              <p className="text-xs text-muted-foreground">{folder.size} total</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Files */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Files</h3>
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {files.map((file) => (
              <div
                key={file.name}
                className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                  </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 dark:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-12 text-center cursor-pointer hover:bg-muted transition-colors">
        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-lg font-semibold text-foreground mb-1">Drop files here to upload</p>
        <p className="text-sm text-muted-foreground mb-4">or click to select files</p>
        <p className="text-xs text-muted-foreground">Max file size: 2GB</p>
      </div>
    </div>
  );
}
