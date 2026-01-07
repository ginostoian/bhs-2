"use client";

import { useProject } from "./ProjectContext";
import { useState } from "react";

const ProjectSelector = () => {
  const { projects, selectedProject, selectProject, loading } = useProject();
  const [isOpen, setIsOpen] = useState(false);

  if (loading || projects.length <= 1) return null;

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          id="project-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedProject?.name || "Select Project"}
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div
            className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="project-menu-button"
            tabIndex="-1"
          >
            <div className="py-1" role="none">
              {projects.map((project) => (
                <button
                  key={project.id}
                  className={`${
                    selectedProject?.id === project.id
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700"
                  } block w-full px-4 py-2 text-left text-sm hover:bg-gray-50`}
                  role="menuitem"
                  tabIndex="-1"
                  onClick={() => {
                    selectProject(project);
                    setIsOpen(false);
                  }}
                >
                  {project.name}
                  {selectedProject?.id === project.id && (
                    <span className="float-right text-indigo-600">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
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
