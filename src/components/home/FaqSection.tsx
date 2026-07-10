"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const faqs = [
  {
    question: "Do I need an account to sell a gadget?",
    answer:
      "Yes. Creating a free account is required before publishing any listing. However, you can browse all available gadgets without signing up.",
  },
  {
    question: "How does the payment process work?",
    answer:
      "Buyers and sellers communicate directly through the platform. Payments are completed between both parties using their preferred secure payment method.",
  },
  {
    question: "Is there a limit on how many gadgets I can post?",
    answer:
      "No. You can publish as many gadget listings as you like without any restrictions.",
  },
  {
    question: "Can I edit or remove my listing later?",
    answer:
      "Absolutely. You can update, edit, or permanently delete any of your listings at any time from your dashboard.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50" />

      {/* Blur Effects */}
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700">
            <Sparkles size={16} />
            Support Center
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Frequently Asked
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
              {" "}
              Questions
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Everything you need to know about buying, selling, and managing
            gadgets on our marketplace.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                className="group overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-2xl"
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? -1 : index)
                  }
                  className="flex w-full items-center justify-between px-8 py-7 text-left"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 text-white shadow-lg">
                      <HelpCircle size={24} />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>

                  <motion.div
                    animate={{
                      rotate: isOpen ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="rounded-full bg-gray-100 p-2"
                  >
                    <ChevronDown
                      size={22}
                      className="text-gray-600"
                    />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-100 px-8 py-6">
                        <div className="flex gap-4">
                          <ShieldCheck
                            size={22}
                            className="mt-1 shrink-0 text-emerald-500"
                          />

                          <p className="leading-8 text-gray-600">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Card */}
        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3,
          }}
          className="mt-20"
        >
          <div className="rounded-[32px] border border-white/70 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 p-10 text-center shadow-2xl">
            <h3 className="text-3xl font-black text-white">
              Still Have Questions?
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-white/90 leading-7">
              Our support team is always ready to help you with buying,
              selling, account management, or any technical questions you
              may have.
            </p>

            <button className="mt-8 rounded-full bg-white px-8 py-3 font-semibold text-blue-600 transition-all duration-300 hover:scale-105">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}