"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Check,
  FileAudio,
  FileText,
  ImagePlus,
  Plus,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Kbd } from "@/components/ui/kbd";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  COVER_TONES,
  CoverToneId,
  LIBRARY_COLLECTIONS,
  LIBRARY_LANGUAGES,
  LIBRARY_SUBJECTS,
  LibraryChapter,
  LibraryCollection,
  LibraryFormat,
  LibraryItem,
  LibraryUploader,
  addLibraryItem,
  collectionLabel,
  compressCover,
  formatFileSize,
  isTimedFormat,
  loadCollections,
  orderedCollections,
  setSliderMembership,
  updateLibraryItem,
} from "@/lib/library";
import { BookCover } from "@/components/library/book-cover";
import { MAX_LIBRARY_FILE_BYTES, mimeForFile, saveLibraryFile } from "@/lib/library-files";

export interface CourseOption {
  id: string;
  code: string;
  title: string;
}

const FORMAT_OPTIONS: { value: LibraryFormat; label: string; hint: string; icon: typeof BookOpen; accept: string }[] = [
  { value: "pdf", label: "PDF", hint: "A PDF book, paper, or handout", icon: FileText, accept: ".pdf" },
  { value: "file", label: "File", hint: "Notes, slides, or another document", icon: BookOpen, accept: ".pdf,.docx,.pptx,.epub,.txt,.zip" },
  { value: "video", label: "Video", hint: "A recorded lecture or film", icon: Video, accept: ".mp4,.mov,.webm" },
  { value: "audio", label: "Audio", hint: "A lecture, podcast, or reading", icon: FileAudio, accept: ".mp3,.m4a,.wav,.aac" },
];

type Errors = Partial<Record<"title" | "author" | "course" | "file" | "preview", string>>;

