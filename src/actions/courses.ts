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

export interface CourseStats {
  videoCount: number;
  examCount: number;
  studentCount: number;
  resultsCount: number;
}

export async function fetchCourseStats(token: string, courseId: number): Promise<CourseStats> {
  const res = await fetch(`${API_BASE}/courses/${courseId}/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
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

export async function createCourse(
  token: string,
  data: { name: string; description: string; price: number }
): Promise<Course> {
  const res = await fetch(`${API_BASE}/courses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateCourse(
  token: string,
  courseId: number,
  data: { name: string; description: string; price: number }
): Promise<Course> {
  const res = await fetch(`${API_BASE}/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteCourse(token: string, courseId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/courses/${courseId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export interface UploadSignatureResponse {
  signature: string;
  timestamp: number;
  folder: string;
  api_key: string;
  cloud_name: string;
}

export async function fetchUploadSignature(token: string): Promise<UploadSignatureResponse> {
  const res = await fetch(`${API_BASE}/videos/upload-signature`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function saveVideoDetails(
  token: string,
  data: { courseId: number; title: string; videoUrl: string; publicId: string }
): Promise<Video> {
  const res = await fetch(`${API_BASE}/videos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export interface CreateQuestionInput {
  questionText: string;
  correctAnswer: string;
  marks: number;
}

export interface CreateExamInput {
  title: string;
  courseId: number;
  duration: number;
  passMark: number;
  questions: CreateQuestionInput[];
}

export async function createExam(token: string, data: CreateExamInput): Promise<Exam> {
  const res = await fetch(`${API_BASE}/exams`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function fetchExamDetails(token: string, examId: number): Promise<Exam & { questions: any[] }> {
  const res = await fetch(`${API_BASE}/exams/${examId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export interface CourseStudentResponse {
  id: number;
  userId: number;
  courseId: number;
  receiptUrl: string;
  receiptPublicId: string;
  verified: boolean;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export async function fetchStudentsByCourse(token: string, courseId: number): Promise<CourseStudentResponse[]> {
  const res = await fetch(`${API_BASE}/courses/${courseId}/students`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export interface ExamAttemptResponse {
  id: number;
  examId: number;
  studentId: number;
  score: number | null;
  isGraded: boolean;
  createdAt: string;
  student: {
    id: number;
    name: string;
    email: string;
  };
  exam: {
    id: number;
    title: string;
  };
}

export async function fetchAllResultsByCourse(token: string, courseId: number): Promise<ExamAttemptResponse[]> {
  const res = await fetch(`${API_BASE}/exams/course/${courseId}/results`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export interface StudentAttemptResponse {
  id: number;
  examId: number;
  studentId: number;
  score: number | null;
  isGraded: boolean;
  createdAt: string;
  exam: {
    id: number;
    title: string;
  };
}

export async function fetchStudentResultsByCourse(
  token: string,
  courseId: number,
  studentId: number
): Promise<StudentAttemptResponse[]> {
  const res = await fetch(`${API_BASE}/exams/course/${courseId}/student/${studentId}/results`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function fetchMyResultsByCourse(
  token: string,
  courseId: number
): Promise<StudentAttemptResponse[]> {
  const res = await fetch(`${API_BASE}/exams/course/${courseId}/my-results`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export interface ExamAttemptDetail {
  id: number;
  examId: number;
  studentId: number;
  score: number | null;
  isGraded: boolean;
  createdAt: string;
  student: {
    id: number;
    name: string;
    email: string;
  };
  exam: {
    id: number;
    title: string;
    courseId: number;
  };
  answers: Array<{
    id: number;
    questionId: number;
    studentAnswer: string;
    isCorrect: boolean | null;
    marksAwarded: number | null;
    similarity: number | null;
    feedback: string | null;
    question: {
      id: number;
      questionText: string;
      correctAnswer: string;
      marks: number;
    };
  }>;
}

export async function fetchAttemptWithAnswers(token: string, attemptId: number): Promise<ExamAttemptDetail> {
  const res = await fetch(`${API_BASE}/exams/attempt/${attemptId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function updateAttemptMarks(
  token: string,
  attemptId: number,
  answers: Array<{
    answerId: number;
    marksAwarded: number | null;
    similarity?: number | null;
    feedback?: string | null;
  }>
): Promise<any> {
  const res = await fetch(`${API_BASE}/exams/attempt/${attemptId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answers }),
  });
  return handleResponse(res);
}

export async function evaluateAttemptWithAI(token: string, attemptId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/exams/attempt/${attemptId}/evaluate-ai`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function evaluateAnswerWithAI(token: string, answerId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/exams/answer/${answerId}/evaluate-ai`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function updateVideo(
  token: string,
  videoId: number,
  data: { title?: string; videoUrl?: string; publicId?: string }
): Promise<Video> {
  const res = await fetch(`${API_BASE}/videos/${videoId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteVideo(token: string, videoId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/videos/${videoId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function updateExam(
  token: string,
  examId: number,
  data: { title?: string; duration?: number; passMark?: number; questions?: CreateQuestionInput[] }
): Promise<Exam> {
  const res = await fetch(`${API_BASE}/exams/${examId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteExam(token: string, examId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/exams/${examId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export interface StartExamResponse {
  attemptId: number;
  startedAt: string;
  deadline: string | null;
}

export async function startExamAttempt(token: string, examId: number): Promise<StartExamResponse> {
  const res = await fetch(`${API_BASE}/exams/${examId}/start`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function submitExamAttempt(
  token: string,
  examId: number,
  answers: Array<{ questionId: number; studentAnswer: string }>
): Promise<any> {
  const res = await fetch(`${API_BASE}/exams/${examId}/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answers }),
  });
  return handleResponse(res);
}

export async function toggleExamApproval(
  token: string,
  examId: number,
  isAdminApproved: boolean
): Promise<any> {
  const res = await fetch(`${API_BASE}/exams/${examId}/toggle-approval`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isAdminApproved }),
  });
  return handleResponse(res);
}

export async function toggleVideoApproval(
  token: string,
  videoId: number,
  isAdminApproved: boolean
): Promise<any> {
  const res = await fetch(`${API_BASE}/videos/${videoId}/toggle-approval`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isAdminApproved }),
  });
  return handleResponse(res);
}