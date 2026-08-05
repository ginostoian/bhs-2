import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import {
  Banknote,
  CalendarDays,
  CircleDot,
  MapPin,
  UserRound,
} from "lucide-react";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import {
  ClientEmptyState,
  ClientPageHeader,
  ClientPrimaryLink,
} from "@/components/client-portal/ClientPage";

function formatDate(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatCurrency(value) {
  if (value === null || value === undefined) return "Not set";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 border-b border-[#e5e2da] py-4 last:border-b-0">
      <Icon
        aria-hidden="true"
        className="mt-0.5 h-4 w-4 shrink-0 text-[#66716d]"
        strokeWidth={1.65}
      />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#89918e]">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium leading-5 text-[#17231f]">
          {value}
        </p>
      </div>
    </div>
  );
}

export default async function ProjectDetailsPage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();

  const selectedProjectId = cookies().get("selectedProjectId")?.value;
  const projects = await Project.find({ user: session.user.id })
    .populate("projectManager", "name position")
    .sort({ createdAt: -1 })
    .lean();
  const project =
    projects.find((item) => item._id.toString() === selectedProjectId) ||
    projects[0] ||
    null;

  if (!project) {
    return (
      <div>
        <ClientPageHeader
          title="Project details"
          description="A clear view of the renovation project linked to your account."
        />
        <ClientEmptyState
          title="No project linked yet"
          description="When your renovation project is created, its status, dates and progress will appear here."
          action={
            <ClientPrimaryLink href="/dashboard/request-quote">
              Request a quote
            </ClientPrimaryLink>
          }
        />
      </div>
    );
  }

  const progress = Math.max(0, Math.min(100, project.progress || 0));

  return (
    <div>
      <ClientPageHeader
        title={project.name}
        description={
          project.description || "Your renovation project at a glance."
        }
        meta={{ label: "Project status", value: project.status }}
      />

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <section className="border border-[#dedbd2] bg-[#fbfaf7] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-[#17231f]">
              Overall progress
            </h2>
            <span className="text-3xl font-medium tracking-[-0.035em] text-[#17231f]">
              {progress}%
            </span>
          </div>
          <div
            className="mt-5 h-2 overflow-hidden rounded-full bg-[#e5e2da]"
            role="progressbar"
            aria-label="Project progress"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progress}
          >
            <div
              className="h-full rounded-full bg-[#1559d6]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-8 grid gap-x-8 sm:grid-cols-2">
            <DetailRow
              icon={CircleDot}
              label="Project type"
              value={project.type || "Not set"}
            />
            <DetailRow
              icon={MapPin}
              label="Location"
              value={project.location || "Not set"}
            />
            <DetailRow
              icon={CalendarDays}
              label="Started"
              value={formatDate(project.startDate)}
            />
            <DetailRow
              icon={CalendarDays}
              label="Projected finish"
              value={formatDate(
                project.projectedFinishDate || project.completionDate,
              )}
            />
            <DetailRow
              icon={Banknote}
              label="Budget"
              value={formatCurrency(project.budget)}
            />
            <DetailRow
              icon={UserRound}
              label="Project manager"
              value={project.projectManager?.name || "To be assigned"}
            />
          </div>
        </section>

        <aside className="border border-[#dedbd2] bg-[#f4f1e9] p-5 sm:p-7">
          <h2 className="text-base font-semibold text-[#17231f]">
            Project records
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#66716d]">
            Open the areas where your project documents and decisions are kept.
          </p>
          <div className="mt-6 space-y-2">
            {[
              ["Quotes", "/dashboard/quotes"],
              ["Invoices", "/dashboard/invoices"],
              ["Project changes", "/dashboard/changes"],
              ["Photos", "/dashboard/photos"],
              ["Instructions", "/dashboard/instructions"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="flex min-h-11 items-center justify-between border-b border-[#dcd8ce] text-xs font-semibold text-[#17231f] transition-colors hover:text-[#1559d6]"
              >
                {label}
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
