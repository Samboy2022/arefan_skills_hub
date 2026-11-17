import { RoleLoginForm } from '@/components/shared/role-login-form';

export default function SchoolAdminLoginPage() {
  return (
    <RoleLoginForm
      role="School Admin"
      subtitle="Sign in to run your school's operations and academics."
      demoEmail="admin@school.com"
      demoPassword="admin123"
      redirectTo="/school-admin"
      storageKey="schoolAdminLoggedIn"
      sliderTitle="Your institution, fully in view."
      sliderDescription="Manage instructors, enrolments, and reporting across your whole school."
    />
  );
}
