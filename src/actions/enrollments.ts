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
