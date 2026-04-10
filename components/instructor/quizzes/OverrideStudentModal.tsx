"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";

interface OverrideStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizTitle: string;
}

const MOCK_STUDENTS = [
  { id: "stu_1", name: "Alice Johnson" },
  { id: "stu_2", name: "Bob Smith" },
  { id: "stu_3", name: "Charlie Davis" },
  { id: "stu_4", name: "Diana Prince" },
  { id: "stu_5", name: "Edward Elric" },
  { id: "stu_6", name: "Fiona Gallagher" },
];

export function OverrideStudentModal({ isOpen, onClose, quizTitle }: OverrideStudentModalProps) {
  const [studentId, setStudentId] = useState("");
  const [openCombobox, setOpenCombobox] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [isTimed, setIsTimed] = useState(false);
  const [timeLimit, setTimeLimit] = useState<number>(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;
    
    // In a real framework, we'd fire off an API passing the 1 attempt hardcode.
    console.log("Extending student parameters:", {
      studentId,
      hasDeadline,
      startDate: hasDeadline ? startDate : null,
      endDate: hasDeadline ? endDate : null,
      isTimed,
      timeLimit: isTimed ? timeLimit : null,
      attemptsAllowed: 1 // hardcoded provision requested by user
    });

    alert("Exceptions explicitly granted. The user has been provided 1 additional attempt with these parameters.");
    onClose();
  };

  const selectedStudentName = MOCK_STUDENTS.find(s => s.id === studentId)?.name;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Override Student Settings</DialogTitle>
            <DialogDescription>
              Grant an exception for a specific student on <b>{quizTitle}</b>. This automatically provisions exactly <b>1 attempt</b>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label>Pick Student <span className="text-destructive">*</span></Label>
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="w-full justify-between"
                  >
                    {selectedStudentName ? selectedStudentName : "Search and select a student..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[450px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search students..." />
                    <CommandList>
                      <CommandEmpty>No student found.</CommandEmpty>
                      <CommandGroup>
                        {MOCK_STUDENTS.map((student) => (
                          <CommandItem
                            key={student.id}
                            value={student.name} // use name for searching
                            onSelect={() => {
                              setStudentId(student.id);
                              setOpenCombobox(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                studentId === student.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {student.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-4">
              {/* Deadline Toggler */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Override Deadline</Label>
                  <p className="text-xs text-muted-foreground">Set custom date range for this student.</p>
                </div>
                <Switch checked={hasDeadline} onCheckedChange={setHasDeadline} />
              </div>
              
              {hasDeadline && (
                <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20 transition-all">
                  <div className="grid gap-2">
                    <Label htmlFor="overrideStart">Start Date</Label>
                    <Input id="overrideStart" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="overrideEnd">End Date</Label>
                    <Input id="overrideEnd" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              )}

              <hr className="border-border" />

              {/* Timed Toggler */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Override Time Limit</Label>
                  <p className="text-xs text-muted-foreground">Adjust minutes allowed for their attempt.</p>
                </div>
                <Switch checked={isTimed} onCheckedChange={setIsTimed} />
              </div>
              
              {isTimed && (
                <div className="grid gap-2 pl-4 border-l-2 border-primary/20 transition-all">
                  <Label htmlFor="overrideTimeLimit">Time Limit (Minutes)</Label>
                  <Input id="overrideTimeLimit" type="number" min={1} value={timeLimit.toString()} onChange={(e) => setTimeLimit(Number(e.target.value))} />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!studentId}>
              Extend
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
