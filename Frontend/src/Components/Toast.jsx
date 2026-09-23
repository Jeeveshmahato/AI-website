import { createContext, useCallback, useContext, useRef, useState } from "react";
import { FiCheck, FiAlertCircle } from "react-icons/fi";

const ToastContext = createContext(() => {});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const toast = useCallback((message, type = "success") => {
    const id = ++nextId.current;
    setToasts((t) => [...t.slice(-2), { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-16 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex animate-pop items-center gap-2 rounded-lg bg-fg px-3.5 py-2.5 text-sm font-medium text-canvas shadow-card"
          >
            {t.type === "error" ? (
              <FiAlertCircle className="text-danger" aria-hidden="true" />
            ) : (
              <FiCheck aria-hidden="true" />
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
