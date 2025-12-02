"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, BarChart3, Users, Receipt, FileText, Target, LogOut, ChevronLeft, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser, logout } from "../lib/api";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Navigation() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      const response = await getCurrentUser();
      if (response.error) {
        router.push("/login");
      } else {
        setUser(response.user);
      }
    }
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    const response = await logout();
    if (response.error) {
      toast.error("Logout failed");
    } else {
      toast.success("Logged out successfully");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
  };

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: BarChart3 },
    { href: "/expenses", label: "Expenses", icon: Receipt },
    { href: "/groups", label: "Groups", icon: Users },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/reports", label: "Reports", icon: FileText },
  ];

  const isDashboard = pathname === "/dashboard";

  return (
    <>
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-r from-blue-600 to-emerald-600 p-2 rounded-md">
                <Wallet className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Vaultly</h1>
                <p className="text-xs text-gray-500">Finance Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition"
                title="Home"
              >
                <Home size={18} />
                <span className="font-medium hidden sm:inline">Home</span>
              </Link>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Bar - Only show on dashboard */}
          {isDashboard && (
            <nav className="mt-4 flex gap-2 overflow-x-auto pb-2">{navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
                      isActive
                        ? "text-white bg-gradient-to-r from-blue-600 to-emerald-600 shadow-md"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
