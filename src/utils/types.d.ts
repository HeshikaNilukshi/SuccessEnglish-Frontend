interface Course {
  id: number;
  name: string;
  description: string | null;
  price: number;
  createdAt: string;
}

interface User {
  id: number;
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
  id: number;
  userId: number;
  courseId: number;
  receiptUrl: string;
  receiptPublicId: string;
  verified: boolean;
  createdAt: string;
  course: {
    id: number;
    name: string;
    description: string | null;
    price: number;
    createdAt: string;
  };
}
