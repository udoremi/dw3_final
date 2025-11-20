'use client';

import { AlertTriangle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-200">
      <div className="relative w-full max-w-md scale-100 transform rounded-xl border border-border bg-card p-6 shadow-2xl transition-all">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </button>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 items-center text-center sm:text-left sm:items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-danger mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full sm:w-auto !bg-danger text-white hover:!bg-red-700 border-transparent"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Sim, excluir'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}