'use client'
import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { 
  getSpendingOverview, 
  getMonthlyTrends, 
  getTopExpenses,
  getGroupAnalytics,
  getGoalsProgressAnalytics,
  getComparisonData 
} from '../../lib/api';
import toast from 'react-hot-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PieChart,
  BarChart3,
  Target,
  Users,
  Download
} from 'lucide-react';

export default function ReportsPage() {
  const [userName, setUserName] = useState('Guest');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [topExpenses, setTopExpenses] = useState([]);
  const [groupAnalytics, setGroupAnalytics] = useState([]);
  const [goalsProgress, setGoalsProgress] = useState(null);
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    try {
    const [overviewRes, trendsRes, topExpensesRes, groupAnalyticsRes, goalsRes, comparisonRes] = await Promise.all([
      getSpendingOverview(),
      getMonthlyTrends(6),
      getTopExpenses(5),
      getGroupAnalytics(),
      getGoalsProgressAnalytics(),
      getComparisonData(timeRange)
    ]);      console.log('Analytics responses:', {
        overview: overviewRes,
        trends: trendsRes,
        topExpenses: topExpensesRes,
        groupAnalytics: groupAnalyticsRes,
        goals: goalsRes,
        comparison: comparisonRes
      });

      if (overviewRes?.error) {
        toast.error('Failed to load spending overview');
      } else if (overviewRes?.success) {
        setOverview(overviewRes.data);
      }

      if (trendsRes?.success) setTrends(trendsRes.data);
      if (topExpensesRes?.success) setTopExpenses(topExpensesRes.data);
      if (groupAnalyticsRes?.success) setGroupAnalytics(groupAnalyticsRes.data);
      if (goalsRes?.success) setGoalsProgress(goalsRes.data);
      if (comparisonRes?.success) setComparison(comparisonRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-emerald-500 to-emerald-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
      'from-red-500 to-red-600'
    ];
    return colors[index % colors.length];
  };

  const getCategoryBgColor = (index) => {
    const colors = [
      'bg-blue-50',
      'bg-emerald-50',
      'bg-purple-50',
      'bg-orange-50',
      'bg-pink-50',
      'bg-indigo-50',
      'bg-teal-50',
      'bg-red-50'
    ];
    return colors[index % colors.length];
  };

  const getCategoryTextColor = (index) => {
    const colors = [
      'text-blue-700',
      'text-emerald-700',
      'text-purple-700',
      'text-orange-700',
      'text-pink-700',
      'text-indigo-700',
      'text-teal-700',
      'text-red-700'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-emerald-50">
      <Navigation userName={userName} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with animation */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 text-lg">Visualize your spending patterns and financial insights</p>
        </div>

        {/* Time Range Selector with animation */}
        <div className="flex gap-3 mb-8 animate-slide-up">
          <button
            onClick={() => setTimeRange('month')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              timeRange === 'month'
                ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            <Calendar className="inline-block mr-2" size={18} />
            This Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              timeRange === 'year'
                ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            <Calendar className="inline-block mr-2" size={18} />
            This Year
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* No Data Message */}
            {!comparison && !overview && trends.length === 0 && topExpenses.length === 0 && !goalsProgress && groupAnalytics.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
                <p className="text-gray-600 mb-4">
                  Start adding expenses, creating goals, and joining groups to see your analytics here!
                </p>
              </div>
            )}

            {/* Comparison Cards */}
            {comparison && (
              <div className="grid md:grid-cols-3 gap-6 animate-slide-up">
                {/* Current Period */}
                <div className="group bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                      Current {comparison.period === 'month' ? 'Month' : 'Year'}
                    </h3>
                    <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                      <Calendar className="text-white" size={20} />
                    </div>
                  </div>
                  <p className="text-4xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    ${comparison.current.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-600 mt-2 font-medium">{comparison.current.count} expenses</p>
                </div>

                {/* Previous Period */}
                <div className="group bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Previous {comparison.period === 'month' ? 'Month' : 'Year'}
                    </h3>
                    <div className="p-2 bg-gray-600 rounded-lg group-hover:scale-110 transition-transform">
                      <Calendar className="text-white" size={20} />
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-gray-800">
                    ${comparison.previous.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 font-medium">{comparison.previous.count} expenses</p>
                </div>

                {/* Change */}
                <div className={`group rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border-2 ${
                  comparison.change.percentage >= 0 
                    ? 'bg-linear-to-br from-red-50 to-red-100 border-red-200' 
                    : 'bg-linear-to-br from-emerald-50 to-emerald-100 border-emerald-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-sm font-semibold uppercase tracking-wide ${
                      comparison.change.percentage >= 0 ? 'text-red-700' : 'text-emerald-700'
                    }`}>Change</h3>
                    <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${
                      comparison.change.percentage >= 0 ? 'bg-red-600' : 'bg-emerald-600'
                    }`}>
                      {comparison.change.percentage >= 0 ? (
                        <TrendingUp className="text-white" size={20} />
                      ) : (
                        <TrendingDown className="text-white" size={20} />
                      )}
                    </div>
                  </div>
                  <p className={`text-4xl font-bold ${
                    comparison.change.percentage >= 0 
                      ? 'bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent' 
                      : 'bg-linear-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent'
                  }`}>
                    {comparison.change.percentage >= 0 ? '+' : ''}{comparison.change.percentage.toFixed(1)}%
                  </p>
                  <p className={`text-sm mt-2 font-medium ${
                    comparison.change.percentage >= 0 ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    ${Math.abs(comparison.change.amount).toFixed(2)} {comparison.change.amount >= 0 ? 'more' : 'less'}
                  </p>
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            {overview && overview.categoryBreakdown && overview.categoryBreakdown.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300 animate-slide-up">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Spending by Category</h2>
                    <p className="text-sm text-gray-500 mt-1">Total: ${overview.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl">
                    <PieChart className="text-white" size={28} />
                  </div>
                </div>
                
                <div className="space-y-5">
                  {overview.categoryBreakdown.map((cat, index) => {
                    const percentage = overview.totalAmount > 0 ? (cat.amount / overview.totalAmount) * 100 : 0;
                    return (
                      <div key={index} className="group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className={`w-3 h-3 rounded-full bg-linear-to-r ${getCategoryColor(index)}`}></span>
                            <span className="text-sm font-semibold text-gray-800">{cat.category}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-gray-900">${cat.amount.toFixed(2)}</span>
                            <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                          <div
                            className={`h-4 rounded-full bg-linear-to-r ${getCategoryColor(index)} transition-all duration-1000 ease-out shadow-md`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Monthly Trends */}
            {trends && trends.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300 animate-slide-up">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Monthly Trends</h2>
                    <p className="text-sm text-gray-500 mt-1">Last 6 months overview</p>
                  </div>
                  <div className="p-3 bg-linear-to-br from-blue-500 to-emerald-500 rounded-xl">
                    <BarChart3 className="text-white" size={28} />
                  </div>
                </div>
                
                <div className="space-y-5">
                  {trends.map((month, index) => {
                    const maxAmount = Math.max(...trends.map(m => m.totalAmount));
                    const percentage = maxAmount > 0 ? (month.totalAmount / maxAmount) * 100 : 0;
                    
                    return (
                      <div key={index} className="group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-800">{month.month}</span>
                          <div className="text-right">
                            <span className="text-sm font-bold text-gray-900">${month.totalAmount.toFixed(2)}</span>
                            <span className="text-xs text-gray-500 ml-2">({month.count} expenses)</span>
                          </div>
                        </div>
                        <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                          <div
                            className="h-4 rounded-full bg-linear-to-r from-blue-500 to-emerald-500 transition-all duration-1000 ease-out shadow-md group-hover:shadow-lg"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Expenses */}
            {topExpenses && topExpenses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300 animate-slide-up">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Top 5 Expenses</h2>
                    <p className="text-sm text-gray-500 mt-1">Your highest spending items</p>
                  </div>
                  <div className="p-3 bg-linear-to-br from-orange-500 to-red-500 rounded-xl">
                    <DollarSign className="text-white" size={28} />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Description</th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Category</th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Date</th>
                        <th className="text-right py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topExpenses.map((expense, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-linear-to-r hover:from-orange-50 hover:to-red-50 transition-colors duration-200 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-red-500 text-white font-bold text-sm">
                                {index + 1}
                              </span>
                              <span className="text-sm font-medium text-gray-900">{expense.description}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block px-3 py-1 text-xs font-semibold bg-linear-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full">
                              {expense.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                            {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-lg font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                              ${expense.amount.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Goals Progress */}
            {goalsProgress && goalsProgress.totalGoals > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300 animate-slide-up">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Goals Overview</h2>
                    <p className="text-sm text-gray-500 mt-1">Track your financial targets</p>
                  </div>
                  <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl">
                    <Target className="text-white" size={28} />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-5 mb-8">
                  <div className="group text-center p-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:scale-105 transition-transform duration-300">
                    <p className="text-4xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{goalsProgress.totalGoals}</p>
                    <p className="text-sm text-blue-700 mt-2 font-semibold">Total Goals</p>
                  </div>
                  <div className="group text-center p-6 bg-linear-to-br from-emerald-50 to-emerald-100 rounded-2xl border-2 border-emerald-200 hover:scale-105 transition-transform duration-300">
                    <p className="text-4xl font-bold bg-linear-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">{goalsProgress.completed}</p>
                    <p className="text-sm text-emerald-700 mt-2 font-semibold">Completed</p>
                  </div>
                  <div className="group text-center p-6 bg-linear-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200 hover:scale-105 transition-transform duration-300">
                    <p className="text-4xl font-bold bg-linear-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">{goalsProgress.inProgress}</p>
                    <p className="text-sm text-orange-700 mt-2 font-semibold">In Progress</p>
                  </div>
                </div>

                <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-indigo-900">Overall Progress</span>
                    <span className="text-sm font-bold text-indigo-700">
                      ${goalsProgress.totalSaved.toFixed(2)} / ${goalsProgress.totalTarget.toFixed(2)}
                    </span>
                  </div>
                  <div className="relative w-full bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner">
                    <div
                      className="h-5 rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${Math.min(goalsProgress.overallProgress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-center mt-3 text-lg font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {goalsProgress.overallProgress.toFixed(1)}% Complete
                  </p>
                </div>
              </div>
            )}

            {/* Group Analytics */}
            {groupAnalytics && groupAnalytics.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300 animate-slide-up">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Group Contributions</h2>
                    <p className="text-sm text-gray-500 mt-1">Your share in each group</p>
                  </div>
                  <div className="p-3 bg-linear-to-br from-teal-500 to-cyan-500 rounded-xl">
                    <Users className="text-white" size={28} />
                  </div>
                </div>
                
                <div className="space-y-5">
                  {groupAnalytics.map((group, index) => (
                    <div key={index} className="group border-2 border-gray-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-lg transition-all duration-300 bg-linear-to-br from-white to-teal-50/30 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-gray-900">{group.groupName}</h3>
                        <span className="px-4 py-2 bg-linear-to-r from-teal-100 to-cyan-100 text-teal-700 font-bold text-sm rounded-full border-2 border-teal-200">
                          {group.userPercentage.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                          <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide mb-1">Your Contribution</p>
                          <p className="font-bold text-2xl text-blue-900">${group.userAmount.toFixed(2)}</p>
                          <p className="text-xs text-blue-600 mt-1">{group.userExpenses} expenses</p>
                        </div>
                        <div className="bg-linear-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-700 font-semibold uppercase tracking-wide mb-1">Group Total</p>
                          <p className="font-bold text-2xl text-gray-900">${group.totalAmount.toFixed(2)}</p>
                          <p className="text-xs text-gray-600 mt-1">{group.totalExpenses} expenses</p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                          <div
                            className="h-3 rounded-full bg-linear-to-r from-teal-500 to-cyan-500 transition-all duration-1000 ease-out shadow-md"
                            style={{ width: `${group.userPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
