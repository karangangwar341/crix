"use client";

import { useState } from "react";
import { CheckCircle2, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { submitContactForm } from "@/app/actions/storefront";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      topic: formData.get("topic") as string,
      message: formData.get("message") as string,
    };

    const res = await submitContactForm(data);

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else if (res.success) {
      setSubmitted(true);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10">
      <Reveal className="mb-12 max-w-xl">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">Contact</p>
        <h1 className="font-display text-4xl sm:text-5xl">We&rsquo;re here to help.</h1>
      </Reveal>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail size={18} className="mt-0.5 text-gold" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-ink-soft">support@crixcricket.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={18} className="mt-0.5 text-gold" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-ink-soft">+44 20 7946 0958</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 text-gold" />
            <div>
              <p className="font-medium">Workshop</p>
              <p className="text-sm text-ink-soft">Bowthorpe Valley, Kent, United Kingdom</p>
            </div>
          </div>

          <div className="border-t border-line-soft pt-6 text-sm text-ink-soft">
            <p className="mb-1 font-medium text-ink">Shipping & Returns</p>
            <p>Free shipping across India on orders over ₹2,499. 30-day returns on unused, unmarked equipment.</p>
          </div>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-white py-20 text-center shadow-[var(--shadow-card)]">
            <CheckCircle2 size={36} className="text-ink" />
            <p className="font-display text-xl">Message sent.</p>
            <p className="text-sm text-ink-soft">We&rsquo;ll respond within one working day.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <input name="name" required placeholder="Name" className="border border-line px-4 py-3 text-sm outline-none focus:border-ink" />
              <input name="email" required type="email" placeholder="Email" className="border border-line px-4 py-3 text-sm outline-none focus:border-ink" />
            </div>
            <select name="topic" required className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-ink" defaultValue="">
              <option value="" disabled>
                Topic
              </option>
              <option>Order Enquiry</option>
              <option>Product Question</option>
              <option>Warranty</option>
              <option>Other</option>
            </select>
            <textarea
              name="message"
              required
              placeholder="Message"
              rows={6}
              className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-ink"
            />
            <button disabled={loading} className="flex items-center justify-center gap-2 bg-ink px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.06em] text-bg disabled:opacity-70">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
