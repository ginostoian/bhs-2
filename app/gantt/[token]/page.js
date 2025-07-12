import connectMongoose from "@/libs/mongoose";
import GanttShare from "@/models/GanttShare";
import Project from "@/models/Project";
import Task from "@/models/Task";
import TaskSection from "@/models/TaskSection";
import { notFound } from "next/navigation";
import PublicGanttChart from "./components/PublicGanttChart";

/**
 * Public Gantt Chart Page
 * Displays project Gantt chart via share token (no authentication required)
 */
export default async function PublicGanttPage({ params }) {
  await connectMongoose();
  const { token } = params;

  // Find active share by token
  const share = await GanttShare.getActiveByToken(token);
  if (!share) {
    notFound();
  }

  // Increment view count
  await share.incrementView();

  // Fetch project data
  const project = await Project.findById(share.project._id)
    .populate("user", "name email")
    .populate("projectManager", "name position email")
    .lean();

  if (!project) {
    notFound();
  }

  // Fetch project sections
  const sections = await TaskSection.find({ project: project._id })
    .sort({ order: 1 })
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        id: doc._id.toString(),
        name: doc.name,
        color: doc.color,
        icon: doc.icon,
        order: doc.order,
      })),
    );

  // Fetch project tasks
  const tasks = await Task.getProjectTasks(project._id)
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        id: doc._id.toString(),
        name: doc.name,
        description: doc.description,
        status: doc.status,
        priority: doc.priority,
        estimatedDuration: doc.estimatedDuration,
        actualDuration: doc.actualDuration,
        startDate: doc.startDate,
        completionDate: doc.completionDate,
        assignedTo: doc.assignedTo
          ? {
              id: doc.assignedTo._id.toString(),
              name: doc.assignedTo.name,
              position: doc.assignedTo.position,
            }
          : null,
        section: doc.section
          ? {
              id: doc.section._id.toString(),
              name: doc.section.name,
              color: doc.section.color,
              icon: doc.section.icon,
            }
          : null,
      })),
    );

  // Convert project to plain object
  const projectData = {
    id: project._id.toString(),
    name: project.name,
    description: project.description,
    type: project.type,
    status: project.status,
    priority: project.priority,
    progress: project.progress,
    startDate: project.startDate,
    completionDate: project.completionDate,
    location: project.location,
    budget: project.budget,
    user: {
      id: project.user._id.toString(),
      name: project.user.name,
      email: project.user.email,
    },
    projectManager: project.projectManager
      ? {
          id: project.projectManager._id.toString(),
          name: project.projectManager.name,
          position: project.projectManager.position,
          email: project.projectManager.email,
        }
      : null,
  };

  return (
    <PublicGanttChart
      project={projectData}
      tasks={tasks}
      sections={sections}
      shareToken={token}
    />
  );
}
