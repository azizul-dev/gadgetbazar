"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  Home,
  Compass,
  Info,
  Phone,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  UserCircle,
  PlusCircle,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/gadgets", label: "Explore", icon: Compass },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
];

// লগইন করা থাকলে এই দুটো এক্সট্রা রুট যোগ হয়
const authNavLinks = [
  { href: "/items/add", label: "Sell Item", icon: PlusCircle },
  { href: "/items/manage", label: "My Listings", icon: ClipboardList },
];

// পেজ যেগুলো নিজস্ব DashboardShell/Sidebar ব্যবহার করে — এখানে টপ Navbar দেখানোর দরকার নেই
const HIDDEN_NAVBAR_PREFIXES = ["/admin", "/items/manage", "/profile"];

function BlackHoleIcon({ size = 34 }: { size?: number }) {
  return (
    <motion.div
      className="relative shrink-0 rounded-full"
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #0f172a, #2563EB, #0D9488, #0f172a)",
        }}
      />
      <div
        className="absolute rounded-full bg-black"
        style={{
          inset: "22%",
          boxShadow: "0 0 10px 2px rgba(37, 99, 235, 0.55)",
        }}
      />
    </motion.div>
  );
}

function BlackHoleOverlayWrapper({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center overflow-hidden">
      <motion.div
        className="rounded-full"
        style={{
          width: 30,
          height: 30,
          background:
            "radial-gradient(circle, #000 0%, #0f172a 20%, #2563EB 35%, #0D9488 50%, #000 72%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 160, opacity: 1, rotate: 540 }}
        transition={{ duration: 0.9, ease: [0.6, 0, 0.9, 0.2] }}
        onAnimationComplete={onComplete}
      />
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const dashboardHref = user?.role === "admin" ? "/admin" : "/items/manage";

  useEffect(() => {
    if (pendingHref && pathname === pendingHref) {
      setIsTransitioning(false);
      setPendingHref(null);
    }
  }, [pathname, pendingHref]);

  const hideNavbar = HIDDEN_NAVBAR_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (hideNavbar) return null;

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isTransitioning) return;
    setPendingHref(dashboardHref);
    setIsTransitioning(true);
  };

  const handleOverlayAnimationComplete = () => {
    router.push(dashboardHref);
  };

  // লগইন থাকলে এক্সট্রা রুটগুলো যোগ হবে — মিনিমাম ৫+ রুট নিশ্চিত করার জন্য
  const visibleLinks = user ? [...navLinks, ...authNavLinks] : navLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-xl font-bold text-transparent">
              Gadget
            </span>
            <span className="text-xl font-bold text-gray-900">Bazar</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-1 lg:flex">
            {visibleLinks.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Section */}
          <div className="hidden items-center gap-3 lg:flex">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded-full bg-gray-100" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">
                  <UserCircle size={18} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleDashboardClick}
                  aria-label="Go to Dashboard"
                  title="Dashboard"
                  className="relative flex items-center justify-center rounded-full p-1 transition-transform hover:scale-110"
                >
                  <BlackHoleIcon size={34} />
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      isActive("/login") ? "bg-blue-50 text-blue-600" : ""
                    }
                  >
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <LogIn size={16} />
                      Login
                    </span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className={`border-0 text-white transition-opacity hover:opacity-90 ${
                      isActive("/register")
                        ? "bg-gradient-to-r from-blue-700 to-teal-600 ring-2 ring-blue-300"
                        : "bg-gradient-to-r from-blue-600 to-teal-500"
                    }`}
                  >
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <UserPlus size={16} />
                      Register
                    </span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="flex flex-col gap-1 pb-4 lg:hidden">
            {visibleLinks.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                    active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}

            {loading ? (
              <div className="mt-3 h-10 w-full animate-pulse rounded-lg bg-gray-100" />
            ) : user ? (
              <div className="flex flex-col gap-2 pt-3">
                <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                  <UserCircle size={18} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    handleDashboardClick(e);
                    setIsOpen(false);
                  }}
                  aria-label="Go to Dashboard"
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-100 py-2 text-sm font-medium text-gray-800"
                >
                  <BlackHoleIcon size={26} />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-3">
                <Link href="/login" className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <LogIn size={16} />
                      Login
                    </span>
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button
                    size="sm"
                    className="w-full border-0 bg-gradient-to-r from-blue-600 to-teal-500 text-white"
                  >
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <UserPlus size={16} />
                      Register
                    </span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {isTransitioning && (
        <BlackHoleOverlayWrapper onComplete={handleOverlayAnimationComplete} />
      )}
    </header>
  );
}
