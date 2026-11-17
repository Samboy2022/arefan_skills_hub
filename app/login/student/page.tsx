import { RoleLoginForm } from '@/components/shared/role-login-form';

export default function StudentLoginPage() {
  return (
    <RoleLoginForm
      role="Student"
      subtitle="Sign in to continue your courses, assignments, and progress."
      demoEmail="student@arefanskillshub.com"
      demoPassword="student123"
      redirectTo="/student"
      storageKey="studentLoggedIn"
      sliderTitle="Keep learning, one lesson at a time."
      sliderDescription="Pick up where you left off, submit assignments, and track your grades in one place."
    />
  );
}
