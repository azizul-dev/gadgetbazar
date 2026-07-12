"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/gadgets", label: "Explore", icon: Compass },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const dashboardHref = user?.role === "admin" ? "/admin" : "/items/manage";

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
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label, icon: Icon }) => {
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
          <div className="hidden items-center gap-3 md:flex">
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
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut size={16} />
                  {/* Logout */}
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
            className="p-2 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="flex flex-col gap-1 pb-4 md:hidden">
            {navLinks.map(({ href, label, icon: Icon }) => {
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
                <Link
                  href={dashboardHref}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 py-2 text-sm font-medium text-white"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600"
                >
                  <LogOut size={16} />
                  {/* Logout */}
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
    </header>
  );
}
