'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ThemeToggle } from '@/components/theme-toggle';
import { LoginImageSlider } from '@/components/ui/login-image-slider';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

export interface RoleLoginFormProps {
  /** e.g. "Student" — used in the heading and button labels */
  role: string;
  /** Short line under the heading */
  subtitle: string;
  /** Demo account shown in the "fill demo credentials" box */
  demoEmail: string;
  demoPassword: string;
  /** Where to go after a successful sign in */
  redirectTo: string;
  /** Optional localStorage flag set on success */
  storageKey?: string;
  /** Caption shown over the image slider */
  sliderTitle: string;
  sliderDescription: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RoleLoginForm({
  role,
  subtitle,
  demoEmail,
  demoPassword,
  redirectTo,
  storageKey,
  sliderTitle,
  sliderDescription,
}: RoleLoginFormProps) {
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
    } else if (!EMAIL_PATTERN.test(formData.email)) {
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

  const updateField = (field: 'email' | 'password', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, submit: undefined }));
  };

  const fillDemoCredentials = () => {
    setFormData((prev) => ({ ...prev, email: demoEmail, password: demoPassword }));
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (formData.email.trim().toLowerCase() === demoEmail && formData.password === demoPassword) {
        if (storageKey) localStorage.setItem(storageKey, 'true');
        router.push(redirectTo);
        return; // keep the loading state while navigating
      }

      setErrors({ submit: 'Invalid email or password' });
    } catch {
      setErrors({ submit: 'Login failed. Please try again.' });
    }

    setIsLoading(false);
  };

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center bg-background p-4 text-foreground md:p-8">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_0%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]"
      />

      <main className="w-full max-w-6xl">
        <div className="flex flex-col items-stretch gap-6 lg:min-h-[700px] lg:flex-row">
          {/* Left Column - Form Card */}
          <div className="flex w-full flex-col justify-center rounded-none border border-border/60 bg-card p-6 sm:p-8 md:p-12 lg:w-1/2">
            <div className="mb-10 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Image src="/fnskillslogo11W.png" alt="Fnskills home" width={220} height={100} className="h-10 w-auto dark:hidden" priority />
                <Image src="/fnskillslogo2.png" alt="Fnskills home" width={889} height={304} className="hidden h-10 w-auto dark:block" priority />
              </Link>
              <ThemeToggle />
            </div>

            <div className="mb-8">
              <Link
                href="/login"
                className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary hover:underline"
              >
                {role} login
              </Link>
              <h1 className="text-3xl font-bold tracking-tight text-balance">Welcome back</h1>
              <p className="mt-2 leading-relaxed text-muted-foreground">{subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    disabled={isLoading}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className="peer h-11 bg-background pl-10"
                  />
                  <Mail aria-hidden className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors peer-focus-visible:text-primary peer-aria-invalid:text-destructive dark:peer-aria-invalid:text-red-400" />
                </div>
                {errors.email && <p id="email-error" className="text-sm text-destructive dark:text-red-400">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/help-center" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    disabled={isLoading}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    className="peer h-11 bg-background pr-11 pl-10"
                  />
                  <Lock aria-hidden className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors peer-focus-visible:text-primary peer-aria-invalid:text-destructive dark:peer-aria-invalid:text-red-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isLoading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-none text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p id="password-error" className="text-sm text-destructive dark:text-red-400">{errors.password}</p>}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-me"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: checked === true }))}
                  disabled={isLoading}
                />
                <Label htmlFor="remember-me" className="cursor-pointer font-normal text-muted-foreground">
                  Remember me
                </Label>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <p role="alert" className="rounded-none border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive dark:border-red-400/30 dark:text-red-400">
                  {errors.submit}
                </p>
              )}

              {/* Submit Button */}
              <Button type="submit" size="xl" disabled={isLoading} className="w-full shadow-none">
                {isLoading ? 'Signing in…' : 'Sign In'}
              </Button>

              {/* Demo Credentials */}
              <button
                type="button"
                onClick={fillDemoCredentials}
                disabled={isLoading}
                className="w-full rounded-none border border-dashed border-primary/30 bg-primary/5 p-4 text-left text-sm transition-colors hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50"
              >
                <span className="mb-1 block font-semibold text-foreground">Demo credentials — click to fill</span>
                <span className="block text-muted-foreground">Email: {demoEmail}</span>
                <span className="block text-muted-foreground">Password: {demoPassword}</span>
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Not a {role.toLowerCase()}?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Choose another role
              </Link>
            </p>
          </div>

          {/* Right Column - Image Slider */}
          <div className="hidden lg:block lg:w-1/2">
            <LoginImageSlider title={sliderTitle} description={sliderDescription} />
          </div>
        </div>
      </main>
    </div>
  );
}
