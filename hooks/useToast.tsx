type ToastOptions = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

function toast({ title, description }: ToastOptions) {
  alert(`${title}${description ? `\n${description}` : ""}`);
}

function useToast() {
  return { toast };
}

export { useToast, toast };