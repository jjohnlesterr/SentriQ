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
      <DialogContent className="max-w-md border-cyan-400/20 bg-slate-950">
        <DialogHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {showCancel && (
            <Button
              type="button"
              variant="ghost"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
              className="border-white/10 bg-white/5 hover:bg-white/10"
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
            >
              {discardText}
            </Button>
          )}

          <Button
            type="button"
            variant={confirmVariant}
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? loadingText : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
