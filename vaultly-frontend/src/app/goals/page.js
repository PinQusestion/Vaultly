"use client";

import Navigation from "../../components/Navigation";

export default function GoalsPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Financial Goals</h2>
              <p className="text-gray-600 mt-1">Track and achieve your savings goals</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-500 text-center py-12">Goals feature coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
