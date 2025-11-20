import { Metadata } from 'next';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'Login | Service Desk ITSM',
  description: 'Acesse sua conta para gerenciar tickets e serviços.',
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
       {/* Passamos a lógica visual e funcional para o componente cliente */}
       <LoginForm />
    </div>
  );
}