"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  SchoolApplication,
  approveApplication,
  loadApplications,
  planById,
  rejectApplication,
  subdomainHost,
} from "@/lib/school-registration";

export default function RegistrationsQueuePage() {
  const [applications, setApplications] = useState<SchoolApplication[]>([]);
  const [ready, setReady] = useState(false);
  const [reason, setReason] = useState<Record<string, string>>({});

  function refresh() {
    setApplications(loadApplications());
    setReady(true);
  }

  useEffect(() => {
    refresh();
  }, []);

  const counts = useMemo(() => ({
    pending: applications.filter((item) => item.status === "pending").length,
    approved: applications.filter((item) => item.status === "approved").length,
    rejected: applications.filter((item) => item.status === "rejected").length,
  }), [applications]);

  if (!ready) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="School registrations"
        description="Approve a school to activate its subdomain and add it to Tenants. Rejected schools stay on the registration dashboard with your reason."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold">{counts.pending}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted-foreground">Approved</p><p className="text-2xl font-bold">{counts.approved}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted-foreground">Rejected</p><p className="text-2xl font-bold">{counts.rejected}</p></Card>
      </div>
      <div className="space-y-4">
        {applications.map((application) => {
          const plan = planById(application.plan);
          return (
            <Card key={application.id} className="p-5 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{application.school.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {plan.name} · {subdomainHost(application.subdomain)} · {application.subdomainStatus === "active" ? "Active" : "Not active"}
                  </p>
                </div>
                <p className="text-sm capitalize">{application.status} · {format(new Date(application.createdAt), "MMM d, yyyy")}</p>
              </div>
              <p className="text-sm">
                {application.school.city}, {application.school.country} · {application.admin.name} ({application.admin.email})
              </p>
              {application.status === "pending" && (
                <div className="space-y-2">
                  <Textarea
                    value={reason[application.id] ?? ""}
                    onChange={(event) => setReason((current) => ({ ...current, [application.id]: event.target.value }))}
                    placeholder="Reason, required only if you reject"
                    rows={2}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => {
                        approveApplication(application.id);
                        refresh();
                      }}
                    >
                      Approve and activate subdomain
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const text = (reason[application.id] ?? "").trim();
                        if (text.length < 4) return;
                        rejectApplication(application.id, text);
                        refresh();
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              )}
              {application.status === "rejected" && (
                <p className="text-sm text-muted-foreground">{application.rejectionReason}</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
