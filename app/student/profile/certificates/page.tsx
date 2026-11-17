"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { Award, BadgeCheck, Eye, Hourglass, Lock } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { pageStackClass, statGridClass } from "@/lib/student-ui";
import { StudentKPICard } from "@/components/student/kpi-card";
import { STUDENT_COURSES } from "@/lib/student-mock-data";

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  credentialId: string;
};

/* Mock earned certificates until a certificates API exists. */
const EARNED: Certificate[] = [
  { id: "c1", title: "Python Programming Essentials", issuer: "Dr. Sarah Johnson", issued: "2024-06-12", credentialId: "FNS-PY-2024-0412" },
  { id: "c2", title: "Academic Writing Foundations", issuer: "Dr. Emma Wilson", issued: "2024-04-28", credentialId: "FNS-AW-2024-0188" },
];

function CertificateArt({ cert }: { cert: Certificate }) {
  return (
    <div className="relative overflow-hidden rounded-xl border-4 border-double border-amber-500/40 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6 text-center dark:from-amber-950/30 dark:via-card dark:to-emerald-950/30">
      <Award className="mx-auto h-10 w-10 text-amber-500" />
      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Certificate of Completion</p>
      <p className="mt-3 text-xs text-muted-foreground">This certifies that</p>
      <p className="font-serif text-xl font-bold">John Doe</p>
      <p className="mt-1 text-xs text-muted-foreground">has successfully completed</p>
      <p className="mt-1 text-sm font-semibold text-primary">{cert.title}</p>
      <div className="mt-4 flex items-end justify-between text-[10px] text-muted-foreground">
        <span>{format(new Date(cert.issued), "MMM d, yyyy")}</span>
        <span className="font-mono">{cert.credentialId}</span>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  const [preview, setPreview] = useState<Certificate | null>(null);
  const inProgress = STUDENT_COURSES.filter(c => c.status === "active");

  return (
    <div className={pageStackClass}>
      <Breadcrumb items={[{ label: "Profile", href: "/student/profile" }, { label: "Certificates" }]} />

      <div className={statGridClass}>
        <StudentKPICard title="Earned" value={EARNED.length} hint="Certificates issued" icon={BadgeCheck} variant="success" />
        <StudentKPICard title="In Progress" value={inProgress.length} hint="Finish a course to earn one" icon={Hourglass} variant="warning" />
      </div>

      <section>
        <h2 className="mb-3 text-base font-semibold">Earned Certificates</h2>
        {EARNED.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No certificates yet. Complete a course to earn your first one.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {EARNED.map(cert => (
              <article key={cert.id} className="flex flex-col rounded-2xl border border-border bg-card p-3 shadow-sm">
                <CertificateArt cert={cert} />
                <div className="mt-3 flex items-center justify-between gap-2 px-1">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{cert.title}</p>
                    <p className="truncate text-xs text-muted-foreground">Issued by {cert.issuer}</p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPreview(cert)} aria-label={`View ${cert.title}`}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold">In Progress</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {inProgress.map(course => (
            <Link
              key={course.id}
              prefetch={false}
              href={`/student/courses/${course.id}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{course.name}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Progress value={course.progress} className="h-1.5 flex-1" />
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">{course.progress}%</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{100 - course.progress}% left to unlock</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Dialog open={!!preview} onOpenChange={open => !open && setPreview(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{preview?.title}</DialogTitle>
            <DialogDescription>Credential ID {preview?.credentialId}</DialogDescription>
          </DialogHeader>
          {preview && <CertificateArt cert={preview} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
