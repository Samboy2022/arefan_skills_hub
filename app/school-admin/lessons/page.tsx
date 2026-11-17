import { redirect } from "next/navigation";

export default async function SchoolAdminLessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const { courseId } = await searchParams;
  if (courseId) {
    redirect(`/school-admin/courses/${courseId}/edit`);
  }
  redirect("/school-admin/courses");
}
