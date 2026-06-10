# Exam System Workflow

This document outlines the step-by-step procedure of how the exam system works from a student's perspective in the application, including the newly implemented frontend exam flow and resuming functionality.

## Prerequisites
- The student must be a registered user with the `STUDENT` role.
- The student must be enrolled in the course that contains the exam.
- The student's enrollment in the course must be verified by an administrator or teacher.

## Step-by-Step Procedure

### 1. Finding Available Exams
- The student navigates to a specific course page and clicks the **Exams** tab.
- The frontend requests the list of exams for that course (`GET /api/exams/course/:courseId`).
- **Backend Check:** The system verifies that the student has a valid, *verified* enrollment for the requested course before returning the exam list.

### 2. Pre-Exam Screen (Starting Page)
- When the student clicks on an exam link, they are directed to the **Pre-Exam Screen**.
- **Data Displayed:**
  - Exam ID & Title
  - Course Name
  - Total Questions
  - Pass Mark (Teacher-configured)
  - Time Limit (Shows "No time limit" if untimed, or duration in minutes)
  - Student Name & Student ID (fetched dynamically)
- **Actions:**
  - **Cancel:** Returns the student to the Course page.
  - **Start Exam:** Proceeds to call the start/resume API.

### 3. Starting or Resuming the Exam
- When the student clicks "Start Exam", the frontend requests to start the session (`POST /api/exams/:id/start`).
- **Backend Flow:**
  - **If no attempt exists:**
    - The backend creates a new `ExamAttempt` record.
    - The `createdAt` timestamp serves as the official start time.
    - Returns `201 Created` with the `attemptId`, `startedAt` time, and calculated `deadline`.
  - **If an attempt already exists (Resume Attempt):**
    - **Check Submission Status:** If the student has already submitted answers for this attempt, the API rejects it with a `409 Conflict` error.
    - **Check Deadline:** If the exam is timed and the current time is past the original deadline, the API rejects the request with a `403 Forbidden` error.
    - **Allow Resume:** If the exam has not been submitted and the deadline has not passed, the API returns `200 OK` along with the original `attemptId`, `startedAt`, and the original `deadline`.

### 4. Taking the Exam (Active State)
- The frontend transitions to the active taking layout:
  - **Single Page Scroll:** All questions are rendered in order on a single page, with marks displayed next to each question and a `<textarea>` for the student's answer.
  - **Sticky Header:** Contains the exam title, active countdown timer (derived from the remaining duration before `deadline`), and action buttons.
  - **Question Navigator:** Clicking this button opens a visual question map with radio-button style indicators showing the answered/unanswered state of each question. Clicking a question number scrolls the student directly to that question.
  - **Accidental Closure Recovery:** If the browser closes, the student navigates back to the exam page, clicks "Start Exam", and resumes with the exact remaining time from the original deadline.

### 5. Submitting the Exam
- The exam can be submitted in one of two ways:
  - **Manual Submission:** The student clicks "Submit Exam". A confirmation modal is shown, displaying progress (e.g. "You have answered 8/10 questions") and a disclaimer. Clicking "Submit Now" triggers the submission.
  - **Auto-Submission:** When the countdown timer hits `00:00`, the system *bypasses* the confirmation modal, immediately displays the full-screen loader, and sends the current answers.
- **Submission Process:**
  - The frontend displays a full-screen loading spinner (no skeleton layout) while sending the payload (`POST /api/exams/:id/submit`).
  - **Backend Checks:** Verifies the exam and attempt, checks for double-submission, and enforces time limits (allowing a 1-minute grace period).
  - **Saving Answers:** The answers are saved in the database, the attempt is marked as completed, and the student sees a success screen.

### 6. Grading (Teacher/Admin Action)
- A teacher reviews the student's attempt (`GET /api/exams/attempt/:attemptId`).
- The teacher assigns marks to each individual answer and submits the grades (`PUT /api/exams/attempt/:attemptId`).
- **Backend Action:** The system updates the marks for each answer and automatically calculates the total `score` for the `ExamAttempt`.

### 7. Viewing Results
- Once graded, the student can view their result (`GET /api/exams/:id/my-result`).
- The response includes their total score and details about the marks awarded for individual questions.
