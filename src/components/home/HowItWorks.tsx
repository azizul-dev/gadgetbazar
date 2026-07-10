"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  Camera,
  Handshake,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create an Account",
    desc: "Sign up for free in just a few seconds and start exploring the marketplace.",
  },
  {
    icon: Camera,
    title: "Post Your Gadget",
    desc: "Upload high-quality photos, add details, and publish your listing instantly.",
  },
  {
    icon: Handshake,
    title: "Buy or Sell Securely",
    desc: "Connect with trusted buyers or sellers and complete your deal with confidence.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50" />

      {/* Blur Orbs */}
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700">
            <Sparkles size={16} />
            Simple Process
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Buy & Sell in
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
              {" "}
              3 Easy Steps
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Start buying or selling gadgets in minutes with our fast,
            secure, and hassle-free marketplace experience.
          </p>
        </motion.div>

        {/* Desktop Connector */}
        <div className="absolute left-1/2 top-[330px] hidden w-[62%] -translate-x-1/2 lg:block">
          <div className="border-t-2 border-dashed border-blue-200" />
        </div>

        {/* Cards */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -12,
                  scale: 1.02,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.15,
                }}
                className="group relative"
              >
                {/* Glow */}
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-blue-500/10 via-cyan-400/10 to-sky-500/10 opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />

                <div className="relative rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-lg backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                  {/* Step Number */}
                  <div className="absolute right-6 top-6 text-6xl font-black text-gray-100 transition group-hover:text-blue-100">
                    0{index + 1}
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.08 }}
                    className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 text-white shadow-xl"
                  >
                    <Icon size={34} />
                  </motion.div>

                  <span className="rounded-full bg-blue-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
                    Step {index + 1}
                  </span>

                  <h3 className="mt-5 text-2xl font-bold text-gray-900">
                    {step.title}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-600">
                    {step.desc}
                  </p>

                  <motion.div
                    whileHover={{ x: 6 }}
                    className="mt-8 flex items-center gap-2 font-semibold text-blue-600"
                  >
                    Learn More
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}