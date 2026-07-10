import { getServerSession } from "next-auth/next";
import { authOptions } from "./next-auth";

export const hasValidCronSecret = (request) => {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
};

export const authorizeCronOrAdmin = async (request) => {
  if (hasValidCronSecret(request)) return true;
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
};
