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

async function getUserExpenses() {
  const response = await fetch(`${API}/expenses`, {
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

export { login, signup, logout, getCurrentUser, createExpense, getUserExpenses, deleteExpense, updateExpense };