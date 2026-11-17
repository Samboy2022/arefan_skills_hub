import { RoleLoginForm } from '@/components/shared/role-login-form';

export default function InstructorLoginPage() {
  return (
    <RoleLoginForm
      role="Instructor"
      subtitle="Sign in to manage your courses, students, and grading."
      demoEmail="instructor@arefanskillshub.com"
      demoPassword="instructor123"
      redirectTo="/instructor"
      storageKey="instructorLoggedIn"
      sliderTitle="Teach without the busywork."
      sliderDescription="Build curriculum, run live classes, and grade submissions from a single dashboard."
    />
  );
}
