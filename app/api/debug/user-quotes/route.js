import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Quote from "@/models/Quote";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectMongoose();

    // Get all quotes for debugging
    const allQuotes = await Quote.find({}).lean();

    // Get quotes that should match the user
    const userQuotes = await Quote.find({
      linkedUser: session.user.id,
      status: { $ne: "draft" },
    }).lean();

    // Get quotes with this user ID regardless of status
    const allUserQuotes = await Quote.find({
      linkedUser: session.user.id,
    }).lean();

    return Response.json({
      debug: {
        sessionUserId: session.user.id,
        sessionUserEmail: session.user.email,
        totalQuotes: allQuotes.length,
        userQuotesCount: userQuotes.length,
        allUserQuotesCount: allUserQuotes.length,
        userQuotes: userQuotes.map((q) => ({
          id: q._id.toString(),
          title: q.title,
          status: q.status,
          linkedUser: q.linkedUser?.toString(),
          clientName: q.client?.name,
          clientEmail: q.client?.email,
        })),
        allUserQuotes: allUserQuotes.map((q) => ({
          id: q._id.toString(),
          title: q.title,
          status: q.status,
          linkedUser: q.linkedUser?.toString(),
          clientName: q.client?.name,
          clientEmail: q.client?.email,
        })),
        // Sample of all quotes to see their structure
        sampleQuotes: allQuotes.slice(0, 3).map((q) => ({
          id: q._id.toString(),
          title: q.title,
          status: q.status,
          linkedUser: q.linkedUser?.toString(),
          clientName: q.client?.name,
          clientEmail: q.client?.email,
        })),
      },
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
