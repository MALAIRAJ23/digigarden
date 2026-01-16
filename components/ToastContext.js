// components/ToastContext.jsx
import { createContext, useContext, useState } from "react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function push(msg, type = "info", ttl = 4000) {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  }

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="toast" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} style={{ marginTop: 8, padding: 10, background: t.type === "error" ? "#ffecec" : "#f0f8ff", borderRadius: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", minWidth: 220 }}>
            <strong style={{ color: t.type === "error" ? "#b00020" : "#0b5480" }}>{t.msg}</strong>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
