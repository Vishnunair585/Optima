import { createFileRoute } from '@tanstack/react-router';
import { LoginForm } from '../../components/auth/LoginForm';

export const Route = createFileRoute('/auth/login')({
  component: () => (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <LoginForm />
    </div>
  ),
});
