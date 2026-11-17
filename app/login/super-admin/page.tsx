import { RoleLoginForm } from '@/components/shared/role-login-form';

export default function SuperAdminLoginPage() {
  return (
    <RoleLoginForm
      role="Super Admin"
      subtitle="Sign in to manage the platform, schools, and system settings."
      demoEmail="admin@arefanskillshub.com"
      demoPassword="admin123"
      redirectTo="/super-admin"
      sliderTitle="Every tenant, one control centre."
      sliderDescription="Provision schools, manage users, and keep the platform healthy."
    />
  );
}
