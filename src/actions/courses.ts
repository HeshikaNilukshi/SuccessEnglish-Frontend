const API_BASE = import.meta.env.VITE_API_URL as string;

export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch(`${API_BASE}/courses`);
  if (!res.ok) {
    throw new Error(`Failed to fetch courses: ${res.statusText} (${res.status})`);
  }
  return res.json();
}

export async function fetchMyEnrollments(token: string): Promise<Enrollment[]> {
  const res = await fetch(`${API_BASE}/enrollments/my`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch enrollments: ${res.statusText} (${res.status})`);
  }
  return res.json();
}