export function LibraryEditor({
  item,
  uploader,
  courses,
  requireCourse,
  backHref,
}: {
  item?: LibraryItem;
  uploader: LibraryUploader;
  courses: CourseOption[];
  requireCourse: boolean;
  backHref: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [format, setFormat] = useState<LibraryFormat>(item?.format ?? "pdf");
  const [title, setTitle] = useState(item?.title ?? "");
  const [author, setAuthor] = useState(item?.author ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [subject, setSubject] = useState(item?.subject ?? LIBRARY_SUBJECTS[0]);
  const [language, setLanguage] = useState(item?.language ?? "English");
  const [year, setYear] = useState(String(item?.year ?? new Date().getFullYear()));
  const [pages, setPages] = useState(item?.pages ? String(item.pages) : "");
  const [duration, setDuration] = useState(item?.duration ? String(item.duration) : "");
  const [publisher, setPublisher] = useState(item?.publisher ?? "");
  const [isbn, setIsbn] = useState(item?.isbn ?? "");
  const [tags, setTags] = useState<string[]>(item?.tags ?? []);
  const [tagDraft, setTagDraft] = useState("");
  const [collectionId, setCollectionId] = useState(
    item?.collectionId ?? (requireCourse ? "col-reserves" : LIBRARY_COLLECTIONS[0].id),
  );
  const [courseId, setCourseId] = useState(item?.courseId ?? (requireCourse ? courses[0]?.id ?? "" : ""));
  const [featured, setFeatured] = useState(Boolean(item?.featured));
  const [fileName, setFileName] = useState(item?.fileName ?? "");
  const [fileSize, setFileSize] = useState<number | undefined>(item?.fileSize);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<string | undefined>(item?.coverImage);
  const [coverTone, setCoverTone] = useState<CoverToneId>(item?.coverTone ?? "forest");
  const [coverMode, setCoverMode] = useState<"default" | "custom">(item?.coverImage ? "custom" : "default");
  const [chapters, setChapters] = useState<LibraryChapter[]>(item?.chapters ?? []);
  const [previewText, setPreviewText] = useState(item?.previewText ?? "");
  const [collections, setCollections] = useState<LibraryCollection[]>(LIBRARY_COLLECTIONS);
  const [attempted, setAttempted] = useState(false);
  const [dragging, setDragging] = useState<"file" | "cover" | null>(null);

  // Once someone tries to publish, errors update live as they fix each field.
  const errors: Errors = attempted ? validate() : {};
  const visibleFormats = FORMAT_OPTIONS.some((option) => option.value === format)
    ? FORMAT_OPTIONS
    : [...FORMAT_OPTIONS, { value: format, label: format, hint: "Current type", icon: FileText, accept: ".pdf,.docx,.mp4,.mp3" }];
  const formatOption = visibleFormats.find((option) => option.value === format) ?? FORMAT_OPTIONS[0];
  const isTimed = isTimedFormat(format);

  useEffect(() => {
    setCollections(loadCollections());
  }, []);

  // ⌘S / Ctrl+S saves from anywhere in the form.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function takeFile(file?: File | null) {
    if (!file) return;
    if (file.size > MAX_LIBRARY_FILE_BYTES) {
      toast.error("That file is too large", { description: "Keep library files under 40 MB so they can be opened in the browser." });
      return;
    }
    const mime = mimeForFile(file);
    const nextFormat = formatFromMime(mime, file.name);
    if (!nextFormat) {
      toast.error("Choose a PDF, audio, video, or document", { description: "PDF, MP3, MP4, Word, PowerPoint, EPUB, text, and zip files are accepted." });
      return;
    }
    setPendingFile(file);
    setFileName(file.name);
    setFileSize(file.size);
    setFormat(nextFormat);
    if (!title.trim()) {
      const guess = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
      setTitle(guess.charAt(0).toUpperCase() + guess.slice(1));
    }
  }

  async function takeCover(file?: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file for the cover", { description: "PNG, JPG, or WebP all work." });
      return;
    }
    try {
      setCoverImage(await compressCover(file));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not use that image");
    }
  }

  function addTag(raw: string) {
    const value = raw.trim().replace(/^#/, "").toLowerCase();
    if (!value || tags.includes(value) || tags.length >= 8) return;
    setTags([...tags, value]);
    setTagDraft("");
  }

  function validate(): Errors {
    const next: Errors = {};
    if (title.trim().length < 2) next.title = "Give the material a title.";
    if (author.trim().length < 2) next.author = "Add the author or the lecturer's name.";
    if (requireCourse && !courseId) next.course = "Choose one of your courses.";
    if (!fileName.trim() || (!item?.hasFile && !pendingFile)) next.file = "Attach the file students will open.";
    if (previewText.trim().length < 40) next.preview = "Write at least a few sentences students can preview (40 characters).";
    return next;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const found = validate();
    setAttempted(true);
    if (Object.keys(found).length > 0) {
      toast.error("A few fields need attention", { description: Object.values(found)[0] });
      const first = formRef.current?.querySelector("[aria-invalid='true']") as HTMLElement | null;
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const course = courses.find((entry) => entry.id === courseId);
    const file = pendingFile;
    const payload = {
      title: title.trim(),
      author: author.trim(),
      description: description.trim() || title.trim(),
      format,
      subject,
      language,
      collectionId: requireCourse ? "col-reserves" : course ? "col-reserves" : collectionId,
      courseId: course?.id,
      courseCode: course?.code,
      courseTitle: course?.title,
      uploadedBy: item?.uploadedBy ?? uploader,
      fileName: fileName.trim(),
      fileSize: file ? file.size : fileSize,
      fileMime: file ? mimeForFile(file) : item?.fileMime,
      hasFile: file ? item?.hasFile : item?.hasFile,
      year: Number(year) || new Date().getFullYear(),
      pages: !isTimed && pages ? Number(pages) : undefined,
      duration: isTimed && duration ? Number(duration) : undefined,
      publisher: publisher.trim() || undefined,
      isbn: isbn.trim() || undefined,
      tags,
      coverImage: coverMode === "custom" ? coverImage : undefined,
      coverTone,
      chapters: isTimed ? [] : chapters.filter((chapter) => chapter.title.trim()),
      featured: requireCourse ? item?.featured : featured,
      previewText: previewText.trim(),
      rating: item?.rating,
      ratingCount: item?.ratingCount,
    };
    let saved = item ? updateLibraryItem(item.id, payload) : addLibraryItem(payload);
    if (saved && file) {
      try {
        await saveLibraryFile(saved.id, file);
        saved = updateLibraryItem(saved.id, { hasFile: true, fileMime: mimeForFile(file), fileName: file.name, fileSize: file.size });
      } catch {
        toast.error("The file could not be stored", { description: "The details were saved. Attach the file again from the edit page." });
        return;
      }
    }
    if (saved && !requireCourse) setSliderMembership(saved.id, featured);
    toast.success(item ? "Changes saved" : "Added to the library", { description: payload.title });
    router.push(saved ? `${backHref}/${saved.id}` : backHref);
  }

  const preview = {
    id: item?.id ?? "draft",
    title: title || "Untitled material",
    author: author || "Author name",
    format,
    subject,
    coverImage: coverMode === "custom" ? coverImage : undefined,
    coverTone,
    duration: duration ? Number(duration) : undefined,
  };

  const checklist = [
    { label: "Title and author", done: title.trim().length > 1 && author.trim().length > 1 },
    { label: "File attached", done: Boolean(fileName) },
    { label: "Cover chosen", done: coverMode === "custom" ? Boolean(coverImage) : Boolean(coverTone) },
    { label: "Description", done: description.trim().length > 20 },
    { label: "Preview text", done: previewText.trim().length >= 40 },
    ...(isTimed ? [] : [{ label: "Table of contents", done: chapters.some((chapter) => chapter.title.trim()) }]),
  ];
  const doneCount = checklist.filter((entry) => entry.done).length;

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-6">
        {/* 1. Type */}
        <Section step={1} title="What are you adding?" hint="This sets the cover badge and which details students see.">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {visibleFormats.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormat(option.value)}
                className={cn(
                  "relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
                  format === option.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/40 hover:bg-muted/40",
                )}
              >
                <span
                  className={cn(
                    "rounded-lg p-2",
                    format === option.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  <option.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-foreground">{option.label}</span>
                <span className="text-xs leading-snug text-muted-foreground">{option.hint}</span>
                {format === option.value && <Check className="absolute right-3 top-3 h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </Section>

        {/* 2. File */}
        <Section step={2} title="Upload the file" hint={`Accepted: ${formatOption.accept.replaceAll(",", ", ")}`}>
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragging("file");
            }}
            onDragLeave={() => setDragging(null)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(null);
              takeFile(event.dataTransfer.files?.[0]);
            }}
            aria-invalid={Boolean(errors.file)}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
              dragging === "file" ? "border-primary bg-primary/5" : errors.file ? "border-red-400 bg-red-50/50 dark:bg-red-950/20" : "border-border hover:border-primary/50 hover:bg-muted/30",
            )}
          >
            <input
              type="file"
              accept={formatOption.accept}
              className="sr-only"
              onChange={(event) => takeFile(event.target.files?.[0])}
            />
            {fileName ? (
              <>
                <span className="rounded-full bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Check className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-foreground">{fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(fileSize)} · {pendingFile || item?.hasFile ? "Readers can open and download this file" : "Click or drop to attach the file"} · Click or drop to replace
                </p>
              </>
            ) : (
              <>
                <span className="rounded-full bg-primary/10 p-3 text-primary">
                  <UploadCloud className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-foreground">Drag a file here, or click to browse</p>
                <p className="text-xs text-muted-foreground">PDF, audio, video, or a document up to 40 MB. Readers can open and download it.</p>
              </>
            )}
          </label>
          {errors.file && <FieldError>{errors.file}</FieldError>}
        </Section>

        {/* 3. Details */}
        <Section step={3} title="Details" hint="What students search by and see on the book page.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" error={errors.title} className="sm:col-span-2">
              <Input value={title} onChange={(event) => setTitle(event.target.value)} aria-invalid={Boolean(errors.title)} placeholder="Introduction to Algorithms" />
            </Field>
            <Field label="Author" error={errors.author}>
              <Input value={author} onChange={(event) => setAuthor(event.target.value)} aria-invalid={Boolean(errors.author)} placeholder="Dr. Jane Smith" />
            </Field>
            <Field label="Publisher" optional>
              <Input value={publisher} onChange={(event) => setPublisher(event.target.value)} placeholder="Fnskills Press" />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                placeholder="One or two sentences on what the material covers and who it is for."
              />
            </Field>
            <Field label="Subject">
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LIBRARY_SUBJECTS.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Language">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LIBRARY_LANGUAGES.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Year published">
              <Input inputMode="numeric" value={year} onChange={(event) => setYear(event.target.value.replace(/\D/g, "").slice(0, 4))} />
            </Field>
            {isTimed ? (
              <Field label="Length (minutes)" optional>
                <Input inputMode="numeric" value={duration} onChange={(event) => setDuration(event.target.value.replace(/\D/g, ""))} placeholder="45" />
              </Field>
            ) : (
              <Field label="Pages" optional>
                <Input inputMode="numeric" value={pages} onChange={(event) => setPages(event.target.value.replace(/\D/g, ""))} placeholder="240" />
              </Field>
            )}
            {format === "book" && (
              <Field label="ISBN" optional>
                <Input value={isbn} onChange={(event) => setIsbn(event.target.value)} placeholder="978-0-00-000000-0" />
              </Field>
            )}
            <Field label="Tags" optional className={format === "book" ? "" : "sm:col-span-2"}>
              <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring/50">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs font-medium">
                    #{tag}
                    <button type="button" onClick={() => setTags(tags.filter((entry) => entry !== tag))} aria-label={`Remove ${tag}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  value={tagDraft}
                  onChange={(event) => setTagDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                      event.preventDefault();
                      addTag(tagDraft);
                    } else if (event.key === "Backspace" && !tagDraft && tags.length) {
                      setTags(tags.slice(0, -1));
                    }
                  }}
                  onBlur={() => addTag(tagDraft)}
                  placeholder={tags.length ? "" : "Type and press Enter"}
                  className="min-w-[120px] flex-1 bg-transparent px-1 text-sm outline-none"
                />
              </div>
            </Field>
          </div>
        </Section>

        {/* 4. Placement */}
        <Section
          step={4}
          title="Where it appears"
          hint={requireCourse ? "Course books show on that course's shelf for enrolled students." : "School-wide by default, or reserve it for one course."}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={requireCourse ? "Course" : "Course reserve"} optional={!requireCourse} error={errors.course}>
              <Select value={courseId || "none"} onValueChange={(value) => setCourseId(value === "none" ? "" : value)}>
                <SelectTrigger className="w-full" aria-invalid={Boolean(errors.course)}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {!requireCourse && <SelectItem value="none">School-wide, no course</SelectItem>}
                  {courses.map((entry) => (
                    <SelectItem key={entry.id} value={entry.id}>
                      {entry.code} — {entry.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {!requireCourse && (
              <Field label="Collection">
                <Select value={courseId ? "col-reserves" : collectionId} onValueChange={setCollectionId} disabled={Boolean(courseId)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {orderedCollections(collections).map((entry) => (
                      <SelectItem key={entry.id} value={entry.id}>{collectionLabel(entry, collections)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
            {!requireCourse && (
              <label className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 sm:col-span-2">
                <span>
                  <span className="block text-sm font-medium">Show in the home slider</span>
                  <span className="block text-xs text-muted-foreground">Appears in the slider at the top of the public and student library.</span>
                </span>
                <Switch checked={featured} onCheckedChange={setFeatured} />
              </label>
            )}
          </div>
        </Section>

        {/* 5. Cover */}
        <Section step={5} title="Cover" hint="Use a default colour cover, or upload your own so this title stands apart.">
          <div className="mb-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setCoverMode("default");
                setCoverImage(undefined);
              }}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm",
                coverMode === "default" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
              )}
            >
              <span className="block font-semibold">Default cover</span>
              <span className="text-xs text-muted-foreground">A colour cover set from the title</span>
            </button>
            <button
              type="button"
              onClick={() => setCoverMode("custom")}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm",
                coverMode === "custom" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
              )}
            >
              <span className="block font-semibold">Custom cover</span>
              <span className="text-xs text-muted-foreground">Your own image</span>
            </button>
          </div>
          {coverMode === "default" ? (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {COVER_TONES.map((tone) => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => setCoverTone(tone.id)}
                  aria-label={tone.label}
                  title={tone.label}
                  className={cn(
                    "relative aspect-[2/3] rounded-[2px_4px_4px_2px] shadow-sm transition-transform hover:-translate-y-0.5",
                    tone.face,
                    coverTone === tone.id && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                  )}
                >
                  {coverTone === tone.id && <Check className={cn("absolute inset-0 m-auto h-4 w-4", tone.ink)} />}
                </button>
              ))}
            </div>
          ) : (
            <label
              onDragOver={(event) => {
                event.preventDefault();
                setDragging("cover");
              }}
              onDragLeave={() => setDragging(null)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(null);
                void takeCover(event.dataTransfer.files?.[0]);
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
                dragging === "cover" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30",
              )}
            >
              <input type="file" accept="image/*" className="sr-only" onChange={(event) => void takeCover(event.target.files?.[0])} />
              <ImagePlus className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-semibold">{coverImage ? "Replace cover image" : "Upload cover image"}</p>
              <p className="text-xs text-muted-foreground">Portrait works best, about 2:3</p>
            </label>
          )}
        </Section>

        {/* 6. Contents */}
        {!isTimed && (
          <Section step={6} title="Table of contents" hint="Optional. Students see this on the Contents tab." optional>
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-6 shrink-0 text-center text-xs font-bold text-muted-foreground">{index + 1}</span>
                  <Input
                    value={chapter.title}
                    onChange={(event) =>
                      setChapters(chapters.map((entry, position) => (position === index ? { ...entry, title: event.target.value } : entry)))
                    }
                    placeholder="Chapter title"
                  />
                  <Input
                    inputMode="numeric"
                    value={chapter.page ?? ""}
                    onChange={(event) => {
                      const value = event.target.value.replace(/\D/g, "");
                      setChapters(chapters.map((entry, position) => (position === index ? { ...entry, page: value ? Number(value) : undefined } : entry)));
                    }}
                    placeholder="Page"
                    className="w-24 shrink-0"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setChapters(chapters.filter((_, position) => position !== index))}
                    aria-label={`Remove chapter ${index + 1}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setChapters([...chapters, { title: "" }])}>
                <Plus className="mr-1.5 h-4 w-4" /> Add chapter
              </Button>
            </div>
          </Section>
        )}

        {/* 7. Preview */}
        <Section step={isTimed ? 6 : 7} title={format === "audio" ? "What you will hear" : format === "video" ? "What the video covers" : "Sample pages"} hint="Readers see this on the public library page.">
          <Field label={isTimed ? "Summary" : "Preview text"} error={errors.preview}>
            <Textarea
              value={previewText}
              onChange={(event) => setPreviewText(event.target.value)}
              rows={7}
              aria-invalid={Boolean(errors.preview)}
              placeholder="Paste the opening pages or a short summary. Leave a blank line between paragraphs."
              className="font-serif leading-7"
            />
          </Field>
          <p className="mt-1.5 text-right text-xs text-muted-foreground">{previewText.trim().length} characters</p>
        </Section>
      </div>

      {/* ── Live preview ─────────────────────────────────────────────────── */}
      <aside className="space-y-4 lg:sticky lg:top-6">
        <div className="rounded-2xl border border-border bg-gradient-to-b from-muted/60 to-card p-6">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Live preview</p>
          <div className="mx-auto w-40">
            <BookCover item={preview} size="md" />
          </div>
          <div className="mt-4 text-center">
            <p className="line-clamp-2 font-semibold text-foreground">{preview.title}</p>
            <p className="text-sm text-muted-foreground">{preview.author}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {subject}
              {courseId ? ` · ${courses.find((entry) => entry.id === courseId)?.code}` : " · School-wide"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">Ready to publish</p>
            <span className="text-xs font-medium text-muted-foreground">{doneCount}/{checklist.length}</span>
          </div>
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
          </div>
          <ul className="space-y-2 text-sm">
            {checklist.map((entry) => (
              <li key={entry.label} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full",
                    entry.done ? "bg-emerald-500 text-white" : "border border-border",
                  )}
                >
                  {entry.done && <Check className="h-3 w-3" />}
                </span>
                <span className={entry.done ? "text-foreground" : "text-muted-foreground"}>{entry.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 grid gap-2">
            <Button type="submit" size="lg">
              {item ? "Save changes" : "Publish to library"}
              <Kbd className="ml-2 bg-primary-foreground/20 text-primary-foreground">⌘S</Kbd>
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push(item ? `${backHref}/${item.id}` : backHref)}>
              Cancel
            </Button>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Section({
  step,
  title,
  hint,
  optional,
  children,
}: {
  step: number;
  title: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {step}
        </span>
        <div>
          <h2 className="font-semibold text-foreground">
            {title}
            {optional && <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>}
          </h2>
          {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  optional,
  error,
  className,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="flex items-center gap-2">
        {label}
        {optional && <span className="text-xs font-normal text-muted-foreground">Optional</span>}
      </Label>
      {children}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

function formatFromMime(mime: string, name: string): LibraryFormat | null {
  const fileName = name.toLowerCase();
  if (mime === "application/pdf" || fileName.endsWith(".pdf")) return "pdf";
  if (mime.startsWith("video/") || /\.(mp4|mov|webm)$/.test(fileName)) return "video";
  if (mime.startsWith("audio/") || /\.(mp3|m4a|wav|aac)$/.test(fileName)) return "audio";
  if (/\.(docx|pptx|epub|txt|csv|md|zip)$/.test(fileName)) return "file";
  return null;
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{children}</p>;
}
