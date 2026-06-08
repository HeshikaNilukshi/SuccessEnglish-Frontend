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

export async function fetchCourse(id: number, token?: string): Promise<Course> {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/courses/${id}`, { headers });
  return handleResponse(res);
}

export async function fetchVideosByCourse(token: string, courseId: number): Promise<Video[]> {
  const res = await fetch(`${API_BASE}/videos/course/${courseId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function fetchVideoDetails(token: string, videoId: number): Promise<Video> {
  const res = await fetch(`${API_BASE}/videos/${videoId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function fetchExamsByCourse(token: string, courseId: number): Promise<Exam[]> {
  const res = await fetch(`${API_BASE}/exams/course/${courseId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}