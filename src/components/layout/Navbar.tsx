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
  PlusCircle,
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

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Gadget
            </span>
            <span className="text-xl font-bold text-gray-900">Bazar</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full transition-colors ${
                    active
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              // ইউজার তথ্য লোড হওয়ার সময় ছোট্ট স্কেলিটন দেখাবে
              <div className="w-24 h-8 rounded-full bg-gray-100 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/items/add"
                  className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 transition-opacity"
                >
                  <PlusCircle size={16} />
                  Sell Now
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                  <UserCircle size={18} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      isActive("/login") ? "text-blue-600 bg-blue-50" : ""
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
                    className={`text-white border-0 hover:opacity-90 transition-opacity ${
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
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg ${
                    active ? "text-blue-600 bg-blue-50" : "text-gray-700"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}

            {loading ? (
              <div className="w-full h-10 rounded-lg bg-gray-100 animate-pulse mt-3" />
            ) : user ? (
              <div className="flex flex-col gap-2 pt-3">
                <Link
                  href="/items/add"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-teal-500"
                >
                  <PlusCircle size={16} />
                  Sell Now
                </Link>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
                  <UserCircle size={18} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg text-red-600 bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
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
                    className="w-full text-white bg-gradient-to-r from-blue-600 to-teal-500 border-0"
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
