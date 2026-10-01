"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { buttonClass } from "@/components/admin/ui";
import CreateEmployeeForm from "./CreateEmployeeForm";

/** "New employee" button that opens the create form in an overlay. */
export default function AddEmployee({ users }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClass("primary")}
      >
        New employee
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-[#202925]/40 p-4 sm:p-8"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="relative mx-auto max-w-3xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-[#7A807B] hover:bg-[#F4F1EA] hover:text-[#202925]"
            >
              <X className="h-5 w-5" />
            </button>
            <CreateEmployeeForm users={users} />
          </div>
        </div>
      )}
    </>
  );
}
