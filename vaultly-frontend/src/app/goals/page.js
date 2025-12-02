'use client'
import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import CreateGoalModal from '../../components/CreateGoalModal';
import UpdateGoalModal from '../../components/UpdateGoalModal';
import ContributeGoalModal from '../../components/ContributeGoalModal';
import { getUserGoals, createGoal, updateGoal, deleteGoal, contributeToGoal } from '../../lib/api';
import toast from 'react-hot-toast';
import { Target, Plus, Calendar, DollarSign, Edit2, Trash2, TrendingUp, CheckCircle } from 'lucide-react';

export default function Goals() {
  const [userName, setUserName] = useState('Guest');
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    const result = await getUserGoals();
    if (result.error) {
      toast.error(result.error);
    } else {
      setGoals(result.goals || []);
    }
    setLoading(false);
  };

  const handleCreateGoal = async (goalData) => {
    const result = await createGoal(goalData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Goal created successfully');
      fetchGoals();
    }
  };

  const handleUpdateGoal = async (goalData) => {
    const result = await updateGoal(selectedGoal.id, goalData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Goal updated successfully');
      fetchGoals();
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    const result = await deleteGoal(goalId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Goal deleted successfully');
      fetchGoals();
    }
  };

  const handleContribute = async (amount) => {
    const result = await contributeToGoal(selectedGoal.id, amount);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Contribution added successfully');
      fetchGoals();
    }
  };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return null;
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return { text: 'Overdue', color: 'text-red-600', bg: 'bg-red-50' };
    if (daysLeft <= 7) return { text: `${daysLeft} days left`, color: 'text-orange-600', bg: 'bg-orange-50' };
    if (daysLeft <= 30) return { text: `${daysLeft} days left`, color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: `${daysLeft} days left`, color: 'text-blue-600', bg: 'bg-blue-50' };
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-emerald-50">
      <Navigation userName={userName} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Goals</h1>
            <p className="text-gray-600">Track and achieve your savings targets</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition"
          >
            <Plus size={20} />
            New Goal
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading goals...</p>
          </div>
        ) : goals.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <Target size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No goals yet</h3>
            <p className="text-gray-600 mb-6">Start setting financial goals to track your progress</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              <Plus size={20} />
              Create Your First Goal
            </button>
          </div>
        ) : (
          /* Goals Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const deadlineStatus = getDeadlineStatus(goal.deadline);
              const isCompleted = goal.progress >= 100;
              
              return (
                <div
                  key={goal.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                >
                  {/* Goal Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{goal.name}</h3>
                      {goal.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{goal.description}</p>
                      )}
                    </div>
                    {isCompleted && (
                      <CheckCircle size={24} className="text-green-500 shrink-0 ml-2" />
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{goal.progress.toFixed(1)}%</span>
                      <span className="text-sm text-gray-600">
                        ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          isCompleted ? 'bg-green-500' : 'bg-linear-to-r from-blue-500 to-emerald-500'
                        }`}
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Deadline */}
                  {deadlineStatus && (
                    <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg ${deadlineStatus.bg}`}>
                      <Calendar size={16} className={deadlineStatus.color} />
                      <span className={`text-sm font-medium ${deadlineStatus.color}`}>
                        {deadlineStatus.text}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedGoal(goal);
                        setShowContributeModal(true);
                      }}
                      disabled={isCompleted}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                        isCompleted
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      <TrendingUp size={16} />
                      Contribute
                    </button>
                    <button
                      onClick={() => {
                        setSelectedGoal(goal);
                        setShowUpdateModal(true);
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateGoalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGoalCreated={handleCreateGoal}
      />
      <UpdateGoalModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
        onGoalUpdated={handleUpdateGoal}
      />
      <ContributeGoalModal
        isOpen={showContributeModal}
        onClose={() => {
          setShowContributeModal(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
        onContribute={handleContribute}
      />
    </div>
  );
}
