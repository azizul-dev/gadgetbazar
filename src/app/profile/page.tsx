"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import {
  Mail,
  ShieldCheck,
  User as UserIcon,
  Loader2,
  Calendar,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="text-blue-600" size={28} />
        </motion.div>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const title = isAdmin ? "Admin Profile" : "My Profile";

  const infoRows = [
    { icon: UserIcon, label: "Full Name", value: user.name },
    { icon: Mail, label: "Email Address", value: user.email },
    {
      icon: ShieldCheck,
      label: "Account Role",
      value: user.role,
      capitalize: true,
    },
  ];

  return (
    <DashboardShell title={title}>
      <div className="relative">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-16 left-10 h-64 w-64 rounded-full bg-blue-300/20 blur-[100px]" />
        <div className="pointer-events-none absolute top-32 right-0 h-64 w-64 rounded-full bg-teal-300/20 blur-[100px]" />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg shadow-blue-500/25">
              <UserIcon className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {title}
              </h1>
              <p className="text-sm text-gray-500">
                Manage your account information
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 lg:grid-cols-5"
          >
            {/* Hero card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-blue-600 via-sky-500 to-teal-500 p-8 shadow-xl shadow-blue-500/20 lg:col-span-2"
            >
              {/* decorative glow */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              />
              <motion.div
                animate={{ scale: [1.1, 1, 1.1] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"
              />

              <div className="relative flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 14,
                    delay: 0.2,
                  }}
                  className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-white/15 text-4xl font-bold text-white shadow-lg backdrop-blur-sm"
                >
                  {user.name.charAt(0).toUpperCase()}
                </motion.div>

                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="mt-1 text-sm text-blue-50/90">{user.email}</p>

                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-xs font-semibold capitalize text-white backdrop-blur-sm"
                >
                  {isAdmin ? <Sparkles size={13} /> : <BadgeCheck size={13} />}
                  {user.role}
                </motion.span>
              </div>
            </motion.div>

            {/* Info card */}
            <motion.div
              variants={itemVariants}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-3"
            >
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Account Details
              </h3>

              <div className="space-y-1">
                {infoRows.map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                    className="flex items-center gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 text-blue-600">
                      <row.icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">{row.label}</p>
                      <p
                        className={`truncate text-sm font-semibold text-gray-800 ${
                          row.capitalize ? "capitalize" : ""
                        }`}
                      >
                        {row.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-5 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs text-blue-700"
              >
                <Calendar size={14} />
                <span>
                  {isAdmin
                    ? "You have full administrative access to GadgetBazar."
                    : "You can manage your listings anytime from the sidebar."}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  );
}
