"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle2, HelpCircle } from "lucide-react";

interface QuizPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizTitle: string;
}

export function QuizPreviewModal({ isOpen, onClose, quizTitle }: QuizPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Preview: {quizTitle}</DialogTitle>
          <DialogDescription>
            Overview of the assessment requirements and configurations.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-6 pt-2">
          {/* Metrics Row */}
          <div>
            <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-3">Metrics</h4>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Grade Value: <span className="font-medium">10.00 pts</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Clock className="w-4 h-4 text-emerald-500" /> Time Limit: <span className="font-medium">30 mins</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <HelpCircle className="w-4 h-4 text-purple-500" /> Questions: <span className="font-medium">10</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border w-full" />

          {/* Policies Row */}
          <div>
            <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-3">Policies</h4>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Randomize</span>
                <span className="font-medium text-foreground">Yes</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Max Attempts</span>
                <span className="font-medium text-foreground">1 Attempt</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Notify via Email</span>
                <span className="font-medium text-foreground">Yes</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border w-full" />

          {/* Timeline Row */}
          <div>
            <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              Timeline Status
            </h4>
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="w-4 h-4 text-muted-foreground" /> Starts: <span className="font-medium">Immediate</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="w-4 h-4 text-muted-foreground" /> Ends: <span className="font-medium">No Deadline Set</span>
              </div>
              <div className="mt-2">
                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-semibold shadow-none border-0">Active / Published</Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
