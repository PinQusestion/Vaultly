const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

async function login(email, password) {
  const response = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Login failed" };
  }

  return response.json();
}

async function signup(userData) {
  const response = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Signup failed" };
  }

  const data = await response.json();
  return data;
}

async function logout() {
  const response = await fetch(`${API}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Logout failed" };
  }

  return response.json();
}

async function getCurrentUser() {
  const response = await fetch(`${API}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    return { error: "Not authenticated" };
  }

  return response.json();
}

async function createExpense(expenseData) {
  const response = await fetch(`${API}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to create expense" };
  }

  return response.json();
}

async function getUserExpenses(params = {}) {
  const queryParams = new URLSearchParams();
  
  // Add query parameters if they exist
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.search) queryParams.append('search', params.search);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params.category && params.category !== 'all') queryParams.append('category', params.category);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);

  const queryString = queryParams.toString();
  const url = `${API}/expenses${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    return { error: "Failed to fetch expenses" };
  }

  return response.json();
}

async function deleteExpense(expenseId) {
  const response = await fetch(`${API}/expenses/${expenseId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to delete expense" };
  }

  return response.json();
}

async function updateExpense(expenseId, updateData){
  const response = await fetch(`${API}/expenses/${expenseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updateData),
  });

  if(!response.ok){
    const error = await response.json();
    return { error: error.message || "Failed to update expense" };
  }

  return response.json();
}

async function updateUser(userId, updateData) {
  const response = await fetch(`${API}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to update profile" };
  }

  return response.json();
}

// Group API functions
async function getUserGroups() {
  const response = await fetch(`${API}/groups`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    return { error: "Failed to fetch groups" };
  }

  return response.json();
}

async function createGroup(groupData) {
  const response = await fetch(`${API}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(groupData),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to create group" };
  }

  return response.json();
}

async function getGroupById(groupId) {
  const response = await fetch(`${API}/groups/${groupId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to fetch group" };
  }

  return response.json();
}

async function updateGroup(groupId, updateData) {
  const response = await fetch(`${API}/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to update group" };
  }

  return response.json();
}

async function deleteGroup(groupId) {
  const response = await fetch(`${API}/groups/${groupId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to delete group" };
  }

  return response.json();
}

async function addGroupMember(groupId, memberData) {
  const response = await fetch(`${API}/groups/${groupId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(memberData),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to add member" };
  }

  return response.json();
}

async function removeGroupMember(groupId, memberId) {
  const response = await fetch(`${API}/groups/${groupId}/members/${memberId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to remove member" };
  }

  return response.json();
}

export { 
  login, 
  signup, 
  logout, 
  getCurrentUser, 
  createExpense, 
  getUserExpenses, 
  deleteExpense, 
  updateExpense, 
  updateUser,
  getUserGroups,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember
};