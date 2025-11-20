'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { LayoutDashboard, ArrowRight, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Login no BGMERP realizado");
      router.push('/dashboard'); 
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const inputClasses = "flex h-11 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all";
  
  const buttonClasses = "inline-flex h-11 w-full items-center justify-center rounded-md bg-white px-8 text-sm font-bold text-slate-950 shadow hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 transition-colors";

  return (
    <div className="w-full max-w-[400px] space-y-8 rounded-xl border border-slate-800 bg-slate-900 p-10 shadow-2xl">
      
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-900/20">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        
        <div className="space-y-1">
            <span className="text-lg font-bold tracking-tight text-foreground">
            BGM<span className="text-primary">ERP</span>
            </span>
          <p className="text-sm text-slate-400">
            Entre com suas credenciais corporativas
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-4">
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="usuario@empresa.com"
              required
              disabled={isLoading}
              className={`${inputClasses} pl-10`}
            />
          </div>

          {/* Input SENHA */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              required
              disabled={isLoading}
              className={`${inputClasses} pl-10 pr-10`}
            />
            
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors outline-none"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
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
              Acessando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Acessar Sistema
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </button>
      </form>
    </div>
  );
}