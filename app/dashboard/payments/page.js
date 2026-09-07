import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { CalendarDays, CheckCircle2, Clock3, CreditCard } from "lucide-react";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Payment from "@/models/Payment";
import {
  ClientEmptyState,
  ClientPageHeader,
} from "@/components/client-portal/ClientPage";

function formatDate(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value || 0);
}

function statusStyles(status) {
  if (status === "Paid") return "border-[#b8d9c5] bg-[#edf8f1] text-[#267448]";
  if (status === "Due") return "border-[#efc1bb] bg-[#fff3f1] text-[#b3342a]";
  return "border-[#c9d6f7] bg-[#f0f4ff] text-[#2455b8]";
}

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();

  const selectedProjectId = cookies().get("selectedProjectId")?.value;
  const query = { user: session.user.id };
  if (selectedProjectId) query.project = selectedProjectId;

  const payments = await Payment.find(query)
    .sort({ order: 1 })
    .populate("user", "name email")
    .lean()
    .then((documents) =>
      documents.map((document) => ({
        ...document,
        id: document._id.toString(),
        _id: undefined,
        user: document.user
          ? {
              ...document.user,
              id: document.user._id.toString(),
              _id: undefined,
            }
          : document.user,
      })),
    );

  // Preserve the existing automatic due-date status synchronisation.
  for (const payment of payments) {
    const paymentDocument = await Payment.findById(payment.id);
    if (paymentDocument) {
      paymentDocument.updateStatus();
      if (paymentDocument.isModified()) {
        await paymentDocument.save();
        payment.status = paymentDocument.status;
      }
    }
  }

  const paidPayments = payments.filter((payment) => payment.status === "Paid");
  const duePayments = payments.filter((payment) => payment.status === "Due");
  const totalAmount = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );
  const paidAmount = paidPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );
  const remainingAmount = totalAmount - paidAmount;
  const completion = payments.length
    ? Math.round((paidPayments.length / payments.length) * 100)
    : 0;

  return (
    <div>
      <ClientPageHeader
        title="Payments"
        description="Track each instalment, due date and the overall payment plan for your selected project."
        meta={{ label: "Total plan", value: formatCurrency(totalAmount) }}
      />

      {payments.length ? (
        <div className="space-y-7">
          <section className="grid border border-[#D8D2C6] bg-[#F4F1EA] sm:grid-cols-3 sm:divide-x sm:divide-[#D8D2C6]">
            {[
              [
                "Paid",
                formatCurrency(paidAmount),
                `${paidPayments.length} completed`,
              ],
              [
                "Remaining",
                formatCurrency(remainingAmount),
                `${payments.length - paidPayments.length} outstanding`,
              ],
              [
                "Due now",
                formatCurrency(
                  duePayments.reduce((sum, payment) => sum + payment.amount, 0),
                ),
                `${duePayments.length} payment${duePayments.length === 1 ? "" : "s"}`,
              ],
            ].map(([label, value, detail]) => (
              <div
                key={label}
                className="border-b border-[#D8D2C6] px-5 py-5 last:border-b-0 sm:border-b-0 sm:px-6"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#89918e]">
                  {label}
                </p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#202925]">
                  {value}
                </p>
                <p className="mt-1 text-[11px] text-[#7c8682]">{detail}</p>
              </div>
            ))}
          </section>

          <section className="border border-[#D8D2C6] bg-[#F4F1EA]">
            <div className="border-b border-[#D8D2C6] px-5 py-5 sm:flex sm:items-end sm:justify-between sm:px-6">
              <div>
                <h2 className="text-base font-semibold text-[#202925]">
                  Payment schedule
                </h2>
                <p className="mt-1 text-xs text-[#4D5B4B]">
                  Every instalment in the order it is scheduled.
                </p>
              </div>
              <div className="mt-4 w-full max-w-[280px] sm:mt-0">
                <div className="mb-2 flex items-center justify-between text-[11px] text-[#4D5B4B]">
                  <span>Plan completed</span>
                  <span className="font-semibold text-[#202925]">
                    {completion}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#e5e2da]">
                  <div
                    className="h-full rounded-full bg-[#2d955c]"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#e5e2da]">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:px-6"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#f0eee8] text-xs font-semibold text-[#43504b]">
                      {payment.order}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-[#202925]">
                        {payment.name}
                      </h3>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#4D5B4B]">
                        <CalendarDays
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                        />
                        Due {formatDate(payment.dueDate)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[#202925]">
                    {formatCurrency(payment.amount)}
                  </p>
                  <span
                    className={`inline-flex min-h-7 w-fit items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-semibold ${statusStyles(payment.status)}`}
                  >
                    {payment.status === "Paid" ? (
                      <CheckCircle2
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      />
                    ) : payment.status === "Due" ? (
                      <CreditCard aria-hidden="true" className="h-3.5 w-3.5" />
                    ) : (
                      <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <ClientEmptyState
          icon={CreditCard}
          title="No payments scheduled"
          description="Your payment schedule will appear here once the project payment plan is set up."
        />
      )}
    </div>
  );
}
