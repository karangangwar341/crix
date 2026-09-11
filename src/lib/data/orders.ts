export interface AdminOrder {
  id: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  status: "Fulfilled" | "Processing" | "Pending" | "Refunded";
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
}

export interface AdminEnquiry {
  id: string;
  company: string;
  contact: string;
  category: string;
  quantity: string;
  status: "New" | "In Review" | "Quoted" | "Closed";
  date: string;
}

export const adminOrders: AdminOrder[] = [
  { id: "CRIX-10245", customer: "James Holloway", date: "2026-09-02", items: 2, total: 588, status: "Fulfilled" },
  { id: "CRIX-10244", customer: "Aarav Patel", date: "2026-09-02", items: 1, total: 179, status: "Processing" },
  { id: "CRIX-10243", customer: "Charlotte Webb", date: "2026-09-01", items: 3, total: 742, status: "Pending" },
  { id: "CRIX-10242", customer: "Liam Kearns", date: "2026-08-31", items: 1, total: 89, status: "Fulfilled" },
  { id: "CRIX-10241", customer: "Sofia Marin", date: "2026-08-30", items: 1, total: 499, status: "Fulfilled" },
  { id: "CRIX-10240", customer: "Ben Thackeray", date: "2026-08-29", items: 2, total: 268, status: "Refunded" },
  { id: "CRIX-10239", customer: "Isla Rutherford", date: "2026-08-28", items: 1, total: 349, status: "Fulfilled" },
];

export const adminCustomers: AdminCustomer[] = [
  { id: "c1", name: "James Holloway", email: "j.holloway@example.com", orders: 6, spent: 2140, joined: "2024-03-11" },
  { id: "c2", name: "Aarav Patel", email: "aarav.p@example.com", orders: 3, spent: 890, joined: "2024-11-02" },
  { id: "c3", name: "Charlotte Webb", email: "c.webb@example.com", orders: 9, spent: 3320, joined: "2023-06-19" },
  { id: "c4", name: "Liam Kearns", email: "liam.k@example.com", orders: 1, spent: 89, joined: "2026-08-30" },
  { id: "c5", name: "Sofia Marin", email: "sofia.m@example.com", orders: 4, spent: 1560, joined: "2025-01-22" },
];

export const adminEnquiries: AdminEnquiry[] = [
  { id: "e1", company: "Oakwood Cricket Club", contact: "David Munro", category: "Bulk Orders", quantity: "50 units", status: "New", date: "2026-09-03" },
  { id: "e2", company: "Riverside Academy", contact: "Priya Nair", category: "Custom Manufacturing", quantity: "120 units", status: "In Review", date: "2026-08-28" },
  { id: "e3", company: "Metro Sports Retail", contact: "Tom Baxter", category: "Private Label", quantity: "500 units", status: "Quoted", date: "2026-08-20" },
  { id: "e4", company: "Sunridge Corporate League", contact: "Emma Fowler", category: "Corporate Cricket Programs", quantity: "35 units", status: "Closed", date: "2026-08-05" },
];

export const revenueSeries = [42, 48, 45, 52, 61, 58, 66, 71, 69, 78, 85, 92];
export const ordersSeries = [120, 132, 128, 145, 158, 150, 172, 180, 176, 195, 210, 224];
