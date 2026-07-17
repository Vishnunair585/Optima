import { createFileRoute } from '@tanstack/react-router';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';

export const Route = createFileRoute('/auth/forgot-password')({
  component: () => (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  ),
});
