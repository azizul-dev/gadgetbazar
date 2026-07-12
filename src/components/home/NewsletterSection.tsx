"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Mail, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setSubscribed(true);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch {
      setError("Could not connect to the server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50" />

      {/* Blur Effects */}
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 p-10 shadow-2xl lg:p-16"
        >
          {/* Decorative Circle */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-lg">
              <Sparkles size={16} />
              Stay Updated
            </div>

            {/* Icon */}
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/15 backdrop-blur-xl"
            >
              <Mail size={42} className="text-white" />
            </motion.div>

            {/* Heading */}
            <h2 className="mt-8 text-4xl font-black tracking-tight text-white md:text-5xl">
              Never Miss
              <br />
              The Best Gadget Deals
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/90">
              Subscribe to our newsletter and be the first to discover exclusive
              offers, trending gadgets, and the latest marketplace updates.
            </p>

            {subscribed ? (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="mx-auto mt-10 flex max-w-md items-center justify-center gap-3 rounded-2xl bg-white/15 px-6 py-5 text-white backdrop-blur-xl"
              >
                <CheckCircle2 size={28} className="text-emerald-300" />

                <div className="text-left">
                  <p className="font-semibold">Subscription Successful</p>

                  <p className="text-sm text-white/80">
                    Thank you for joining our community.
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
                <form
                  onSubmit={handleSubmit}
                  className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="h-14 flex-1 rounded-full border border-white/20 bg-white/95 px-6 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-white focus:ring-4 focus:ring-white/30"
                  />

                  <Button
                    type="submit"
                    size="lg"
                    isDisabled={submitting}
                    className="h-14 rounded-full bg-white px-8 font-semibold text-blue-600 shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-60"
                  >
                    <span className="flex items-center gap-2">
                      {submitting ? "Subscribing..." : "Subscribe"}
                      <ArrowRight size={18} />
                    </span>
                  </Button>
                </form>
                {error && (
                  <p className="mt-3 text-sm font-medium text-red-100">
                    {error}
                  </p>
                )}
              </>
            )}

            {/* Bottom Features */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/90">
              <span>✓ Weekly Updates</span>
              <span>✓ Exclusive Offers</span>
              <span>✓ No Spam</span>
              <span>✓ Unsubscribe Anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
