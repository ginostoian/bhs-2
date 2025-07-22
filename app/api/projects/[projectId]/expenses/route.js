import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Expense from "@/models/Expense";
import Project from "@/models/Project";
import User from "@/models/User";
import { requireAdmin } from "@/libs/requireAdmin";
import bunnyStorage from "@/libs/bunnyStorage";

/**
 * GET /api/projects/[projectId]/expenses
 * Get all expenses for a specific project
 */
export async function GET(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { projectId } = params;

    // Verify project exists
    const project = await Project.findById(projectId)
      .populate("user", "name email address")
      .lean();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get expenses for the project
    const expenses = await Expense.find({ project: projectId })
      .sort({ order: 1 })
      .lean()
      .then((docs) =>
        docs.map((doc) => ({
          ...doc,
          id: doc._id.toString(),
          _id: undefined,
        })),
      );

    // Get project totals
    const totalAmount = await Expense.getProjectTotal(projectId);
    const byCategory = await Expense.getProjectByCategory(projectId);
    const byType = await Expense.getProjectByType(projectId);

    return NextResponse.json({
      expenses,
      project: {
        id: project._id.toString(),
        name: project.name,
        user: {
          id: project.user._id.toString(),
          name: project.user.name,
          email: project.user.email,
          address: project.user.address,
        },
      },
      totals: {
        totalAmount,
        byCategory,
        byType,
      },
    });
  } catch (error) {
    console.error("GET /api/projects/[projectId]/expenses error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch expenses" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/projects/[projectId]/expenses
 * Create a new expense for a project
 */
export async function POST(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { projectId } = params;
    const requestBody = await req.json();

    const {
      name,
      amount,
      purchaseDate,
      type,
      category,
      customCategory,
      purchaseLink,
      notes,
      files,
    } = requestBody;

    // Validate required fields
    if (!name || !amount || !purchaseDate || !type || !category) {
      return NextResponse.json(
        {
          error: "name, amount, purchaseDate, type, and category are required",
        },
        { status: 400 },
      );
    }

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return NextResponse.json(
        { error: "Amount must be a valid positive number" },
        { status: 400 },
      );
    }

    // Validate type
    const validTypes = ["Expense", "Charge"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Validate category
    const validCategories = [
      "Bathroom",
      "Kitchen",
      "Electric",
      "Tiling",
      "Custom",
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Validate custom category if category is Custom
    if (category === "Custom" && !customCategory) {
      return NextResponse.json(
        { error: "Custom category name is required when category is Custom" },
        { status: 400 },
      );
    }

    // Verify project exists
    const project = await Project.findById(projectId)
      .populate("user", "name email address")
      .lean();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Create expense
    const expense = await Expense.create({
      project: projectId,
      name,
      amount: parsedAmount,
      purchaseDate: new Date(purchaseDate),
      type,
      category,
      customCategory: category === "Custom" ? customCategory : undefined,
      purchaseLink,
      notes,
      files: files || [],
    });

    // Convert to plain object
    const expenseData = {
      ...expense.toObject(),
      id: expense._id.toString(),
      _id: undefined,
    };

    return NextResponse.json({
      expense: expenseData,
      message: "Expense created successfully",
    });
  } catch (error) {
    console.error("POST /api/projects/[projectId]/expenses error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create expense" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/projects/[projectId]/expenses
 * Reorder expenses (drag and drop)
 */
export async function PATCH(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { projectId } = params;
    const { expenses } = await req.json();

    if (!expenses || !Array.isArray(expenses)) {
      return NextResponse.json(
        { error: "expenses array is required" },
        { status: 400 },
      );
    }

    // Update order for each expense
    const updatePromises = expenses.map((expense, index) =>
      Expense.findByIdAndUpdate(expense.id, { order: index + 1 }),
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      message: "Expenses reordered successfully",
    });
  } catch (error) {
    console.error("PATCH /api/projects/[projectId]/expenses error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reorder expenses" },
      { status: 500 },
    );
  }
}
