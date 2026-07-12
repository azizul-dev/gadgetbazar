"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  UserCircle2,
  LogOut,
  ArrowLeft,
  Users2,
  Package,
} from "lucide-react";

const adminMenu = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users2 },
  { href: "/admin/listings", label: "All Listings", icon: Package },
  { href: "/items/add", label: "Add Item", icon: PlusCircle },
  { href: "/profile", label: "Admin Profile", icon: UserCircle2 },
];

const userMenu = [
  { href: "/items/manage", label: "My Listings", icon: ClipboardList },
  { href: "/items/add", label: "Add Item", icon: PlusCircle },
  { href: "/profile", label: "My Profile", icon: UserCircle2 },
];

export default function DashboardSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const menu = user.role === "admin" ? adminMenu : userMenu;
  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-full flex-col">
      {/* Profile summary */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 font-semibold text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {user.name}
          </p>
          <span
            className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
              user.role === "admin"
                ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {user.role}
          </span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1">
        {menu.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="mt-6 space-y-1 border-t border-gray-100 pt-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft size={17} />
          Back to site
        </Link>
        <button
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );
}
