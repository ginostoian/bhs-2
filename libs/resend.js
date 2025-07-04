import { Resend } from "resend";
import config from "@/config";

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY && process.env.NODE_ENV === "development") {
  console.group("⚠️ RESEND_API_KEY missing from .env");
  console.error("It's not mandatory but it's required to send emails.");
  console.error("If you don't need it, remove the code from /libs/resend.js");
  console.groupEnd();
}

/**
 * Sends an email using Resend
 *
 * @async
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text content of the email.
 * @param {string} html - The HTML content of the email.
 * @param {string} replyTo - The email address to set as the "Reply-To" address.
 * @returns {Promise} A Promise that resolves when the email is sent.
 */
export const sendEmail = async ({ to, subject, text, html, replyTo }) => {
  const data = {
    from: config.resend.fromAdmin,
    to: [to],
    subject,
    text,
    html,
    ...(replyTo && { replyTo }),
  };

  const result = await resend.emails.send(data);
  return result;
};
