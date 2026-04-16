'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LoginImageSlider } from '@/components/ui/login-image-slider';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}



export default function SchoolAdminLoginPage() {
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
      
      if (formData.email === 'admin@school.com' && formData.password === 'admin123') {
        localStorage.setItem('schoolAdminLoggedIn', 'true');
        router.push('/school-admin');
      } else {
        setErrors({ password: 'Invalid email or password' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6 lg:h-[700px] items-stretch">
          
          {/* Left Column - Form Card */}
          <div className="w-full lg:w-1/2 flex-1 relative">
            <Card className="p-8 md:p-12 bg-card border-border shadow-sm w-full h-full flex flex-col justify-center">
              
              {/* Logo & Title Inside Card */}
              <div className="space-y-3 mb-10 text-center md:text-left flex flex-col items-center md:items-start">
                <img src="/fnskillslogo11W.png" alt="FN Skills Logo" className="h-12 w-auto dark:hidden" />
                <img src="/fnskillslogo2.png" alt="FN Skills Logo" className="h-12 w-auto hidden dark:block" />
                <p className="text-muted-foreground font-medium">School Administration Portal</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">School Admin Login</h2>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@school.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setErrors({ ...errors, email: '' });
                      }}
                      disabled={isLoading}
                      className="pl-10 h-11 bg-background border-input text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
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
                      className="pl-10 pr-10 h-11 bg-background border-input text-foreground placeholder:text-muted-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      disabled={isLoading}
                      className="w-4 h-4 rounded border-input bg-background"
                    />
                    <span className="text-sm text-muted-foreground">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                {/* Demo Credentials */}
                <div 
                  onClick={() => setFormData({ ...formData, email: 'admin@school.com', password: 'admin123' })}
                  className="bg-muted/50 border border-border rounded-lg p-3 mt-6 text-xs text-muted-foreground cursor-pointer hover:bg-muted transition-colors"
                >
                  <p className="font-semibold text-foreground mb-1">Demo Credentials (Click to fill):</p>
                  <p>Email: admin@school.com</p>
                  <p>Password: admin123</p>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column - Image Slider */}
          <div className="hidden lg:block lg:w-1/2 flex-1 h-full min-h-[500px]">
             <LoginImageSlider />
          </div>
        </div>
      </div>
    </div>
  );
}
