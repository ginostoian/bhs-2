"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

/**
 * Create User Form Component
 * Allows admins to create new users with collapsible glassmorphism interface
 */
export default function CreateUserForm({ onUserCreated }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    projectStatus: "Lead",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setModalState({
        isOpen: true,
        title: "Validation Error",
        message: "Email is required",
        type: "alert",
        confirmText: "OK",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create user");
      }

      const newUser = await response.json();

      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "user",
        projectStatus: "Lead",
        password: "",
      });

      // Collapse form after successful creation
      setIsExpanded(false);

      // Callback to parent component
      if (onUserCreated) {
        onUserCreated(newUser);
      }
      
       // Reload page to show new user if no callback (simplified for this context)
       if (typeof window !== 'undefined') {
            window.location.reload(); 
       }

    } catch (error) {
      console.error("Error creating user:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: error.message || "Failed to create user. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100/50 bg-white/60 backdrop-blur-md shadow-sm overflow-hidden transition-all duration-300">
      {/* Header with toggle button */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
             </div>
             <div>
                 <h3 className="text-sm font-bold text-gray-900">Add New User</h3>
                 <p className="text-xs text-gray-500">Create a new account for a client or admin</p>
             </div>
        </div>
        
        <button
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-gray-100' : ''}`}
        >
             <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
        </button>
      </div>

      {/* Collapsible form content */}
      <div className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 pt-0 border-t border-gray-100/50">
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border-gray-200 bg-white/50 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all placeholder-gray-400"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border-gray-200 bg-white/50 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all placeholder-gray-400"
                    placeholder="e.g. john@example.com"
                  />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="role" className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Role
                  </label>
                  <div className="relative">
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-xl border-gray-200 bg-white/50 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
                      >
                        <option value="user">User (Client)</option>
                        <option value="admin">Administrator</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="projectStatus" className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Project Status
                  </label>
                   <div className="relative">
                      <select
                        id="projectStatus"
                        name="projectStatus"
                        value={formData.projectStatus}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-xl border-gray-200 bg-white/50 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
                      >
                        <option value="Lead">Lead</option>
                        <option value="On Going">On Going</option>
                        <option value="Finished">Finished</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                         <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                   </div>
                </div>
             </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Password (Optional)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-200 bg-white/50 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all placeholder-gray-400"
                placeholder="Leave empty for Google-only login"
              />
              <p className="mt-1.5 text-xs text-gray-400">
                Create a password for traditional email login. Google OAuth will happen automatically on first sign-in.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.email}
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 hover:shadow-lg hover:from-blue-500 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all transform active:scale-95"
              >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                    </>
                ) : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            title: "",
            message: "",
            type: "alert",
            confirmText: "OK",
          })
        }
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        type={modalState.type}
      />
    </div>
  );
}
