"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

// Small UI kit for the quote editor (brand palette, no external deps).

export const cx = (...classes) => classes.filter(Boolean).join(" ");

export const Card = ({ title, action, children, className, bodyClassName }) => (
  <section
    className={cx("rounded-lg border border-[#D8D2C6] bg-white", className)}
  >
    {title && (
      <header className="flex items-center justify-between gap-3 border-b border-[#EDE9E0] px-4 py-3">
        <p className="text-sm font-semibold text-[#202925]">{title}</p>
        {action}
      </header>
    )}
    <div className={cx("p-4", bodyClassName)}>{children}</div>
  </section>
);

export const Button = ({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...props
}) => (
  <button
    type="button"
    className={cx(
      "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
      size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm",
      variant === "primary" && "bg-[#4D5B4B] text-white hover:bg-[#3E4A3C]",
      variant === "secondary" &&
        "border border-[#D8D2C6] bg-white text-[#202925] hover:bg-[#F4F1EA]",
      variant === "ghost" && "text-[#4A524D] hover:bg-[#F4F1EA]",
      variant === "danger" && "bg-[#B42318] text-white hover:bg-[#912018]",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export const Field = ({ label, hint, children, className }) => (
  <label className={cx("block min-w-0", className)}>
    <span className="mb-1 block text-xs font-medium text-[#4A524D]">
      {label}
    </span>
    {children}
    {hint && <span className="mt-1 block text-xs text-[#7A807B]">{hint}</span>}
  </label>
);

export const inputClass =
  "block w-full border border-[#D8D2C6] bg-white px-2.5 py-2 text-sm text-[#202925] placeholder:text-[#A3A8A4] focus:border-[#4D5B4B] focus:outline-none focus:ring-1 focus:ring-[#4D5B4B]";

export const TextInput = ({ className, ...props }) => (
  <input className={cx(inputClass, className)} {...props} />
);

export const TextArea = ({ className, ...props }) => (
  <textarea className={cx(inputClass, "resize-y", className)} {...props} />
);

/** Click-outside dropdown. `items`: [{label, icon, onClick, danger, hidden}] or "divider". */
export const Menu = ({ items, label = "More", align = "right", trigger }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {trigger ? (
        trigger({ open, toggle: () => setOpen((o) => !o) })
      ) : (
        <button
          type="button"
          aria-label={label}
          title={label}
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-7 w-7 items-center justify-center text-[#7A807B] hover:bg-[#EDE9E0] hover:text-[#202925]"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      )}
      {open && (
        <div
          role="menu"
          className={cx(
            "absolute z-30 mt-1 min-w-[200px] rounded-md border border-[#D8D2C6] bg-white py-1 shadow-[0_8px_24px_rgba(32,41,37,0.12)]",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items
            .filter((item) => item && !item.hidden)
            .map((item, index) =>
              item === "divider" ? (
                <div key={index} className="my-1 h-px bg-[#EDE9E0]" />
              ) : (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    setOpen(false);
                    item.onClick();
                  }}
                  className={cx(
                    "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-[#F4F1EA] disabled:opacity-40",
                    item.danger ? "text-[#B42318]" : "text-[#202925]",
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && (
                    <span className="text-[11px] text-[#A3A8A4]">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              ),
            )}
        </div>
      )}
    </div>
  );
};

export const Modal = ({ title, onClose, children, footer, wide }) => {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#202925]/40 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cx(
          "max-h-[92vh] w-full overflow-y-auto rounded-t-lg bg-white sm:rounded-lg",
          wide ? "sm:max-w-2xl" : "sm:max-w-md",
        )}
      >
        <div className="border-b border-[#EDE9E0] px-5 py-4">
          <p className="text-base font-semibold">{title}</p>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-[#EDE9E0] px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/** Right-hand slide-over panel. */
export const Drawer = ({ title, onClose, children, footer }) => {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#202925]/30"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside className="flex h-full w-full max-w-md flex-col bg-white shadow-[-8px_0_24px_rgba(32,41,37,0.12)]">
        <div className="flex items-center justify-between border-b border-[#EDE9E0] px-5 py-4">
          <p className="text-base font-semibold">{title}</p>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-[#EDE9E0] px-5 py-3">
            {footer}
          </div>
        )}
      </aside>
    </div>
  );
};
