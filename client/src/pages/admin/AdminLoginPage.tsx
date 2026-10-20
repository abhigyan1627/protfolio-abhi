import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Field, TextInput } from '../../components/ui/FormControls';
import { buttonClass, cardClass } from '../../components/ui/styles';
import { FormMessage } from '../../components/admin/AdminPrimitives';
import { useAdminSession } from '../../hooks/AdminSessionProvider';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { ApiRequestError } from '../../lib/api';

const loginSchema = z.object({
  email: z.email({ error: 'Enter the email address for your admin account.' }),
  password: z.string().min(1, 'Enter your password.'),
});

type LoginValues = z.input<typeof loginSchema>;

export function AdminLoginPage() {
  useDocumentMeta({ title: 'Admin sign in | CA Mohit Agrawal', description: 'Administration sign in.', path: '/admin/login', noindex: true });
  const { session, signIn } = useAdminSession();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard';
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  if (session.status === 'authenticated') return <Navigate to={from} replace />;

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await signIn(values.email, values.password);
      navigate(from, { replace: true });
    } catch (error) {
      setServerError(error instanceof ApiRequestError ? error.message : 'Sign-in failed. Please try again.');
    }
  });

  return (
    <div className="flex min-h-dvh items-center justify-center bg-ivory px-5 py-16">
      <div className="w-full max-w-md">
        <p className="text-center font-display text-lg font-bold text-navy">CA Mohit Agrawal</p>
        <p className="mt-1 text-center text-sm text-slate">Administration</p>
        <form noValidate onSubmit={onSubmit} className={`${cardClass} mt-8 space-y-5 sm:p-8`} aria-labelledby="login-heading">
          <h1 id="login-heading" className="font-display text-xl font-bold text-navy">
            Sign in
          </h1>
          {serverError && <FormMessage kind="error">{serverError}</FormMessage>}
          <Field id="admin-email" label="Email" required error={errors.email?.message}>
            <TextInput id="admin-email" type="email" autoComplete="username" invalid={!!errors.email} {...register('email')} />
          </Field>
          <Field id="admin-password" label="Password" required error={errors.password?.message}>
            <TextInput id="admin-password" type="password" autoComplete="current-password" invalid={!!errors.password} {...register('password')} />
          </Field>
          <button type="submit" disabled={isSubmitting} className={buttonClass('primary', 'w-full')}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-xs leading-relaxed text-slate">
            Accounts are created by the site owner. There is no public sign-up.
          </p>
        </form>
      </div>
    </div>
  );
}
