"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, BarChart3, Users, Receipt, FileText, Target, TrendingUp, TrendingDown, Plus, ArrowUpRight, Eye, EyeOff, LogOut, Home, User } from "lucide-react";
import { getCurrentUser, logout, getUserExpenses } from "../../lib/api";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import AddExpenseModal from "../../components/AddExpenseModal";

// Sidebar Component
function Sidebar({ expenses }) { //Quick Stats
  // Calculate current month's total
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthTotal = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    })
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const monthBudget = 3000; // You can make this dynamic later
  const percentage = Math.min((monthTotal / monthBudget) * 100, 100);

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
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <Home size={18} />
          <span>Home</span>
        </Link>
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white bg-linear-to-r from-blue-600 to-emerald-600 hover:shadow-md transition">
          <BarChart3 size={18} />
          <span>Overview</span>
        </Link>
        <Link href="/expenses" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <Receipt size={18} />
          <span>Expenses</span>
        </Link>
        <Link href="/groups" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <Users size={18} />
          <span>Groups</span>
        </Link>
        <Link href="/goals" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <Target size={18} />
          <span>Goals</span>
        </Link>
        <Link href="/reports" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <FileText size={18} />
          <span>Reports</span>
        </Link>
      </nav>

      <div className="border-t border-gray-200 mt-6 pt-6">
        <p className="text-xs text-gray-500 font-medium mb-3">Quick Stats</p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">This Month</span>
            <span className="font-semibold text-gray-900">${monthTotal.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-linear-to-r from-blue-600 to-emerald-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
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

// Chart Component (Spending Trend based on real data)
function SimpleChart({ expenses }) {
  // Get last 6 months of data
  const getMonthlyData = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const monthTotal = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === month && expDate.getFullYear() === year;
        })
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      
      data.push({
        month: monthNames[month],
        value: monthTotal
      });
    }
    
    return data;
  };

  const data = getMonthlyData();
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending Trend (6 months)</h3>
      <div className="flex items-end justify-between h-64 gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-gray-200 rounded-t-lg overflow-hidden relative group">
              <div
                className="bg-linear-to-t from-blue-600 to-emerald-600 w-full transition-all duration-300 hover:opacity-80"
                style={{ height: `${(d.value / maxValue) * 200}px`, minHeight: d.value > 0 ? '8px' : '0px' }}
              ></div>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                ${d.value.toFixed(2)}
              </div>
            </div>
            <p className="text-xs text-gray-600 font-medium">{d.month}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Category Breakdown Component
