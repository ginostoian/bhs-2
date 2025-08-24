"use client";

export default function ClientInfoForm({ formData, updateFormData }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">
          Client Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Please provide the client&apos;s contact details and address.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="client-name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="client-name"
            value={formData.client.name}
            onChange={(e) => updateFormData("client", { name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label
            htmlFor="client-email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="client-email"
            value={formData.client.email}
            onChange={(e) =>
              updateFormData("client", { email: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="client-phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="client-phone"
            value={formData.client.phone}
            onChange={(e) =>
              updateFormData("client", { phone: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="07700 900000"
            required
          />
        </div>

        <div>
          <label
            htmlFor="client-postcode"
            className="block text-sm font-medium text-gray-700"
          >
            Postcode *
          </label>
          <input
            type="text"
            id="client-postcode"
            value={formData.client.postcode}
            onChange={(e) =>
              updateFormData("client", { postcode: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="SW1A 1AA"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="client-address"
            className="block text-sm font-medium text-gray-700"
          >
            Full Address *
          </label>
          <textarea
            id="client-address"
            rows={3}
            value={formData.client.address}
            onChange={(e) =>
              updateFormData("client", { address: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="123 Sample Street, London"
            required
          />
        </div>
      </div>
    </div>
  );
}
