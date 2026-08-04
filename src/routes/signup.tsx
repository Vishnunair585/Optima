import { createFileRoute } from '@tanstack/react-router';
import { SignupForm } from '../components/auth/SignupForm';
import { AuthLayout } from '../components/auth/AuthLayout';
import { PublicOnlyRoute } from '../components/auth/route-guard';

export const Route = createFileRoute('/signup')({
  component: () => (
    <PublicOnlyRoute>
      <AuthLayout 
        title="Create your account" 
        subtitle="Join Optima to get started today"
        backLink="/"
        backLabel="Back to Home"
      >
        <SignupForm />
      </AuthLayout>
    </PublicOnlyRoute>
  ),
});
