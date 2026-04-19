/**
 * Immersive Lesson Player Layout
 *
 * This layout deliberately overrides the global student shell (sidebar + navbar)
 * so the lesson player can occupy the full viewport — exactly like Udemy/Coursera.
 * The lesson player has its own dedicated header with navigation controls.
 */
export default function LessonPlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-background">
      {children}
    </div>
  );
}
