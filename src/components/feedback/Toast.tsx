interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

const toastStyles: Record<string, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-rose-600 text-white',
  info: 'bg-slate-800 text-white'
};

export function Toast({ message, type = 'info' }: ToastProps) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-2xl px-4 py-3 text-sm shadow-soft ${toastStyles[type]}`}>
      {message}
    </div>
  );
}
