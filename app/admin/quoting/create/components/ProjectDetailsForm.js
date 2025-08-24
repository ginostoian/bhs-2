"use client";

export default function ProjectDetailsForm({ formData, updateFormData }) {
  const projectTypes = [
    { value: "bathroom-renovation", label: "Bathroom Renovation" },
    { value: "kitchen-renovation", label: "Kitchen Renovation" },
    { value: "electrical-rewiring", label: "Electrical Rewiring" },
    { value: "boiler-installation", label: "Boiler Installation/Relocation" },
    { value: "full-home-renovation", label: "Full Home Renovation" },
    { value: "home-extension", label: "Home Extension" },
    { value: "loft-conversion", label: "Loft Conversion" },
    { value: "garden-work", label: "Garden Work" },
    { value: "custom", label: "Custom Project" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Project Details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please provide information about the project and its requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="project-type"
            className="block text-sm font-medium text-gray-700"
          >
            Project Type *
          </label>
          <select
            id="project-type"
            value={formData.project.type}
            onChange={(e) =>
              updateFormData("project", { type: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="">Select project type</option>
            {projectTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="project-title"
            className="block text-sm font-medium text-gray-700"
          >
            Project Title *
          </label>
          <input
            type="text"
            id="project-title"
            value={formData.project.title}
            onChange={(e) =>
              updateFormData("project", { title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Master Bathroom Renovation"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="project-description"
            className="block text-sm font-medium text-gray-700"
          >
            Project Description *
          </label>
          <textarea
            id="project-description"
            rows={4}
            value={formData.project.description}
            onChange={(e) =>
              updateFormData("project", { description: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="Please describe the project requirements, scope of work, and any specific details..."
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="project-address"
            className="block text-sm font-medium text-gray-700"
          >
            Project Address *
          </label>
          <textarea
            id="project-address"
            rows={3}
            value={formData.project.address}
            onChange={(e) =>
              updateFormData("project", { address: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="Full address where the work will be carried out"
            required
          />
        </div>

        <div>
          <label
            htmlFor="project-start-date"
            className="block text-sm font-medium text-gray-700"
          >
            Preferred Start Date
          </label>
          <input
            type="date"
            id="project-start-date"
            value={formData.project.startDate}
            onChange={(e) =>
              updateFormData("project", { startDate: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="project-duration"
            className="block text-sm font-medium text-gray-700"
          >
            Estimated Duration *
          </label>
          <input
            type="text"
            id="project-duration"
            value={formData.project.estimatedDuration}
            onChange={(e) =>
              updateFormData("project", { estimatedDuration: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., 2-3 weeks, 1 month"
            required
          />
        </div>
      </div>
    </div>
  );
}
