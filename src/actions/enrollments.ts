import { API_BASE, handleResponse } from './api';

export async function requestEnrollment(
  token: string,
  courseId: number,
  receiptFile: File
): Promise<Enrollment> {
  const formData = new FormData();
  formData.append('courseId', courseId.toString());
  formData.append('receipt', receiptFile);

  const res = await fetch(`${API_BASE}/enrollments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse(res);
}

export async function fetchAllEnrollments(token: string): Promise<Enrollment[]> {
  const res = await fetch(`${API_BASE}/enrollments`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function verifyEnrollment(
  token: string,
  id: number,
  verified: boolean
): Promise<Enrollment> {
  const res = await fetch(`${API_BASE}/enrollments/${id}/verify`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ verified }),
  });
  return handleResponse(res);
}

export async function fetchEnrollmentById(token: string, id: number): Promise<Enrollment | undefined> {
  const all = await fetchAllEnrollments(token);
  return all.find(e => e.id === id);
}
