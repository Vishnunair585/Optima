import { createFileRoute } from '@tanstack/react-router';
import { RegisterForm } from '../../components/auth/RegisterForm';

export const Route = createFileRoute('/auth/register')({
  component: () => (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  ),
});
