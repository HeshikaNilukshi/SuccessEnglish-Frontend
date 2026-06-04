interface Course {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  createdAt?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  receiptUrl: string;
  receiptPublicId: string;
  verified: boolean;
  createdAt: string;
  course: {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
  };
}
