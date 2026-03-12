'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Zap, Award, BookOpen, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const FEATURES = [
  {
    icon: <BookOpen className="w-5 h-5 text-purple-400" />,
    title: 'Interactive Learning',
    description: 'Access courses, lessons, and learning materials anytime',
  },
  {
    icon: <Zap className="w-5 h-5 text-indigo-400" />,
    title: 'Assignments & Quizzes',
    description: 'Complete assignments and test your knowledge with quizzes',
  },
  {
    icon: <Award className="w-5 h-5 text-purple-500" />,
    title: 'Track Grades',
    description: 'Monitor your progress and view detailed grade reports',
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-violet-400" />,
    title: 'Performance Insights',
    description: 'Get detailed analytics on your academic performance',
  },
];

export default function StudentLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (formData.email === 'student@fnskills.com' && formData.password === 'student123') {
        localStorage.setItem('studentLoggedIn', 'true');
        router.push('/student');
      } else {
        setErrors({ password: 'Invalid email or password' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Login Form */}
          <div className="space-y-8">
            {/* Logo & Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">FN Skills</h1>
              </div>
              <p className="text-slate-400">Student Learning Platform</p>
            </div>

            {/* Form Card */}
            <Card className="p-8 bg-slate-800/50 border-slate-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">Student Login</h2>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200 text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@fnskills.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setErrors({ ...errors, email: '' });
                      }}
                      disabled={isLoading}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200 text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setErrors({ ...errors, password: '' });
                      }}
                      disabled={isLoading}
                      className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      disabled={isLoading}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700"
                    />
                    <span className="text-sm text-slate-300">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                {/* Demo Credentials */}
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-xs text-slate-300">
                  <p className="font-semibold text-slate-200 mb-2">Demo Credentials:</p>
                  <p>Email: student@fnskills.com</p>
                  <p>Password: student123</p>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column - Features (Hidden on Mobile) */}
          <div className="hidden lg:block space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Your Learning Journey</h2>
              <p className="text-slate-400">Achieve your academic goals with us</p>
            </div>

            <div className="space-y-4">
              {FEATURES.map((feature, index) => (
                <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
