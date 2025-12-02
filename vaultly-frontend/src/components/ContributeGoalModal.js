'use client'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { X, DollarSign, TrendingUp } from 'lucide-react';

export default function ContributeGoalModal({ isOpen, onClose, goal, onContribute }) {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Amount must be positive');
      return;
    }

    await onContribute(parseFloat(amount));
    onClose();
    setAmount('');
  };

  const handleClose = () => {
    setAmount('');
    onClose();
  };

  if (!isOpen || !goal) return null;

  const remaining = goal.targetAmount - goal.currentAmount;

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
          <h2 className="text-2xl font-bold text-gray-900">Contribute to Goal</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Goal Info */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2">{goal.name}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Current: ${goal.currentAmount.toFixed(2)}</p>
            <p>Target: ${goal.targetAmount.toFixed(2)}</p>
            <p className="font-medium text-blue-600">Remaining: ${remaining.toFixed(2)}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Amount <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-gray-900"
                autoFocus
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
              <TrendingUp size={14} />
              Quick: <button type="button" onClick={() => setAmount(remaining.toFixed(2))} className="text-blue-600 hover:underline">Full amount</button>
            </p>
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
              Contribute
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
