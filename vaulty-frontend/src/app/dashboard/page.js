"use client";

import Link from "next/link";
import { Wallet, BarChart3, Users, Search, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// Sidebar Component
function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md sticky top-20 h-fit">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-r from-blue-600 to-emerald-600 p-2 rounded-md">
            <Wallet className="text-white" size={20} />
          </div>
          <div>
            <h4 className="text-lg font-semibold">Vaultly</h4>
            <p className="text-xs text-gray-500">Finance Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white bg-linear-to-r from-blue-600 to-emerald-600 hover:shadow-md transition">
          <BarChart3 size={18} />
          <span>Overview</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <Users size={18} />
          <span>Groups</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <Search size={18} />
          <span>Transactions</span>
        </Link>
      </nav>

      <div className="border-t border-gray-200 mt-6 pt-6">
        <p className="text-xs text-gray-500 font-medium mb-3">Quick Stats</p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">This Month</span>
            <span className="font-semibold text-gray-900">$2,450</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-linear-to-r from-blue-600 to-emerald-600 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// KPI Card Component
function KPICard({ icon: Icon, label, value, change, isPositive = true, color = "blue" }) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200",
    emerald: "from-emerald-50 to-emerald-100 border-emerald-200",
    purple: "from-purple-50 to-purple-100 border-purple-200",
    amber: "from-amber-50 to-amber-100 border-amber-200",
  };

  return (
    <div className={`bg-linear-to-br ${colorClasses[color]} border rounded-xl p-6 hover:shadow-md transition`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-linear-to-r ${color === "blue" ? "from-blue-600 to-blue-700" : color === "emerald" ? "from-emerald-600 to-emerald-700" : color === "purple" ? "from-purple-600 to-purple-700" : "from-amber-600 to-amber-700"} text-white`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {change}%
        </div>
      </div>
      <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// Chart Component (Simple placeholder bar chart)
function SimpleChart() {
  const data = [
    { month: "Jan", value: 2400 },
    { month: "Feb", value: 1398 },
    { month: "Mar", value: 3200 },
    { month: "Apr", value: 2780 },
    { month: "May", value: 1890 },
    { month: "Jun", value: 2390 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending Trend (6 months)</h3>
      <div className="flex items-end justify-between h-64 gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-gray-200 rounded-t-lg overflow-hidden">
              <div
                className="bg-linear-to-t from-blue-600 to-emerald-600 w-full transition-all duration-300 hover:opacity-80"
                style={{ height: `${(d.value / maxValue) * 200}px` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 font-medium">{d.month}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Category Breakdown Component
function CategoryBreakdown() {
  const categories = [
    { name: "Food & Dining", amount: 480, percentage: 32, color: "bg-blue-600" },
    { name: "Transportation", amount: 320, percentage: 21, color: "bg-emerald-600" },
    { name: "Entertainment", amount: 240, percentage: 16, color: "bg-purple-600" },
    { name: "Utilities", amount: 180, percentage: 12, color: "bg-amber-600" },
    { name: "Other", amount: 280, percentage: 19, color: "bg-pink-600" },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h3>
      <div className="space-y-4">
        {categories.map((cat, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
              <span className="text-sm font-semibold text-gray-900">${cat.amount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`${cat.color} h-2 rounded-full transition-all duration-300`} style={{ width: `${cat.percentage}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{cat.percentage}% of total</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Recent Transactions Component
function RecentTransactions() {
  const transactions = [
    { id: 1, desc: "Grocery Shopping", amount: -56.20, category: "Food", icon: "🛒", date: "Today" },
    { id: 2, desc: "Salary Deposit", amount: 3500.00, category: "Income", icon: "💰", date: "Yesterday" },
    { id: 3, desc: "Netflix Subscription", amount: -15.99, category: "Entertainment", icon: "🎬", date: "2 days ago" },
    { id: 4, desc: "Gas Station", amount: -45.50, category: "Transport", icon: "⛽", date: "3 days ago" },
    { id: 5, desc: "Restaurant", amount: -84.70, category: "Food", icon: "🍽️", date: "4 days ago" },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <Link href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</Link>
      </div>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{tx.icon}</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{tx.desc}</p>
                <p className="text-xs text-gray-500">{tx.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold text-sm ${tx.amount > 0 ? "text-emerald-600" : "text-gray-900"}`}>
                {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{tx.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [hideBalance, setHideBalance] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Search size={20} className="text-gray-600" />
            </button>
            <button className="px-4 py-2 bg-linear-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition">
              <Plus size={18} className="inline mr-2" />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Sidebar />
          </aside>

          {/* Main Dashboard */}
          <main className="lg:col-span-3 space-y-6">
            {/* Balance Card */}
            <div className="bg-linear-to-r from-blue-600 to-emerald-600 rounded-xl p-8 text-white shadow-lg">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Total Balance</p>
                  <div className="flex items-center gap-3">
                    <p className="text-4xl font-bold">{hideBalance ? "****" : "$4,256.50"}</p>
                    <button onClick={() => setHideBalance(!hideBalance)} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition">
                      {hideBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="flex items-center gap-2 justify-end text-emerald-100">
                    <ArrowUpRight size={16} />
                    <span className="text-sm font-semibold">+12.5%</span>
                  </div>
                  <p className="text-blue-100 text-xs">vs last month</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-100 text-xs font-medium mb-1">Income</p>
                  <p className="text-2xl font-bold">$3,500</p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs font-medium mb-1">Expenses</p>
                  <p className="text-2xl font-bold">$1,243.50</p>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <KPICard icon={TrendingUp} label="This Month" value="$1,243.50" change="8.5" isPositive={false} color="blue" />
              <KPICard icon={TrendingDown} label="This Week" value="$340" change="12.3" isPositive={false} color="emerald" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SimpleChart />
              <CategoryBreakdown />
            </div>

            {/* Recent Transactions */}
            <RecentTransactions />
          </main>
        </div>
      </div>
    </div>
  );
}
