import { redirect } from "next/navigation";

export default async function SchoolAdminCourseViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/school-admin/courses/${id}/edit`);
}
