import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Expense from "@/models/Expense";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * GET /api/projects/[projectId]/expenses/[expenseId]
 * Get a specific expense
 */
export async function GET(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { projectId, expenseId } = params;

    const expense = await Expense.findOne({
      _id: expenseId,
      project: projectId,
    }).lean();

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({
      expense: {
        ...expense,
        id: expense._id.toString(),
        _id: undefined,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/projects/[projectId]/expenses/[expenseId] error:",
      error,
    );
    return NextResponse.json(
      { error: error.message || "Failed to fetch expense" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/projects/[projectId]/expenses/[expenseId]
 * Update a specific expense
 */
export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { projectId, expenseId } = params;
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

    // Find the expense
    const expense = await Expense.findOne({
      _id: expenseId,
      project: projectId,
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Update fields if provided
    if (name !== undefined) expense.name = name;
    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount < 0) {
        return NextResponse.json(
          { error: "Amount must be a valid positive number" },
          { status: 400 },
        );
      }
      expense.amount = parsedAmount;
    }
    if (purchaseDate !== undefined)
      expense.purchaseDate = new Date(purchaseDate);
    if (type !== undefined) {
      const validTypes = ["Expense", "Charge"];
      if (!validTypes.includes(type)) {
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
      }
      expense.type = type;
    }
    if (category !== undefined) {
      const validCategories = [
        "Bathroom",
        "Kitchen",
        "Electric",
        "Tiling",
        "Custom",
      ];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: "Invalid category" },
          { status: 400 },
        );
      }
      expense.category = category;
    }
    if (customCategory !== undefined) {
      expense.customCategory =
        category === "Custom" ? customCategory : undefined;
    }
    if (purchaseLink !== undefined) expense.purchaseLink = purchaseLink;
    if (notes !== undefined) expense.notes = notes;
    if (files !== undefined) expense.files = files;

    await expense.save();

    return NextResponse.json({
      expense: {
        ...expense.toObject(),
        id: expense._id.toString(),
        _id: undefined,
      },
      message: "Expense updated successfully",
    });
  } catch (error) {
    console.error(
      "PUT /api/projects/[projectId]/expenses/[expenseId] error:",
      error,
    );
    return NextResponse.json(
      { error: error.message || "Failed to update expense" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/projects/[projectId]/expenses/[expenseId]
 * Delete a specific expense
 */
export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { projectId, expenseId } = params;

    // Find and delete the expense
    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      project: projectId,
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Delete associated files from bunny.net storage
    if (expense.files && expense.files.length > 0) {
      try {
        const bunnyStorage = (await import("@/libs/bunnyStorage")).default;
        for (const file of expense.files) {
          if (file.filePath) {
            await bunnyStorage.deleteFile(file.filePath);
          }
        }
      } catch (fileError) {
        console.error("Error deleting files from bunny.net:", fileError);
        // Don't fail the expense deletion if file deletion fails
      }
    }

    return NextResponse.json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE /api/projects/[projectId]/expenses/[expenseId] error:",
      error,
    );
    return NextResponse.json(
      { error: error.message || "Failed to delete expense" },
      { status: 500 },
    );
  }
}
