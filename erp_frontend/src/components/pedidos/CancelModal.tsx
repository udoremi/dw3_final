'use client';

import { useState } from 'react';
import { Ban, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
  pedidoId: string | number;
  isLoading?: boolean;
}

export function CancelModal({
  isOpen,
  onClose,
  onConfirm,
  pedidoId,
  isLoading = false,
}: CancelModalProps) {
  const [motivo, setMotivo] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all p-4">
      <div className="relative w-full max-w-md scale-100 transform rounded-xl border border-border bg-card p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <Ban className="h-5 w-5" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-foreground">Cancelar Pedido #{pedidoId}?</h2>
                <p className="text-xs text-muted-foreground">Essa ação é irreversível.</p>
             </div>
          </div>
          <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
            <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3 flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />
                <p className="text-xs text-yellow-200/80">
                    Ao cancelar, o estoque dos produtos será <strong>estornado automaticamente</strong> e o status mudará para "Cancelado".
                </p>
            </div>

            <div className="space-y-2">
                <Label>Motivo do Cancelamento (Opcional)</Label>
                <Textarea 
                    placeholder="Ex: Cliente desistiu da compra..." 
                    value={motivo} 
                    onChange={(e) => setMotivo(e.target.value)}
                    className="h-24 resize-none"
                />
            </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 pt-6">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto bg-background border-input hover:bg-muted text-foreground"
            >
              Voltar
            </Button>
            
            <Button
              type="button"
              onClick={() => onConfirm(motivo)}
              disabled={isLoading}
              className="w-full sm:w-auto !bg-red-600 text-white hover:!bg-red-700 border-transparent font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : (
                'Confirmar Cancelamento'
              )}
            </Button>
        </div>

      </div>
    </div>
  );
}