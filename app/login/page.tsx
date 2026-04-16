'use client';

import { useRouter } from 'next/navigation';
import { ShieldAlert, Building2, Users2, BookOpen, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ROLES = [
  {
    id: 'super-admin',
    label: 'Super Admin',
    description: 'Manage platform, schools, and system settings',
    icon: ShieldAlert,
    color: 'bg-primary text-primary-foreground',
    path: '/login/super-admin',
  },
  {
    id: 'school-admin',
    label: 'School Admin',
    description: 'Manage school operations and academic functions',
    icon: Building2,
    color: 'bg-primary text-primary-foreground',
    path: '/login/school-admin',
  },
  {
    id: 'instructor',
    label: 'Instructor',
    description: 'Create courses, assignments, and manage students',
    icon: Users2,
    color: 'bg-primary text-primary-foreground',
    path: '/login/instructor',
  },
  {
    id: 'student',
    label: 'Student',
    description: 'Access courses, submit assignments, and track grades',
    icon: BookOpen,
    color: 'bg-primary text-primary-foreground',
    path: '/login/student',
  },
];

export default function LoginPage() {
  const router = useRouter();

  const handleRoleSelect = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center gap-3 mb-6">
            <img src="/fnskillslogo11W.png" alt="FN Skills Logo" className="h-16 w-auto dark:hidden" />
            <img src="/fnskillslogo2.png" alt="FN Skills Logo" className="h-16 w-auto hidden dark:block" />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-3">Choose Your Role</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select your role to access the appropriate portal for managing your educational journey
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className="bg-card border-border hover:border-primary transition-all duration-300 overflow-hidden cursor-pointer group"
                onClick={() => handleRoleSelect(role.path)}
              >
                {/* Header pattern */}
                <div className={`h-24 ${role.color} relative overflow-hidden opacity-20`}>
                </div>

                {/* Content */}
                <div className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 -mt-14 bg-card border-4 border-background rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">{role.label}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{role.description}</p>

                  <Button
                    className={`w-full ${role.color} hover:opacity-90 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 group-hover:gap-3 transition-all`}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">
            Need help? <a href="#" className="text-primary hover:underline">Contact support</a> or <a href="#" className="text-primary hover:underline">view documentation</a>
          </p>
        </div>
      </div>
    </div>
  );
}
