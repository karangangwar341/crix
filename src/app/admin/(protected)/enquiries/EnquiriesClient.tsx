"use client";

import { useState } from "react";
import { AdminEnquiry } from "@/lib/data/orders";
import { updateEnquiryStatus } from "@/app/actions/admin";

const statuses = ["New", "In Review", "Quoted", "Closed"] as const;

export default function EnquiriesClient({
  initialEnquiries,
}: {
  initialEnquiries: AdminEnquiry[];
}) {
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>(initialEnquiries);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: AdminEnquiry["status"]) => {
    setUpdatingId(id);
    await updateEnquiryStatus(id, newStatus);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
    setUpdatingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">B2B & Wholesale Enquiries</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Commercial leads, academy partnerships, and custom bat manufacturing requests from /business.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-neutral-50 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                <th className="px-5 py-3.5">Company / Club</th>
                <th className="px-5 py-3.5">Contact Person</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Volume</th>
                <th className="px-5 py-3.5">Received</th>
                <th className="px-5 py-3.5">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {enquiries.map((e) => (
                <tr key={e.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-ink">{e.company}</td>
                  <td className="px-5 py-4 text-ink-soft">{e.contact}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-md border border-line bg-neutral-50 px-2 py-1 text-xs">
                      {e.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium">{e.quantity}</td>
                  <td className="px-5 py-4 text-ink-faint text-xs">{e.date}</td>
                  <td className="px-5 py-4">
                    <select
                      value={e.status}
                      disabled={updatingId === e.id}
                      onChange={(evt) =>
                        handleStatusChange(e.id, evt.target.value as AdminEnquiry["status"])
                      }
                      className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-ink outline-none focus:border-black cursor-pointer disabled:opacity-50"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
