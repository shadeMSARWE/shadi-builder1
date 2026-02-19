"use client";

import Link from "next/link";

const PLANS = [
  { id: "free", name: "Free", credits: 500, price: 0, features: ["500 credits", "5 projects", "Website builder"] },
  { id: "pro", name: "Pro", credits: 5000, price: 29, features: ["5000 credits", "50 projects", "All modules", "Priority support"] },
  { id: "enterprise", name: "Enterprise", credits: 50000, price: 199, features: ["50000 credits", "500 projects", "Custom integrations", "Dedicated support"] },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <header className="p-6 flex justify-between items-center border-b border-white/5">
        <Link href="/" className="text-2xl font-black">
          FERDOUS <span className="gradient-text">AI</span>
        </Link>
        <Link href="/dashboard" className="px-4 py-2 rounded-xl hover:bg-white/5 font-semibold">
          Dashboard
        </Link>
      </header>
      <main className="max-w-5xl mx-auto p-10">
        <h1 className="text-4xl font-black mb-2">Pricing</h1>
        <p className="text-slate-500 mb-12">Credit-based plans. Pay for what you use.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="glass-panel rounded-2xl p-8 border border-white/5 hover:border-indigo-500/30 transition"
            >
              <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
              <div className="text-3xl font-black mb-4">
                ${plan.price}
                <span className="text-sm font-normal text-slate-500">/mo</span>
              </div>
              <p className="text-slate-400 mb-6">{plan.credits.toLocaleString()} credits</p>
              <ul className="space-y-2 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm">
                    ✓ {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.price === 0 ? "/dashboard" : "/checkout"}
                className="block w-full py-3 rounded-xl text-center font-bold bg-indigo-600 hover:bg-indigo-500 transition"
              >
                {plan.price === 0 ? "Get Started" : "Subscribe"}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
