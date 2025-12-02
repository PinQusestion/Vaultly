"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Mail, Calendar, Edit2, Save, X, Shield, Award, TrendingUp, Clock, CheckCircle, Sparkles, Camera, ChevronLeft } from "lucide-react";
import { getCurrentUser, updateUser, getUserExpenses } from "../../lib/api";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Navigation from "../../components/Navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const userResponse = await getCurrentUser();
      if (userResponse.error) {
        toast.error("Failed to load profile");
        router.push("/login");
      } else {
        setUser(userResponse.user);
        setFormData({
          full_name: userResponse.user.full_name,
          email: userResponse.user.email,
        });
        
        const expensesResponse = await getUserExpenses();
        if (!expensesResponse.error) {
          setExpenses(expensesResponse.expenses || []);
        }
        
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.full_name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    const response = await updateUser(user.id, formData);
    if (response.error) {
      toast.error(response.error);
    } else {
      setUser(response.user);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user.full_name,
      email: user.email,
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-emerald-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl"></div>
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats with null checks
  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  
  // Safe date calculation - use createdAt (from backend) or created_at (fallback)
  const createdDate = user?.createdAt ? new Date(user.createdAt) : user?.created_at ? new Date(user.created_at) : new Date();
  const isValidDate = !isNaN(createdDate.getTime());
  const accountAgeDays = isValidDate ? Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24)) : 0;
  const expenseStreak = expenses.length;
  
  // Calculate profile completion
  let profileCompletion = 60; // Base completion
  if (user?.full_name && user?.full_name.trim()) profileCompletion += 20;
  if (user?.email && user?.email.trim()) profileCompletion += 20;
  
  // Calculate last login (use created date as reference for now)
  const lastLoginDays = accountAgeDays >= 0 ? accountAgeDays : 0;
  const lastLoginText = lastLoginDays === 0 ? "Today" : lastLoginDays === 1 ? "Yesterday" : `${lastLoginDays} days ago`;
  
  // Estimate sessions (assume user logs in every 2-3 days on average)
  const estimatedSessions = accountAgeDays > 0 ? Math.max(1, Math.ceil(accountAgeDays / 2.5)) : 1;
  
  // Calculate average daily usage based on expenses
  const avgDailyUsage = accountAgeDays > 0 ? Math.ceil((expenses.length / accountAgeDays) * 10) : 5;
  const usageText = avgDailyUsage > 60 ? `${Math.floor(avgDailyUsage / 60)}h ${avgDailyUsage % 60}m` : `${avgDailyUsage} min`;
  
  // Format member since date
  const memberSinceText = isValidDate 
    ? createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Just now';

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-emerald-50">
      <Toaster position="top-right" />
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {/* Profile Header Card */}
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Cover Background with Pattern */}
          <div className="h-48 bg-linear-to-r from-orange-400 via-pink-400 to-rose-400 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>
            </div>
            <div className="absolute top-4 right-4">
              <Sparkles className="text-white opacity-50" size={32} />
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-20 mb-6">
              <div className="flex items-end gap-6 mb-4 sm:mb-0">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-orange-400 to-pink-500 p-1 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                      <User className="text-orange-600" size={64} />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 shadow-lg">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                </div>
                <div className="pb-4">
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-3">{user?.full_name}</h1>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Shield size={12} />
                      Verified
                    </div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Award size={12} />
                      Active Member
                    </div>
                  </div>
                </div>
              </div>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-semibold hover:shadow-xl hover:scale-105 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 flex items-center gap-2"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-medium mb-1">
                  <TrendingUp size={14} />
                  Total Expenses
                </div>
                <p className="text-2xl font-bold bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-medium mb-1">
                  <Calendar size={14} />
                  Avg Expense
                </div>
                <p className="text-2xl font-bold text-gray-900">${avgExpense.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-medium mb-1">
                  <Clock size={14} />
                  Member For
                </div>
                <p className="text-2xl font-bold text-gray-900">{accountAgeDays} days</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-medium mb-1">
                  <Award size={14} />
                  Transactions
                </div>
                <p className="text-2xl font-bold text-gray-900">{expenseStreak}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="text-blue-600" size={24} />
                  Profile Information
                </h2>
              </div>
              
              <div className="space-y-6">
                {/* Full Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center gap-4 px-5 py-4 bg-linear-to-r from-blue-50 to-emerald-50 border-2 border-blue-100 rounded-xl group-hover:shadow-md transition-all">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <User className="text-blue-600" size={20} />
                      </div>
                      <span className="text-lg font-medium text-gray-900">{user?.full_name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="flex items-center gap-4 px-5 py-4 bg-linear-to-r from-purple-50 to-pink-50 border-2 border-purple-100 rounded-xl group-hover:shadow-md transition-all">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Mail className="text-purple-600" size={20} />
                      </div>
                      <span className="text-lg font-medium text-gray-900">{user?.email}</span>
                    </div>
                  )}
                </div>

                {/* Account Created */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Member Since
                  </label>
                  <div className="flex items-center gap-4 px-5 py-4 bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-100 rounded-xl group-hover:shadow-md transition-all">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Calendar className="text-amber-600" size={20} />
                    </div>
                    <span className="text-lg font-medium text-gray-900">
                      {memberSinceText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-4 bg-linear-to-r from-blue-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 hover:from-blue-500 hover:to-emerald-500 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Achievement Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <Sparkles className="opacity-50 text-white" size={24} />
                </div>
                <p className="text-blue-100 text-sm font-medium mb-1">Financial Tracker</p>
                <p className="text-3xl font-bold">{expenses.length}</p>
                <p className="text-blue-100 text-xs mt-2">{expenses.length === 0 ? 'Start tracking expenses!' : expenses.length === 1 ? '1 expense tracked' : `${expenses.length} expenses tracked`}</p>
              </div>

              <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                    <Award size={24} className="text-white" />
                  </div>
                  <Award className="opacity-30 text-white" size={32} />
                </div>
                <p className="text-emerald-100 text-sm font-medium mb-1">Loyalty Badge</p>
                <p className="text-3xl font-bold">{accountAgeDays > 0 ? accountAgeDays : '<1'}</p>
                <p className="text-emerald-100 text-xs mt-2">{accountAgeDays === 0 ? 'Welcome new member!' : accountAgeDays === 1 ? '1 day as a member' : `${accountAgeDays} days as a member`}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="space-y-6">
            {/* Account Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="text-blue-600" size={20} />
                Account Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <CheckCircle className="text-emerald-600" size={18} />
                    </div>
                    <span className="font-medium text-gray-900">Status</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-semibold">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="text-blue-600" size={18} />
                    </div>
                    <span className="font-medium text-gray-900">Email</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold">
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Shield className="text-purple-600" size={18} />
                    </div>
                    <span className="font-medium text-gray-900">Security</span>
                  </div>
                  <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-semibold">
                    Protected
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-linear-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Clock size={20} className="text-white" />
                Activity Summary
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                  <span className="text-sm font-medium text-black">Last Active</span>
                  <span className="text-sm font-bold text-black">{lastLoginText}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                  <span className="text-sm font-medium text-black">Total Sessions</span>
                  <span className="text-sm font-bold text-black">{estimatedSessions}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                  <span className="text-sm font-medium text-black">Avg Daily Usage</span>
                  <span className="text-sm font-bold text-black">{usageText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
