"use client";

import Link from "next/link";
import { Wallet, BarChart3, Receipt, Users, Target, FileText, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser, logout } from "../lib/api";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Navigation() {
  const [user, setUser] = useState(null);
  const router = useRouter();

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

  return (
    <>
      <Toaster position="top-right" />
      
      {/* Header for Subpages */}
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
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                title="Dashboard"
              >
                <BarChart3 size={18} />
                <span className="font-medium hidden sm:inline">Dashboard</span>
              </Link>
              <Link
                href="/expenses"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                title="Expenses"
              >
                <Receipt size={18} />
                <span className="font-medium hidden sm:inline">Expenses</span>
              </Link>
              <Link
                href="/groups"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                title="Groups"
              >
                <Users size={18} />
                <span className="font-medium hidden sm:inline">Groups</span>
              </Link>
              <Link
                href="/goals"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                title="Goals"
              >
                <Target size={18} />
                <span className="font-medium hidden sm:inline">Goals</span>
              </Link>
              <Link
                href="/reports"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                title="Reports"
              >
                <FileText size={18} />
                <span className="font-medium hidden sm:inline">Reports</span>
              </Link>
              <div className="border-l border-gray-300 h-8 mx-2"></div>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                title="Profile"
              >
                <User size={18} />
                <span className="font-medium hidden sm:inline">{user?.fullName || user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
