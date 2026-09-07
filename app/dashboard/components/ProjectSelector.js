"use client";

import { useProject } from "./ProjectContext";
import { useState } from "react";
import { Building2, Check, ChevronDown } from "lucide-react";

const ProjectSelector = () => {
  const { projects, selectedProject, selectProject, loading } = useProject();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-11 w-full max-w-[290px] animate-pulse rounded-md border border-white/15 bg-white/[0.06] lg:border-black/10 lg:bg-black/[0.04]" />
    );
  }

  return (
    <div className="relative w-full max-w-[290px] text-left">
      <div>
        <button
          type="button"
          className="inline-flex h-11 w-full items-center gap-2 rounded-md border border-white/20 bg-white/[0.06] px-3 text-left text-xs font-medium text-white transition-colors hover:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-[#B6BEAE] focus:ring-offset-2 focus:ring-offset-[#202925] lg:border-[#D8D2C6] lg:bg-white lg:text-[#202925] lg:hover:border-[#c8c4ba] lg:hover:bg-[#F4F1EA] lg:focus:ring-[#4D5B4B] lg:focus:ring-offset-[#F4F1EA]"
          id="project-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Building2
            className="h-4 w-4 shrink-0 opacity-65"
            strokeWidth={1.7}
          />
          <span className="min-w-0 flex-1 truncate">
            {selectedProject?.name || "No project selected"}
          </span>
          {projects.length > 1 ? (
            <ChevronDown
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 opacity-60 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          ) : null}
        </button>
      </div>

      {isOpen && projects.length > 1 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div
            className="absolute left-0 z-20 mt-2 w-full min-w-[260px] origin-top-left overflow-hidden rounded-md border border-[#D8D2C6] bg-white p-1.5 shadow-xl shadow-black/10 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="project-menu-button"
            tabIndex="-1"
          >
            <div role="none">
              {projects.map((project) => (
                <button
                  key={project.id}
                  className={`flex min-h-10 w-full items-center gap-2 rounded px-3 text-left text-xs transition-colors ${
                    selectedProject?.id === project.id
                      ? "bg-[#eef2ff] font-semibold text-[#4D5B4B]"
                      : "text-[#43504b] hover:bg-[#f5f3ed] hover:text-[#202925]"
                  }`}
                  role="menuitem"
                  tabIndex="-1"
                  onClick={() => {
                    selectProject(project);
                    setIsOpen(false);
                  }}
                >
                  {project.name}
                  {selectedProject?.id === project.id && (
                    <span className="ml-auto text-[#4D5B4B]">
                      <Check aria-hidden="true" className="h-4 w-4" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectSelector;
