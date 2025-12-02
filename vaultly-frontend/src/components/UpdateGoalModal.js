'use client'
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Target, DollarSign, Calendar, FileText } from 'lucide-react';

export default function UpdateGoalModal({ isOpen, onClose, goal, onGoalUpdated }) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (goal) {
      setName(goal.name || '');
      setTargetAmount(goal.targetAmount?.toString() || '');
      setDeadline(goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '');
      setDescription(goal.description || '');
    }
  }, [goal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !targetAmount) {
      toast.error('Goal name and target amount are required');
      return;
    }

    if (parseFloat(targetAmount) <= 0) {
      toast.error('Target amount must be positive');
      return;
    }

    const goalData = {
      name,
      targetAmount: parseFloat(targetAmount),
      deadline: deadline || null,
      description
    };

    await onGoalUpdated(goalData);
    onClose();
  };

  const handleClose = () => {
    setName('');
    setTargetAmount('');
    setDeadline('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Update Goal</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal Name <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Target size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., New Laptop, Emergency Fund"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-gray-900"
              />
            </div>
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Amount <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                step="0.01"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-gray-900"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline <span className="text-gray-500">(Optional)</span>
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-gray-900"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-gray-500">(Optional)</span>
            </label>
            <div className="relative">
              <FileText size={18} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes about this goal..."
                rows="3"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-gray-900 resize-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-linear-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              Update Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
