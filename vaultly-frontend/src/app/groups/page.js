"use client";

import { useState, useEffect } from "react";
import Navigation from "../../components/Navigation";
import CreateGroupModal from "../../components/CreateGroupModal";
import AddMemberModal from "../../components/AddMemberModal";
import Link from "next/link";
import {
  ChevronLeft,
  Users,
  Plus,
  UserPlus,
  Trash2,
  DollarSign,
  Crown,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  getUserGroups,
  removeGroupMember,
  deleteGroup,
} from "../../lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const data = await getUserGroups();

      if (data.success) {
        setGroups(data.groups);
      } else {
        toast.error(data.error || data.message || "Failed to load groups");
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const handleGroupCreated = (newGroup) => {
    fetchGroups();
  };

  const handleMemberAdded = (member) => {
    fetchGroups();
  };

  const handleRemoveMember = async (groupId, memberId) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const data = await removeGroupMember(groupId, memberId);

      if (data.success) {
        toast.success("Member removed successfully");
        fetchGroups();
      } else {
        toast.error(data.error || data.message || "Failed to remove member");
      }
    } catch (err) {
      console.error("Error removing member:", err);
      toast.error("Failed to remove member");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!confirm("Are you sure you want to delete this group? This action cannot be undone."))
      return;

    try {
      const data = await deleteGroup(groupId);

      if (data.success) {
        toast.success("Group deleted successfully");
        fetchGroups();
      } else {
        toast.error(data.error || data.message || "Failed to delete group");
      }
    } catch (err) {
      console.error("Error deleting group:", err);
      toast.error("Failed to delete group");
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-gray-600 py-12">Loading groups...</p>
          </div>
        </div>
      </>
    );
  }

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
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Groups</h2>
              <p className="text-gray-600 mt-1">Manage shared expenses with your groups</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus size={20} />
              <span className="font-medium">Create Group</span>
            </button>
          </div>

          {/* Groups List */}
          {groups.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Users size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No groups yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first group to start tracking shared expenses
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition"
              >
                <Plus size={20} />
                <span>Create Your First Group</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {groups.map((group) => (
                <div key={group.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  {/* Group Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-linear-to-br from-blue-500 to-emerald-500 rounded-lg">
                        <Users size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                        <p className="text-sm text-gray-500">
                          Created by {group.creator.fullName}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete group"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Group Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-linear-to-br from-slate-50 to-slate-100 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Users size={16} />
                        Members
                      </p>
                      <p className="text-2xl font-bold text-gray-900">{group.memberCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <DollarSign size={16} />
                        Total Spent
                      </p>
                      <p className="text-2xl font-bold text-emerald-600">
                        ${group.totalExpenses.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Members List */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900">Members</h4>
                      <button
                        onClick={() => {
                          setSelectedGroup(group);
                          setShowAddMemberModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <UserPlus size={16} />
                        Add Member
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {group.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {member.user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {member.user.fullName}
                              </p>
                              <p className="text-xs text-gray-500">{member.user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {member.role === "admin" ? (
                              <Crown size={16} className="text-yellow-500" title="Admin" />
                            ) : (
                              <ShieldCheck size={16} className="text-gray-400" title="Member" />
                            )}
                            {member.user.id !== group.createdBy && (
                              <button
                                onClick={() => handleRemoveMember(group.id, member.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Expenses */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Recent Expenses</h4>
                    {group.expenses.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No expenses yet</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {group.expenses.slice(0, 5).map((expense) => (
                          <div
                            key={expense.id}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-sm"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{expense.description}</p>
                              <p className="text-xs text-gray-500">
                                by {expense.user.fullName} • {expense.category.name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-emerald-600">
                                ${expense.amount.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(expense.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateGroupModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGroupCreated={handleGroupCreated}
      />

      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => {
          setShowAddMemberModal(false);
          setSelectedGroup(null);
        }}
        onMemberAdded={handleMemberAdded}
        group={selectedGroup}
      />
    </>
  );
}
