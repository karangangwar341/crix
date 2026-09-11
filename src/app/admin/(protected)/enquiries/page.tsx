import { getAdminEnquiries } from "@/lib/dal";
import { adminEnquiries as fallbackEnquiries } from "@/lib/data/orders";
import EnquiriesClient from "./EnquiriesClient";

export default async function AdminEnquiriesPage() {
  const { enquiries } = await getAdminEnquiries();

  const mapped =
    enquiries.length > 0
      ? enquiries.map((e: any) => ({
          id: e.id,
          company: e.company,
          contact: e.contact,
          category: e.category,
          quantity: e.quantity,
          date: new Date(e.createdAt).toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
          }),
          status: e.status,
        }))
      : fallbackEnquiries;

  return <EnquiriesClient initialEnquiries={mapped} />;
}
