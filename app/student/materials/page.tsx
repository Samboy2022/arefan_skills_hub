import { Download, FileText, File, Zap, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_MATERIALS } from "@/lib/student-mock-data";

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-6 w-6 text-red-500" />;
    case "video":
      return <Zap className="h-6 w-6 text-purple-500" />;
    case "zip":
      return <File className="h-6 w-6 text-gray-500" />;
    default:
      return <File className="h-6 w-6 text-blue-500" />;
  }
};

const getFileTypeLabel = (type: string) => {
  const labels = {
    pdf: "PDF Document",
    video: "Video",
    document: "Document",
    link: "Link",
    zip: "Archive",
  };
  return labels[type as keyof typeof labels] || type;
};

export default function MaterialsPage() {
  const materialsByType = {
    pdf: STUDENT_MATERIALS.filter(m => m.type === "pdf"),
    video: STUDENT_MATERIALS.filter(m => m.type === "video"),
    zip: STUDENT_MATERIALS.filter(m => m.type === "zip"),
  };

  return (
    <div>
      <PageHeader
        title="Course Materials"
        description="Download and access course resources"
      />

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Materials</p>
          <p className="text-2xl font-bold">{STUDENT_MATERIALS.length}</p>
        </Card>
        <Card className="p-4 text-center border-red-200 bg-red-50">
          <p className="text-sm text-red-700">PDFs</p>
          <p className="text-2xl font-bold text-red-700">{materialsByType.pdf.length}</p>
        </Card>
        <Card className="p-4 text-center border-purple-200 bg-purple-50">
          <p className="text-sm text-purple-700">Archives</p>
          <p className="text-2xl font-bold text-purple-700">{materialsByType.zip.length}</p>
        </Card>
      </div>

      {/* PDF Documents */}
      {materialsByType.pdf.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-500" />
            PDF Documents ({materialsByType.pdf.length})
          </h3>
          <div className="space-y-2">
            {materialsByType.pdf.map(material => (
              <Card key={material.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-0.5">
                      {getFileIcon(material.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{material.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {material.size} • Uploaded by {material.uploaded_by}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Downloaded {material.download_count} times
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Archives */}
      {materialsByType.zip.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <File className="h-5 w-5 text-gray-500" />
            Archives ({materialsByType.zip.length})
          </h3>
          <div className="space-y-2">
            {materialsByType.zip.map(material => (
              <Card key={material.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-0.5">
                      {getFileIcon(material.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{material.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {material.size} • Uploaded by {material.uploaded_by}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Downloaded {material.download_count} times
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
