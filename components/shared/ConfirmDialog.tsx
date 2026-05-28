"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  discardText?: string;
  loadingText?: string;
  isLoading?: boolean;
  showCancel?: boolean;
  showDiscard?: boolean;
  confirmVariant?: "primary" | "secondary" | "ghost" | "destructive";
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onDiscard?: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  discardText = "Discard",
  loadingText = "Loading...",
  isLoading = false,
  showCancel = true,
  showDiscard = false,
  confirmVariant = "primary",
  onOpenChange,
  onConfirm,
  onDiscard,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md border-cyan-400/20 bg-slate-950 p-5 sm:p-6">
        <DialogHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid gap-3 sm:flex sm:justify-end">
          {showCancel && (
            <Button
              type="button"
              variant="ghost"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
              className="h-11 border-white/10 bg-white/5 hover:bg-white/10 sm:min-w-[110px]"
            >
              {cancelText}
            </Button>
          )}

          {showDiscard && (
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              onClick={onDiscard}
              className="h-11 sm:min-w-[140px]"
            >
              {discardText}
            </Button>
          )}

          <Button
            type="button"
            variant={confirmVariant}
            disabled={isLoading}
            onClick={onConfirm}
            className="h-11 sm:min-w-[150px]"
          >
            {isLoading ? loadingText : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}