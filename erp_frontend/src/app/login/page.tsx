'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Store, ArrowRight, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Simulação de API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Login no BGMERP realizado");
      router.push('/dashboard'); 
    } catch (error) {
      console.error('Erro ao autenticar:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Classes reutilizáveis para manter consistência
  const inputWrapperClasses = "relative group";
  const iconClasses = "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-500";
  
  const inputClasses = `
    flex h-11 w-full rounded-lg border border-slate-800 bg-slate-950 
    pl-10 pr-4 py-2 text-sm text-slate-100 
    placeholder:text-slate-600 
    outline-none transition-all duration-200
    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
    disabled:cursor-not-allowed disabled:opacity-50
  `;

  const buttonClasses = `
    inline-flex h-11 w-full items-center justify-center rounded-lg 
    bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm
    shadow-lg shadow-blue-900/20
    transition-all duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
    disabled:pointer-events-none disabled:opacity-50 disabled:bg-slate-800
  `;

  return (
    <div className="w-full max-w-[400px] space-y-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
      
      {/* Cabeçalho / Logo */}
      <div className="flex flex-col items-center text-center space-y-2 mb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20">
             <Store className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-100">
            BGM<span className="text-blue-500">ERP</span>
          </span>
        </div>
        <p className="text-sm text-slate-400 max-w-[250px]">
           Entre com suas credenciais para acessar o painel administrativo.
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={onSubmit} className="space-y-4">
        
        {/* Input EMAIL */}
        <div className={inputWrapperClasses}>
          <Mail className={iconClasses} />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="usuario@empresa.com"
            required
            disabled={isLoading}
            className={inputClasses}
            autoComplete="email"
          />
        </div>

        {/* Input SENHA */}
        <div className={inputWrapperClasses}>
          <Lock className={iconClasses} />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Sua senha segura"
            required
            disabled={isLoading}
            className={`${inputClasses} pr-10`} // Padding extra na direita para o ícone do olho
            autoComplete="current-password"
          />
          
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
            disabled={isLoading}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Links Auxiliares (Opcional) */}
        <div className="flex items-center justify-end">
          <a href="#" className="text-xs font-medium text-slate-400 hover:text-blue-400 transition-colors">
            Esqueceu a senha?
          </a>
        </div>

        {/* Botão de Ação */}
        <button 
          type="submit" 
          className={buttonClasses}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Validando acesso...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Acessar Sistema
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </button>
      </form>

      {/* Rodapé do Card */}
      <div className="text-center">
        <p className="text-xs text-slate-500">
          Protegido por BGM Security © 2025
        </p>
      </div>
    </div>
  );
}