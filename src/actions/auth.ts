const API_BASE = import.meta.env.VITE_API_URL as string;

async function handleResponse(res: Response) {
  if (!res.ok) {
    let errorMessage = `Request failed: ${res.statusText} (${res.status})`;
    try {
      const data = await res.json();
      if (data.errors && Array.isArray(data.errors)) {
        errorMessage = data.errors.map((err: any) => err.msg || err.message).join(', ');
      } else if (data.message) {
        errorMessage = data.message;
      }
    } catch {
      // JSON parsing failed, keep default message
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(res);
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function fetchCurrentUser(token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}
