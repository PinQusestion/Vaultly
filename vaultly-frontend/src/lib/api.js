const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

async function login(email, password) {
    const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Add this
        body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
        const error = await response.json();
        return { error: error.message || 'Login failed' };
    }
    
    return response.json();
}

async function signup(userData) {
    const response = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        return { error: error.message || 'Signup failed' };
    }
    
    const data = await response.json();
    return data;
}

export { login, signup };