"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type ToastItem = { id: number; message: string; leaving: boolean };

const ToastContext = createContext<(message: string) => void>(() => {});

const SPARKLE_PATH =
  "M12 3c.95 4.7 3.85 7.6 8.55 8.55-4.7.95-7.6 3.85-8.55 8.55C11.05 15.4 8.15 12.5 3.45 11.55 8.15 10.6 11.05 7.7 12 3Z";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((message: string) => {
    const id = idRef.current++;
    setToasts((t) => [...t, { id, message, leaving: false }]);
    setTimeout(() => {
      setToasts((t) => t.map((item) => (item.id === id ? { ...item, leaving: true } : item)));
      setTimeout(() => {
        setToasts((t) => t.filter((item) => item.id !== id));
      }, 350);
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-host">
        {toasts.map((t) => (
          <div className="toast" key={t.id} style={{ opacity: t.leaving ? 0 : undefined }}>
            <svg className="spark" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={SPARKLE_PATH} />
            </svg>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
