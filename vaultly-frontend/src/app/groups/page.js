"use client";

import Navigation from "../../components/Navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function GroupsPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back to Dashboard */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </Link>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Groups</h2>
              <p className="text-gray-600 mt-1">Manage shared expenses with groups</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-500 text-center py-12">Groups feature coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
