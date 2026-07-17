import { API_BASE, handleResponse } from './api';

export async function fetchUsers(token: string, role?: string, search?: string): Promise<User[]> {
  const params = new URLSearchParams();
  if (role) params.append('role', role);
  if (search) params.append('search', search);

  const queryString = params.toString();
  const url = queryString ? `${API_BASE}/users?${queryString}` : `${API_BASE}/users`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function fetchUserById(token: string, id: number): Promise<User & { createdCourses?: Course[]; enrollments?: (Enrollment & { course: Course })[] }> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function createUser(token: string, data: any): Promise<User> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateUser(token: string, id: number, data: any): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteUser(token: string, id: number): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}
