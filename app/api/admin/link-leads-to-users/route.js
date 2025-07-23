import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import User from "@/models/User";

// POST - Trigger lead-to-user linking process
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Get all active leads
    const leads = await Lead.find({ isActive: true, isArchived: false });
    console.log(`📊 Found ${leads.length} active leads`);

    // Get all users
    const users = await User.find({});
    console.log(`👥 Found ${users.length} users`);

    // Create email to user mapping
    const userEmailMap = {};
    users.forEach((user) => {
      userEmailMap[user.email.toLowerCase()] = user._id;
    });

    let linkedCount = 0;
    let alreadyLinkedCount = 0;
    let noUserFoundCount = 0;

    for (const lead of leads) {
      const leadEmail = lead.email.toLowerCase();

      if (lead.linkedUser) {
        alreadyLinkedCount++;
        continue;
      }

      if (userEmailMap[leadEmail]) {
        lead.linkedUser = userEmailMap[leadEmail];
        await lead.save();
        linkedCount++;
        console.log(
          `🔗 Linked lead "${lead.name}" to user with email ${leadEmail}`,
        );
      } else {
        noUserFoundCount++;
      }
    }

    console.log(
      `📈 Linking Summary: ${linkedCount} newly linked, ${alreadyLinkedCount} already linked, ${noUserFoundCount} no user found`,
    );

    return NextResponse.json({
      success: true,
      message: `Successfully linked ${linkedCount} leads to users`,
      linkedCount,
      alreadyLinkedCount,
      noUserFoundCount,
      totalLeads: leads.length,
      totalUsers: users.length,
    });
  } catch (error) {
    console.error("Error linking leads to users:", error);
    return NextResponse.json(
      { error: "Failed to link leads to users", details: error.message },
      { status: 500 },
    );
  }
}
