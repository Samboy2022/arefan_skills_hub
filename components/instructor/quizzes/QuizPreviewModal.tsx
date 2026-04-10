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
  // In a real application, we would pass the actual quiz object and render its complex properties.
  // For the mock, we simulate a standard layout.
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Preview: {quizTitle}</DialogTitle>
          <DialogDescription>
            Overview of the assessment requirements and configurations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Metrics</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Grade Value: 10.00 pts
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" /> Time Limit: 30 mins
                </li>
                <li className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-500" /> Questions: 10
                </li>
              </ul>
            </div>

            <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Policies</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span>Randomize</span>
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">Yes</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Max Attempts</span>
                  <Badge variant="secondary">1 Attempt</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Notify via Email</span>
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">Yes</Badge>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-background border border-border rounded-lg space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Timeline Status
            </h4>
            <div className="flex flex-col space-y-1">
              <span className="text-sm">Starts: <b>Immediate</b></span>
              <span className="text-sm">Ends: <b>No Deadline Set</b></span>
            </div>
            <div className="mt-2 pt-2 border-t border-border">
              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Active / Published</Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
