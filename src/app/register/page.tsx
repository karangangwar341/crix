"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import { registerCustomer } from "@/app/actions/customer";

function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your entries.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    const res = await registerCustomer({
      name,
      email,
      password,
      phone: phone || undefined,
      address: address || undefined,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    router.push("/login?registered=true");
  }

  return (
    <div className="w-full max-w-lg rounded-3xl border border-line bg-white p-8 sm:p-10 shadow-[var(--shadow-hover)]">
      <div className="text-center">
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ink-faint">
          Member Registration
        </span>
        <h1 className="mt-2 font-display text-3xl font-normal tracking-tight text-ink">
          Create Account
        </h1>
        <p className="mt-2 text-xs text-ink-soft">
          Join CRIX for direct order tracking, expedited checkout, and custom equipment specifications.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint"
          >
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alastair Cook"
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 pl-10 text-sm text-ink outline-none transition-colors focus:border-ink"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint"
          >
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 pl-10 text-sm text-ink outline-none transition-colors focus:border-ink"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint"
            >
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 pl-10 text-sm text-ink outline-none transition-colors focus:border-ink"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint"
            >
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 pl-10 text-sm text-ink outline-none transition-colors focus:border-ink"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint"
          >
            Phone Number (Optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+44 7911 123456"
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 pl-10 text-sm text-ink outline-none transition-colors focus:border-ink"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="address"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint"
          >
            Delivery Address (Optional)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3 text-ink-faint" size={16} />
            <textarea
              id="address"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 14 Pavilion Walk, St. John's Wood, London NW8 8QN"
              className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 pl-10 text-sm text-ink outline-none transition-colors focus:border-ink resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3.5 text-xs font-semibold uppercase tracking-widest text-bg transition-all hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg border-t-transparent" />
              Creating Account...
            </span>
          ) : (
            <>
              <span>Register Account</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 border-t border-line-soft pt-6 text-center text-xs text-ink-soft">
        Already have a CRIX account?{" "}
        <Link href="/login" className="font-semibold text-ink underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default function CustomerRegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-bg px-4 py-16">
      <Suspense fallback={<div className="text-xs text-ink-faint">Loading registration...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
