import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import Employee from "@/models/Employee";
import User from "@/models/User";
import EmployeesList from "./components/EmployeesList";
import CreateEmployeeForm from "./components/CreateEmployeeForm";

/**
 * Admin Employees Page
 * Displays employee management interface with CRUD operations
 */
export default async function AdminEmployeesPage() {
  // Check authentication and admin access
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  // Connect to MongoDB
  await connectMongoose();

  // Fetch all employees and convert to plain objects
  const employees = await Employee.find({})
    .sort({ name: 1 })
    .then((employees) => {
      return employees.map((employee) => {
        const employeeObj = employee.toJSON();
        return {
          ...employeeObj,
          dayRate: employeeObj.dayRate || null, // Explicitly include dayRate
        };
      });
    });

  // Fetch all users for potential conversion to employees (excluding admins and existing employees)
  const users = await User.find({
    role: { $nin: ["admin", "employee"] },
  })
    .select("name email projectStatus createdAt role")
    .sort({ name: 1 })
    .lean()
    .then((users) => {
      return users.map((user) => ({
        ...user,
        id: user._id.toString(),
        _id: undefined,
      }));
    });

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Employee Management
        </h2>
        <p className="text-gray-600">
          Manage employees and convert users to employees
        </p>
      </div>

      {/* Create Employee Form */}
      <div className="mb-8">
        <CreateEmployeeForm users={users} />
      </div>

      {/* Employees List */}
      <div>
        <EmployeesList employees={employees} />
      </div>
    </div>
  );
}
