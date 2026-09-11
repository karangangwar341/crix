"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Reveal, RevealWords } from "@/components/ui/Reveal";
import { submitBusinessEnquiry } from "@/app/actions/storefront";

const offerings = [
  { title: "Custom Manufacturing", body: "Full-spec bats, gloves and protection built to your club or academy's exact requirements." },
  { title: "OEM", body: "White-label production for established brands looking to scale willow manufacturing." },
  { title: "Private Label", body: "Your branding, our craftsmanship — from sticker design to packaging." },
  { title: "Bulk Orders", body: "Volume pricing for clubs, schools and retailers, with dedicated account management." },
  { title: "Custom Bat Design", body: "Work with our craftsmen to design a signature profile, unique to your programme." },
  { title: "Corporate Cricket Programs", body: "Kit and equipment packages for corporate leagues and staff cricket programmes." },
];

export default function BusinessPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      company: formData.get("company") as string,
      contact: formData.get("contact") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      country: formData.get("country") as string,
      category: formData.get("category") as string,
      quantity: formData.get("quantity") as string,
      requirements: formData.get("requirements") as string,
      message: formData.get("message") as string,
    };

    const res = await submitBusinessEnquiry(data);

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else if (res.success) {
      setSubmitted(true);
    }
  };

  return (
    <div>
      <section className="mx-auto max-w-4xl px-5 py-24 text-center lg:px-10">
        <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">Business</p>
        <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">
          <RevealWords text="Built around your game." />
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          From private label to full OEM manufacturing, we partner with clubs, academies and brands to build
          cricket equipment at scale — without compromising the craft.
        </p>
      </section>

      <section className="border-y border-line bg-bg-alt">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 px-5 py-20 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
          {offerings.map((o) => (
            <Reveal key={o.title} className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-display text-xl">{o.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{o.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-24 lg:px-10">
        <Reveal className="mb-10 text-center">
          <h2 className="font-display text-3xl sm:text-4xl">Request a Quote</h2>
          <p className="mt-2 text-sm text-ink-soft">Tell us about your programme and we&rsquo;ll respond within two working days.</p>
        </Reveal>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-white py-16 text-center shadow-[var(--shadow-card)]">
            <CheckCircle2 size={36} className="text-ink" />
            <p className="font-display text-xl">Enquiry received.</p>
            <p className="text-sm text-ink-soft">Our business team will be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {error && (
              <div className="sm:col-span-2 rounded-md bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}
            <input name="company" required placeholder="Company" className="border border-line px-4 py-3 text-sm outline-none focus:border-ink" />
            <input name="contact" required placeholder="Full Name" className="border border-line px-4 py-3 text-sm outline-none focus:border-ink" />
            <input name="email" required type="email" placeholder="Email" className="border border-line px-4 py-3 text-sm outline-none focus:border-ink" />
            <input name="phone" placeholder="Phone" className="border border-line px-4 py-3 text-sm outline-none focus:border-ink" />
            <input name="country" placeholder="Country" className="border border-line px-4 py-3 text-sm outline-none focus:border-ink" />
            <select name="category" required className="border border-line px-4 py-3 text-sm outline-none focus:border-ink" defaultValue="">
              <option value="" disabled>
                Product Category
              </option>
              <option>Bats</option>
              <option>Protection</option>
              <option>Bags</option>
              <option>Full Kit Programme</option>
            </select>
            <input name="quantity" placeholder="Estimated Quantity" className="border border-line px-4 py-3 text-sm outline-none focus:border-ink sm:col-span-2" />
            <textarea
              name="requirements"
              placeholder="Requirements"
              rows={4}
              className="border border-line px-4 py-3 text-sm outline-none focus:border-ink sm:col-span-2"
            />
            <textarea
              name="message"
              placeholder="Message"
              rows={3}
              className="border border-line px-4 py-3 text-sm outline-none focus:border-ink sm:col-span-2"
            />
            <button disabled={loading} className="flex items-center justify-center gap-2 bg-ink py-3.5 text-[13px] font-medium uppercase tracking-[0.06em] text-bg sm:col-span-2 disabled:opacity-70">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
