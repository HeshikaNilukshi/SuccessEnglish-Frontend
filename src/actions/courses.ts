import { API_BASE, handleResponse } from './api';

export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch(`${API_BASE}/courses`);
  return handleResponse(res);
}

export async function fetchMyEnrollments(token: string): Promise<Enrollment[]> {
  const res = await fetch(`${API_BASE}/enrollments/my`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function fetchCourse(id: number): Promise<Course> {
  const res = await fetch(`${API_BASE}/courses/${id}`);
  return handleResponse(res);
}