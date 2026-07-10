"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@heroui/react";
import { Home, Compass, Info, Phone, Menu, X, LogIn, UserPlus } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/gadgets", label: "Explore", icon: Compass },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // "/" এর জন্য exact match লাগবে, বাকি রুটের জন্য startsWith দিয়ে চেক করলে nested পেজেও active থাকবে
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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className={isActive("/login") ? "text-blue-600 bg-blue-50" : ""}
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
          </div>
        )}
      </div>
    </header>
  );
}