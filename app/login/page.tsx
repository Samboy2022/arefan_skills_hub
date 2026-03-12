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
    color: 'from-blue-600 to-cyan-600',
    path: '/login/super-admin',
  },
  {
    id: 'school-admin',
    label: 'School Admin',
    description: 'Manage school operations and academic functions',
    icon: Building2,
    color: 'from-emerald-500 to-teal-500',
    path: '/login/school-admin',
  },
  {
    id: 'instructor',
    label: 'Instructor',
    description: 'Create courses, assignments, and manage students',
    icon: Users2,
    color: 'from-amber-500 to-orange-500',
    path: '/login/instructor',
  },
  {
    id: 'student',
    label: 'Student',
    description: 'Access courses, submit assignments, and track grades',
    icon: BookOpen,
    color: 'from-purple-500 to-indigo-500',
    path: '/login/student',
  },
];

export default function LoginPage() {
  const router = useRouter();

  const handleRoleSelect = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">FN Skills</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">Choose Your Role</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
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
                className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 overflow-hidden cursor-pointer group"
                onClick={() => handleRoleSelect(role.path)}
              >
                {/* Gradient Header */}
                <div className={`h-24 bg-gradient-to-br ${role.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 -mt-14 bg-slate-800/80 border-4 border-slate-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{role.label}</h3>
                  <p className="text-sm text-slate-400 mb-6">{role.description}</p>

                  <Button
                    className={`w-full bg-gradient-to-r ${role.color} hover:opacity-90 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 group-hover:gap-3 transition-all`}
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
          <p className="text-slate-400 text-sm">
            Need help? <a href="#" className="text-blue-400 hover:text-blue-300">Contact support</a> or <a href="#" className="text-blue-400 hover:text-blue-300">view documentation</a>
          </p>
        </div>
      </div>
    </div>
  );
}
