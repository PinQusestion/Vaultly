'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Plus, Edit2, Trash2, ChevronLeft, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import { getUserExpenses, deleteExpense, createExpense, } from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';
import AddExpenseModal from '../../components/AddExpenseModal';
import UpdateExpenseModal from '../../components/UpdateExpenseModal';
import Navigation from '../../components/Navigation';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10
  });
  
  // Search, Sort, Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [currentPage, searchQuery, sortBy, sortOrder, filterCategory, dateRange]);

  const fetchExpenses = async () => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery,
      sortBy,
      sortOrder,
      category: filterCategory,
      startDate: dateRange.start,
      endDate: dateRange.end
    };

    const response = await getUserExpenses(params);
    if (response.error) {
      toast.error('Failed to fetch expenses');
    } else {
      setExpenses(response.expenses || []);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: itemsPerPage
      });
    }
  };

  const handleAdd = async (newExpense) => {
    try{
      const response = await createExpense(newExpense);
      if(response.error){
        toast.error('Failed to add expense');
        return;
      }
      // Refetch expenses to get updated paginated data
      await fetchExpenses();
      toast.success('Expense added successfully!');
    }catch(error){
      toast.error('Failed to add expense');
    }
  };

  const handleDelete = async(id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      const response = await deleteExpense(id);
      if (response.error) {
        toast.error('Failed to delete expense');
      } else {
        await fetchExpenses();
        toast.success('Expense deleted successfully!');
      }
    }
  };

  const handleUpdate = (expense) => {
    setSelectedExpense(expense);
    setIsUpdateModalOpen(true);
  };

  const handleExpenseUpdated = async (updatedExpense) => {
    await fetchExpenses();
    toast.success('Expense updated successfully!');
  };

  // Export to CSV
  const exportToCSV = () => {
    if (expenses.length === 0) {
      toast.error('No expenses to export');
      return;
    }

    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const rows = expenses.map(exp => [
      new Date(exp.date).toLocaleDateString(),
      exp.description,
      exp.category,
      `$${parseFloat(exp.amount).toFixed(2)}`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Expenses exported to CSV!');
  };

  // Export to PDF (simple text-based PDF)
  const exportToPDF = () => {
    if (expenses.length === 0) {
      toast.error('No expenses to export');
      return;
    }

    const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    
    let pdfContent = `EXPENSE REPORT\n`;
    pdfContent += `Generated: ${new Date().toLocaleDateString()}\n`;
    pdfContent += `Total Expenses: $${totalAmount.toFixed(2)}\n`;
    pdfContent += `Number of Transactions: ${expenses.length}\n\n`;
    pdfContent += `${'='.repeat(80)}\n\n`;
    
    expenses.forEach((exp, index) => {
      pdfContent += `${index + 1}. ${new Date(exp.date).toLocaleDateString()}\n`;
      pdfContent += `   Description: ${exp.description}\n`;
      pdfContent += `   Category: ${exp.category}\n`;
      pdfContent += `   Amount: $${parseFloat(exp.amount).toFixed(2)}\n\n`;
    });

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expense_report_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Report exported!');
  };

  return (
    <>
      <Navigation />
      <Toaster position="top-right" />
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

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Manager</h1>
            <p className="text-gray-600">Track and manage your expenses with advanced filters</p>
          </div>

          {/* Search and Actions Bar */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={exportToCSV}
                  className="flex-1 md:flex-none px-4 py-2.5 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition flex items-center justify-center gap-2"
                  title="Export to CSV"
                >
                  <Download size={18} />
                  <span className="hidden sm:inline">CSV</span>
                </button>
                <button
                  onClick={exportToPDF}
                  className="flex-1 md:flex-none px-4 py-2.5 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition flex items-center justify-center gap-2"
                  title="Export Report"
                >
                  <FileText size={18} />
                  <span className="hidden sm:inline">Report</span>
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 md:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal size={18} />
                  Filters
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 md:flex-none px-4 py-2.5 bg-linear-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Expense
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  >
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="category">Category</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => {
                      setSortOrder(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  >
                    <option value="all">All Categories</option>
                    <option value="food">Food & Dining</option>
                    <option value="transport">Transportation</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="utilities">Utilities</option>
                    <option value="shopping">Shopping</option>
                    <option value="healthcare">Healthcare</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => {
                      setDateRange({ ...dateRange, start: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => {
                      setDateRange({ ...dateRange, end: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterCategory('all');
                      setDateRange({ start: '', end: '' });
                      setSortBy('date');
                      setSortOrder('desc');
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Expenses Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-blue-600 to-emerald-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Amount</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No expenses found. Add your first expense to get started!
                      </td>
                    </tr>
                  ) : (
                    expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                          ${expense.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleUpdate(expense)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(expense.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} expenses
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPrevPage}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          pagination.currentPage === i + 1
                            ? 'bg-linear-to-r from-blue-600 to-emerald-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {/* Add Expense Modal */}
      <AddExpenseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExpenseAdded={handleAdd}
      />

      {/* Update Expense Modal */}
      <UpdateExpenseModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedExpense(null);
        }}
        onExpenseUpdated={handleExpenseUpdated}
        expense={selectedExpense}
      />

    </>
  );
}