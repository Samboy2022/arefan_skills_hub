"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Module } from "./CurriculumBuilder";

interface ModuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
  editingModule?: Module | null;
}

export function ModuleFormModal({ isOpen, onClose, onSave, editingModule }: ModuleFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(editingModule?.title ?? "");
      setDescription(editingModule?.description ?? "");
    }
  }, [isOpen, editingModule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim() });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-2">
            <DialogTitle>{editingModule ? "Edit Section" : "Add New Section"}</DialogTitle>
            <DialogDescription>
              {editingModule
                ? "Update the name and description for this curriculum section."
                : "Sections group related lessons together. Keep them focused."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="moduleTitle">
                Section Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="moduleTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Week 1: Getting Started"
                required
                autoFocus
                maxLength={120}
              />
              <p className="text-xs text-muted-foreground text-right">{title.length}/120</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="moduleDesc">
                Description{" "}
                <span className="text-muted-foreground text-xs font-normal">(optional)</span>
              </Label>
              <Textarea
                id="moduleDesc"
                placeholder="Briefly describe what students will cover in this section."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={500}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {editingModule ? "Save Changes" : "Create Section"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
