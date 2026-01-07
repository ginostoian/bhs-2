"use client";

import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "@/libs/api";
import { useRouter } from "next/navigation";

const ProjectContext = createContext({
  projects: [],
  selectedProject: null,
  selectProject: () => {},
  loading: true,
});

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { projects } = await apiClient.get("/projects");
        setProjects(projects);

        // Get project from cookie if exists
        const cookieValue = document.cookie
          .split("; ")
          .find((row) => row.startsWith("selectedProjectId="))
          ?.split("=")[1];

        if (cookieValue) {
          const project = projects.find((p) => p.id === cookieValue);
          if (project) {
            setSelectedProject(project);
          } else if (projects.length > 0) {
            setSelectedProject(projects[0]);
            document.cookie = `selectedProjectId=${projects[0].id}; path=/; max-age=31536000`;
          }
        } else if (projects.length > 0) {
          setSelectedProject(projects[0]);
          document.cookie = `selectedProjectId=${projects[0].id}; path=/; max-age=31536000`;
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const selectProject = (project) => {
    setSelectedProject(project);
    document.cookie = `selectedProjectId=${project.id}; path=/; max-age=31536000`;
    router.refresh(); // Refresh server components
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        selectProject,
        loading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
