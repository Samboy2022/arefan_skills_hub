'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Link as LinkIcon,
  Quote,
  Code,
  Minus,
  Save,
  X,
  Upload,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: number;
  lessonTitle: string;
}

export function NotesModal({ isOpen, onClose, lessonId, lessonTitle }: NotesModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [modalSize, setModalSize] = useState({ width: 800, height: 500 }); // Smaller default size
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load existing notes for this lesson
  const loadNotes = () => {
    if (typeof window === 'undefined') return '<p>Start taking notes for this lesson...</p>';
    const savedNotes = localStorage.getItem(`lesson_notes_${lessonId}`);
    return savedNotes || '<p>Start taking notes for this lesson...</p>';
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
    ],
    content: loadNotes(),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4 border border-border rounded-md bg-background',
      },
    },
    onUpdate: ({ editor }) => {
      // Auto-save on content change (debounced)
      const content = editor.getHTML();
      localStorage.setItem(`lesson_notes_${lessonId}`, content);
    },
  }, [lessonId]); // Add dependency to recreate editor when lesson changes

  // Save notes to localStorage
  const saveNotes = async () => {
    if (!editor) return;
    
    setIsSaving(true);
    const content = editor.getHTML();
    localStorage.setItem(`lesson_notes_${lessonId}`, content);
    setLastSaved(new Date());
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (editor && result) {
        editor.chain().focus().setImage({ src: result }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  // Add image from URL
  const addImageFromUrl = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageDialog(false);
    }
  };

  // Add link
  const addLink = () => {
    if (linkUrl && editor) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
    }
  };

  // Cleanup editor on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Handle resize functionality
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: modalSize.width,
      height: modalSize.height,
    });
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    const newWidth = Math.max(600, Math.min(window.innerWidth - 100, resizeStart.width + deltaX));
    const newHeight = Math.max(400, Math.min(window.innerHeight - 100, resizeStart.height + deltaY));
    
    setModalSize({ width: newWidth, height: newHeight });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  // Add mouse event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = 'nw-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resizeStart]);

  // Toggle maximize/minimize
  const toggleMaximize = () => {
    if (isMaximized) {
      setModalSize({ width: 800, height: 500 }); // Return to smaller default
      setIsMaximized(false);
    } else {
      setModalSize({ 
        width: window.innerWidth - 100, 
        height: window.innerHeight - 100 
      });
      setIsMaximized(true);
    }
  };

  if (!editor) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Loading Notes Editor...</DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Initializing rich text editor...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title,
    disabled = false
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
      }`}
      title={title}
      type="button"
    >
      {children}
    </button>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          ref={modalRef}
          className="flex flex-col p-0 gap-0 overflow-hidden"
          style={{
            width: `${modalSize.width}px`,
            height: `${modalSize.height}px`,
            maxWidth: 'none',
            maxHeight: 'none',
          }}
        >
          <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Notes for: {lessonTitle}</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {lastSaved && (
                    <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                  )}
                  {isSaving && <span>Saving...</span>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMaximize}
                  className="h-8 w-8 p-0"
                  title={isMaximized ? "Restore" : "Maximize"}
                >
                  {isMaximized ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col gap-4 overflow-hidden p-6">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-3 border border-border rounded-md bg-muted/20 flex-wrap shrink-0">
              {/* Text Formatting */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => {
                    editor.chain().focus().toggleBold().run();
                  }}
                  isActive={editor.isActive('bold')}
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </ToolbarButton>
                
                <ToolbarButton
                  onClick={() => {
                    editor.chain().focus().toggleItalic().run();
                  }}
                  isActive={editor.isActive('italic')}
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </ToolbarButton>
                
                <ToolbarButton
                  onClick={() => {
                    editor.chain().focus().toggleUnderline().run();
                  }}
                  isActive={editor.isActive('underline')}
                  title="Underline (Ctrl+U)"
                >
                  <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() => {
                    editor.chain().focus().toggleCode().run();
                  }}
                  isActive={editor.isActive('code')}
                  title="Inline Code"
                >
                  <Code className="w-4 h-4" />
                </ToolbarButton>
              </div>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Headings */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                  }}
                  isActive={editor.isActive('heading', { level: 1 })}
                  title="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                
                <ToolbarButton
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                  }}
                  isActive={editor.isActive('heading', { level: 2 })}
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                
                <ToolbarButton
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 3 }).run();
                  }}
                  isActive={editor.isActive('heading', { level: 3 })}
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </ToolbarButton>
              </div>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Lists */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => {
                    editor.chain().focus().toggleBulletList().run();
                  }}
                  isActive={editor.isActive('bulletList')}
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </ToolbarButton>
                
                <ToolbarButton
                  onClick={() => {
                    editor.chain().focus().toggleOrderedList().run();
                  }}
                  isActive={editor.isActive('orderedList')}
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() => {
                    editor.chain().focus().toggleBlockquote().run();
                  }}
                  isActive={editor.isActive('blockquote')}
                  title="Quote"
                >
                  <Quote className="w-4 h-4" />
                </ToolbarButton>
              </div>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Alignment */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  isActive={editor.isActive({ textAlign: 'left' })}
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </ToolbarButton>
                
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  isActive={editor.isActive({ textAlign: 'center' })}
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </ToolbarButton>
                
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  isActive={editor.isActive({ textAlign: 'right' })}
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </ToolbarButton>
              </div>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Media & Links */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload Image"
                >
                  <Upload className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() => setShowImageDialog(true)}
                  title="Add Image from URL"
                >
                  <ImageIcon className="w-4 h-4" />
                </ToolbarButton>
                
                <ToolbarButton
                  onClick={() => setShowLinkDialog(true)}
                  title="Add Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  title="Horizontal Rule"
                >
                  <Minus className="w-4 h-4" />
                </ToolbarButton>
              </div>

              <div className="flex-1" />

              <Button
                onClick={saveNotes}
                disabled={isSaving}
                size="sm"
                className="ml-2"
              >
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-y-auto">
              <EditorContent 
                editor={editor} 
                className="h-full"
                style={{ minHeight: `${modalSize.height - 300}px` }}
              />
            </div>

            {/* Helper text */}
            <div className="text-xs text-muted-foreground shrink-0">
              Your notes support rich formatting, images, links, and are automatically saved locally for this lesson.
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border shrink-0">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-1" />
              Close
            </Button>
            <Button onClick={saveNotes} disabled={isSaving}>
              <Save className="w-4 h-4 mr-1" />
              {isSaving ? 'Saving...' : 'Save Notes'}
            </Button>
          </DialogFooter>

          {/* Resize Handle */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-muted/50 hover:bg-muted transition-colors"
            onMouseDown={handleResizeStart}
            style={{
              clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
            }}
            title="Drag to resize"
          />
          
          {/* Resize indicator lines */}
          <div className="absolute bottom-1 right-1 pointer-events-none">
            <div className="w-2 h-px bg-border mb-1" />
            <div className="w-px h-2 bg-border ml-1" />
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Image URL Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Image from URL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addImageFromUrl()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addImageFromUrl} disabled={!imageUrl}>
              Add Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <Input
              placeholder="Link text (optional)"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLink()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addLink} disabled={!linkUrl}>
              Add Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}