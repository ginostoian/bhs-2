import Link from "next/link";
import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import ProjectsList from "./components/ProjectsList";

export default async function AdminProjectsPage({ searchParams }) {
  await connectMongoose();
  const page = Math.max(1, Number.parseInt(searchParams?.page, 10) || 1);
  const { projects, pagination } = await Project.getOngoingProjectsPaginated({
    page,
    limit: 10,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-600">
            Track ongoing builds, responsibilities and schedules.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex justify-end">
          <Link
            href="/admin/finished-projects"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            View finished projects →
          </Link>
        </div>
        <ProjectsList
          projects={JSON.parse(JSON.stringify(projects))}
          pagination={pagination}
        />
      </div>
    </div>
  );
}
