'use client';

import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  children: React.ReactNode;
}

export function FilterModal({
  isOpen,
  onClose,
  onApply,
  onClear,
  children,
}: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Filter className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Filtros Avançados</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6">
            {children}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border p-6 bg-muted/10">
          <Button
            type="button"
            onClick={onClear}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            Limpar Filtros
          </Button>
          <Button
            type="button"
            onClick={onApply}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Aplicar Filtros
          </Button>
        </div>

      </div>
    </div>
  );
}