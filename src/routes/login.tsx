import { createFileRoute } from '@tanstack/react-router';
import { LoginForm } from '../components/auth/LoginForm';
import { AuthLayout } from '../components/auth/AuthLayout';
import { PublicOnlyRoute } from '../components/auth/route-guard';

export const Route = createFileRoute('/login')({
  component: () => (
    <PublicOnlyRoute>
      <AuthLayout 
        title="Welcome back" 
        subtitle="Log in to your Optima account to continue"
        backLink="/"
        backLabel="Back to Home"
      >
        <LoginForm />
      </AuthLayout>
    </PublicOnlyRoute>
  ),
});
