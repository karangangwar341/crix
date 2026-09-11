"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, Loader2, CreditCard, Building2, Smartphone, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { placeOrder } from "@/app/actions/storefront";

const STEPS = ["Shipping", "Payment", "Review"] as const;

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { lines, subtotal, clear } = useCart();
  const [step, setStep] = useState(0);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wire" | "express">("card");

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    country: "India",
  });

  // Pre-fill shipping info from authenticated customer session
  useEffect(() => {
    if (session?.user) {
      const parts = (session.user.name || "").split(" ");
      setShippingInfo((prev) => ({
        ...prev,
        firstName: prev.firstName || parts[0] || "",
        lastName: prev.lastName || parts.slice(1).join(" ") || "",
        email: prev.email || session.user?.email || "",
      }));
    }
  }, [session]);

  const shipping = subtotal() > 2499 ? 0 : 199;
  const discount = promoApplied ? subtotal() * 0.1 : 0;
  const total = subtotal() + shipping - discount;

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setError(null);

    const fullName = `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim() || "Guest Customer";
    const fullAddress = [
      shippingInfo.address,
      shippingInfo.city,
      shippingInfo.postcode,
      shippingInfo.country,
    ]
      .filter(Boolean)
      .join(", ");

    let selectedPaymentDesc = "Credit / Debit Card (RuPay •••• 4242)";
    if (paymentMethod === "wire") selectedPaymentDesc = "Direct Bank Transfer (NEFT / RTGS / IMPS)";
    if (paymentMethod === "express") selectedPaymentDesc = "UPI Instant Payment (GPay / PhonePe / Paytm)";

    const res = await placeOrder({
      customerName: fullName,
      customerEmail: shippingInfo.email || "guest@crixcricket.com",
      customerPhone: shippingInfo.phone || undefined,
      shippingAddress: fullAddress || "Online Standard Delivery",
      paymentMethod: selectedPaymentDesc,
      items: lines.map((l) => ({
        productId: l.productId,
        variantId: l.variantId,
        title: l.name,
        quantity: l.quantity,
        unitPrice: l.price,
      })),
      totalAmount: total,
    });

    setSubmitting(false);
    if (res.error) {
      setError(res.error);
    } else if (res.orderId) {
      setOrderId(res.orderId);
      setPlaced(true);
      clear();
    }
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-5 py-32 text-center">
        <CheckCircle2 size={48} className="mx-auto text-ink" />
        <h1 className="mt-6 font-display text-3xl">Order confirmed.</h1>
        {orderId && (
          <p className="mt-2 font-mono text-sm font-semibold text-neutral-800">
            Order Reference: {orderId}
          </p>
        )}
        <p className="mt-3 text-sm text-ink-soft">
          A confirmation and tracking dispatch update has been sent to {shippingInfo.email || "your email"}.
        </p>
        <Link href="/" className="mt-8 inline-block bg-ink px-6 py-3 text-[13px] font-medium uppercase tracking-[0.06em] text-bg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-32 text-center">
        <h1 className="font-display text-3xl">Your bag is empty.</h1>
        <Link href="/bats" className="mt-6 inline-block bg-ink px-6 py-3 text-[13px] font-medium uppercase tracking-[0.06em] text-bg">
          Explore Bats
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-10">
      <h1 className="font-display text-4xl">Checkout</h1>

      <div className="mt-6 flex gap-6 text-[12px] uppercase tracking-[0.08em] text-ink-faint">
        {STEPS.map((s, i) => (
          <span key={s} className={i === step ? "font-medium text-ink" : ""}>
            {i + 1}. {s}
          </span>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="First name"
                  value={shippingInfo.firstName}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                  className="border border-line px-4 py-3 text-sm outline-none focus:border-ink"
                />
                <input
                  placeholder="Last name"
                  value={shippingInfo.lastName}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                  className="border border-line px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email address (for order tracking)"
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                  className="border border-line px-4 py-3 text-sm outline-none focus:border-ink"
                />
                <input
                  placeholder="Phone (optional)"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                  className="border border-line px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>
              <input
                placeholder="Shipping Street Address"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-ink"
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  placeholder="City"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  className="border border-line px-4 py-3 text-sm outline-none focus:border-ink"
                />
                <input
                  placeholder="PIN Code"
                  value={shippingInfo.postcode}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, postcode: e.target.value })}
                  className="border border-line px-4 py-3 text-sm outline-none focus:border-ink"
                />
                <select
                  value={shippingInfo.country}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                  className="border border-line px-4 py-3 text-sm outline-none focus:border-ink"
                >
                  <option>India</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>United States</option>
                </select>
              </div>
              <button onClick={() => setStep(1)} className="mt-4 w-full bg-ink py-3.5 text-[13px] font-medium uppercase tracking-[0.06em] text-bg">
                Continue to Payment
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              {/* Payment Method Selector */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                    paymentMethod === "card"
                      ? "border-ink bg-stone-50 font-semibold shadow-sm"
                      : "border-line bg-white hover:border-ink-soft text-ink-soft"
                  }`}
                >
                  <Smartphone size={20} className="mb-2 text-ink" />
                  <span className="text-xs">UPI / QR Code</span>
                  <span className="mt-1 text-[10px] text-ink-faint">GPay, PhonePe, Paytm</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                    paymentMethod === "card"
                      ? "border-ink bg-stone-50 font-semibold shadow-sm"
                      : "border-line bg-white hover:border-ink-soft text-ink-soft"
                  }`}
                >
                  <CreditCard size={20} className="mb-2 text-ink" />
                  <span className="text-xs">Cards</span>
                  <span className="mt-1 text-[10px] text-ink-faint">RuPay, Visa, MC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("wire")}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                    paymentMethod === "wire"
                      ? "border-ink bg-stone-50 font-semibold shadow-sm"
                      : "border-line bg-white hover:border-ink-soft text-ink-soft"
                  }`}
                >
                  <Building2 size={20} className="mb-2 text-ink" />
                  <span className="text-xs">NetBanking / Wire</span>
                  <span className="mt-1 text-[10px] text-ink-faint">NEFT / RTGS / IMPS</span>
                </button>
              </div>

              {/* Conditional Method Form */}
              {paymentMethod === "card" && (
                <div className="space-y-4 rounded-2xl border border-line bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Card Details</span>
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <ShieldCheck size={13} /> 256-Bit SSL Encrypted
                    </span>
                  </div>
                  <input
                    placeholder="Card number"
                    defaultValue="•••• •••• •••• 4242"
                    className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm font-mono text-ink outline-none focus:border-ink"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="MM / YY"
                      defaultValue="12 / 28"
                      className="rounded-xl border border-line bg-bg px-4 py-3 text-sm font-mono text-ink outline-none focus:border-ink"
                    />
                    <input
                      placeholder="CVV"
                      defaultValue="888"
                      className="rounded-xl border border-line bg-bg px-4 py-3 text-sm font-mono text-ink outline-none focus:border-ink"
                    />
                  </div>
                  <p className="flex items-center gap-2 text-xs text-ink-faint">
                    <Lock size={13} /> Sandbox RuPay/Visa test gateway active. No charges will be incurred.
                  </p>
                </div>
              )}

              {paymentMethod === "wire" && (
                <div className="rounded-2xl border border-line bg-stone-50 p-5 text-xs text-ink-soft space-y-2">
                  <p className="font-semibold text-ink">Direct Bank Transfer (NEFT / RTGS / IMPS):</p>
                  <div className="font-mono text-[11px] space-y-1 bg-white p-3 rounded-xl border border-line-soft">
                    <p>Beneficiary: CRIX Cricket & Sports India Pvt Ltd</p>
                    <p>Bank: HDFC Bank Ltd</p>
                    <p>Account: 50200083920144</p>
                    <p>IFSC: HDFC0000240</p>
                    <p>Branch: MG Road, Bengaluru</p>
                    <p>Reference: {shippingInfo.lastName ? `${shippingInfo.lastName.toUpperCase()}-CRX` : "CRIX-ORDER"}</p>
                  </div>
                  <p className="text-[11px] text-ink-faint">
                    Your bespoke equipment will be allocated immediately. Order dispatches upon payment confirmation.
                  </p>
                </div>
              )}

              {paymentMethod === "express" && (
                <div className="rounded-2xl border border-line bg-stone-50 p-6 text-center">
                  <Smartphone size={28} className="mx-auto text-ink mb-2" />
                  <p className="font-display text-sm font-medium text-ink">UPI Instant Payment</p>
                  <p className="text-xs text-ink-soft mt-1">
                    Scan QR or enter UPI ID to authorize {formatPrice(total)} via Google Pay, PhonePe, Paytm, or CRED.
                  </p>
                  <div className="mt-3 inline-block rounded-xl border border-line bg-white px-4 py-2 text-xs font-mono font-semibold text-ink">
                    crixcricket@okhdfcbank
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 rounded-xl border border-ink py-3.5 text-[13px] font-medium uppercase tracking-[0.06em]"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-xl bg-ink py-3.5 text-[13px] font-medium uppercase tracking-[0.06em] text-bg hover:opacity-90"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}
              <div className="divide-y divide-line-soft border-y border-line">
                {lines.map((l) => (
                  <div key={`${l.productId}-${l.variantId}`} className="flex items-center justify-between py-3 text-sm">
                    <span>
                      {l.name} × {l.quantity}
                    </span>
                    <span>{formatPrice(l.price * l.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Order Delivery & Settlement Summary */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border border-line bg-white p-4">
                  <span className="font-semibold uppercase tracking-wider text-ink-faint text-[10px] block mb-1">
                    Shipment Destination
                  </span>
                  <p className="font-medium text-ink">
                    {shippingInfo.firstName} {shippingInfo.lastName}
                  </p>
                  <p className="text-ink-soft mt-0.5">
                    {shippingInfo.address ? `${shippingInfo.address}, ${shippingInfo.city} ${shippingInfo.postcode}` : "Standard Shipping Address"}
                  </p>
                  <p className="text-ink-faint mt-1 text-[11px]">{shippingInfo.email}</p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-4">
                  <span className="font-semibold uppercase tracking-wider text-ink-faint text-[10px] block mb-1">
                    Settlement Method
                  </span>
                  <p className="font-medium text-ink">
                    {paymentMethod === "card" && "Credit Card (Visa •••• 4242)"}
                    {paymentMethod === "wire" && "Direct BACS Wire Transfer"}
                    {paymentMethod === "express" && "Digital Wallet (Apple Pay)"}
                  </p>
                  <p className="text-ink-soft mt-0.5">Payment status: Authorized</p>
                  <p className="text-emerald-600 mt-1 text-[11px] font-medium">SSL Encrypted Checkout</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-ink py-3.5 text-[13px] font-medium uppercase tracking-[0.06em]">
                  Back
                </button>
                <button
                  disabled={submitting}
                  onClick={handlePlaceOrder}
                  className="flex flex-1 items-center justify-center gap-2 bg-ink py-3.5 text-[13px] font-medium uppercase tracking-[0.06em] text-bg disabled:opacity-70"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? "Processing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-fit rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.1em]">Order Summary</p>
          <div className="space-y-2 text-sm">
            {lines.map((l) => (
              <div key={`${l.productId}-${l.variantId}`} className="flex justify-between text-ink-soft">
                <span>
                  {l.name} × {l.quantity}
                </span>
                <span>{formatPrice(l.price * l.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo code"
              className="flex-1 border border-line px-3 py-2 text-xs outline-none focus:border-ink"
            />
            <button
              onClick={() => setPromoApplied(promo.trim().toUpperCase() === "CRIX10")}
              className="border border-ink px-3 py-2 text-xs uppercase"
            >
              Apply
            </button>
          </div>
          {promo && !promoApplied && <p className="mt-1 text-[11px] text-ink-faint">Try &ldquo;CRIX10&rdquo; for 10% off.</p>}
          {promoApplied && <p className="mt-1 text-[11px] font-medium text-ink">10% discount applied.</p>}

          <div className="mt-4 space-y-2 border-t border-line-soft pt-4 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal())}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-ink font-medium">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-line-soft pt-2 text-base font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