function CategoryBreakdown({ expenses }) {
  // Calculate category totals
  const categoryTotals = expenses.reduce((acc, exp) => {
    const category = exp.category || 'Other';
    acc[category] = (acc[category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const totalAmount = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  
  // Convert to array and sort by amount
  const categories = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0,
      color: getCategoryColor(name)
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5); // Top 5 categories

  function getCategoryColor(category) {
    const colors = {
      'food': 'bg-blue-600',
      'transport': 'bg-emerald-600',
      'entertainment': 'bg-purple-600',
      'utilities': 'bg-amber-600',
      'shopping': 'bg-pink-600',
      'healthcare': 'bg-red-600'
    };
    return colors[category.toLowerCase()] || 'bg-gray-600';
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h3>
        <p className="text-gray-500 text-center py-12">No expenses yet. Start adding expenses to see breakdown.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h3>
      <div className="space-y-4">
        {categories.map((cat, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
              <span className="text-sm font-semibold text-gray-900">${cat.amount.toFixed(2)}</span>
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
function RecentTransactions({ expenses }) {
  // Get the 5 most recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const getRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'food': '🍽️',
      'transport': '🚗',
      'entertainment': '🎬',
      'utilities': '💡',
      'shopping': '🛒',
      'healthcare': '🏥'
    };
    return icons[category?.toLowerCase()] || '💰';
  };

  if (recentExpenses.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <Link href="/expenses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</Link>
        </div>
        <p className="text-gray-500 text-center py-12">No transactions yet. Add your first expense!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <Link href="/expenses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</Link>
      </div>
      <div className="space-y-3">
        {recentExpenses.map((exp) => (
          <div key={exp.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getCategoryIcon(exp.category)}</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{exp.description || 'No description'}</p>
                <p className="text-xs text-gray-500">{getRelativeDate(exp.date)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm text-gray-900">-${parseFloat(exp.amount).toFixed(2)}</p>
              <p className="text-xs text-gray-500">{exp.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const userResponse = await getCurrentUser();
      if (userResponse.error) {
        router.push('/login');
      } else {
        setUser(userResponse.user);
        
        // Fetch expenses
        const expensesResponse = await getUserExpenses();
        if (!expensesResponse.error) {
          setExpenses(expensesResponse.expenses || []);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    const response = await logout();
    if (response.error) {
      toast.error('Logout failed');
    } else {
      toast.success('Logged out successfully');
      setTimeout(() => router.push('/login'), 1000);
    }
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
  };

  // Calculate statistics
  const calculateStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = new Date(currentYear, currentMonth - 1, 1);
    
    // Current month expenses
    const currentMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
    
    // Last month expenses
    const lastMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === lastMonth.getMonth() && expDate.getFullYear() === lastMonth.getFullYear();
    });
    
    // Current week (last 7 days)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const currentWeekExpenses = expenses.filter(exp => new Date(exp.date) >= weekAgo);
    
    // Previous week
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const lastWeekExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= twoWeeksAgo && expDate < weekAgo;
    });
    
    const monthTotal = currentMonthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const weekTotal = currentWeekExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const lastWeekTotal = lastWeekExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    
    const monthChange = lastMonthTotal > 0 ? (((monthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1) : 0;
    const weekChange = lastWeekTotal > 0 ? (((weekTotal - lastWeekTotal) / lastWeekTotal) * 100).toFixed(1) : 0;
    
    return {
      monthTotal,
      weekTotal,
      totalExpenses,
      monthChange,
      weekChange,
      isMonthPositive: monthChange < 0, // Less spending is positive
      isWeekPositive: weekChange < 0
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
                <Wallet className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Vaultly</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-linear-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Plus size={18} />
                Add Expense
              </button>
              {user && (
                <div className="flex items-center gap-3">
                  <Link href="/profile">
                    <div className="flex items-center gap-3 bg-linear-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg px-4 py-2 hover:shadow-md transition cursor-pointer">
                      <div className="bg-linear-to-r from-blue-600 to-emerald-600 p-2 rounded-full">
                        <User className="text-white" size={16} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
                      </div>
                    </div>
                  </Link>
                  <div className="relative group">
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                    >
                      <LogOut size={20} />
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-500 pointer-events-none">
                      Logout
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <Sidebar expenses={expenses} />
            </aside>

            {/* Main Dashboard Content */}
            <main className="lg:col-span-3 space-y-6">
            {/* Balance Card */}
            <div className="bg-linear-to-r from-blue-600 to-emerald-600 rounded-xl p-8 text-white shadow-lg">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Total Expenses</p>
                  <div className="flex items-center gap-3">
                    <p className="text-4xl font-bold">{hideBalance ? "****" : `$${stats.totalExpenses.toFixed(2)}`}</p>
                    <button onClick={() => setHideBalance(!hideBalance)} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition">
                      {hideBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className={`flex items-center gap-2 justify-end ${stats.isMonthPositive ? 'text-emerald-100' : 'text-red-100'}`}>
                    {stats.isMonthPositive ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                    <span className="text-sm font-semibold">{Math.abs(stats.monthChange)}%</span>
                  </div>
                  <p className="text-blue-100 text-xs">vs last month</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-100 text-xs font-medium mb-1">This Month</p>
                  <p className="text-2xl font-bold">${stats.monthTotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs font-medium mb-1">This Week</p>
                  <p className="text-2xl font-bold">${stats.weekTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <KPICard icon={TrendingUp} label="This Month" value={`$${stats.monthTotal.toFixed(2)}`} change={Math.abs(stats.monthChange)} isPositive={stats.isMonthPositive} color="blue" />
              <KPICard icon={TrendingDown} label="This Week" value={`$${stats.weekTotal.toFixed(2)}`} change={Math.abs(stats.weekChange)} isPositive={stats.isWeekPositive} color="emerald" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SimpleChart expenses={expenses} />
              <CategoryBreakdown expenses={expenses} />
            </div>

            {/* Recent Transactions */}
            <RecentTransactions expenses={expenses} />
          </main>
        </div>
      </div>
    </div>
    
      {/* Add Expense Modal */}
      <AddExpenseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExpenseAdded={handleExpenseAdded}
      />
    </>
  );
}
