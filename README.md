# SkillBridge - AI-Powered Student Skill Exchange Platform

SkillBridge is a full-stack MERN platform that helps college students learn from each other through a skill-exchange system. Students can register, create mentor profiles, search verified mentors, book learning sessions using skill points, complete sessions, write reviews, and get AI-powered mentor recommendations and learning paths.

## Features

- JWT-based student and admin authentication
- Secure password hashing with bcrypt
- Student profile with skills known, skills wanted, branch, year, and skill points
- Mentor profile creation with skills, availability, mode, location, and experience level
- Admin mentor verification and rejection
- Mentor search with filters for skill, mode, experience level, rating, and keyword
- Session booking with status flow: `PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`, `CANCELLED`
- Skill points transfer after session completion
- Review and rating system
- AI recommendations using Hugging Face API
- Student, mentor, and admin dashboards
- Recharts analytics for dashboard charts
- Responsive React frontend with normal CSS

## Tech Stack

**Frontend**

- React.js
- Vite
- React Router DOM
- Axios
- Recharts
- Normal CSS

**Backend**

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Axios
- dotenv
- CORS

**AI**

- Hugging Face Inference API
- Model: `mistralai/Mistral-7B-Instruct-v0.2`

**Deployment**

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Folder Structure

```txt
SkillBridge/
  backend/
    src/
      config/
        db.js
      controllers/
        adminController.js
        aiController.js
        authController.js
        dashboardController.js
        mentorController.js
        reviewController.js
        sessionController.js
      middleware/
        adminMiddleware.js
        authMiddleware.js
      models/
        MentorProfile.js
        RecommendationLog.js
        Review.js
        Session.js
        User.js
      routes/
        adminRoutes.js
        aiRoutes.js
        authRoutes.js
        dashboardRoutes.js
        mentorRoutes.js
        reviewRoutes.js
        sessionRoutes.js
      services/
        huggingFaceService.js
      app.js
      server.js
    package.json
    .env

  frontend/
    src/
      api/
        axios.js
      components/
        AddReviewModal.jsx
        BookSession.jsx
        MentorCard.jsx
        Navbar.jsx
        ProtectedRoute.jsx
        Sidebar.jsx
      context/
        AuthContext.jsx
      pages/
        AdminDashboard.jsx
        AISuggestions.jsx
        CreateMentorProfile.jsx
        Dashboard.jsx
        FindMentors.jsx
        Login.jsx
        ManageUsers.jsx
        MentorDashboard.jsx
        MentorDetails.jsx
        MentorSessionRequests.jsx
        MySessions.jsx
        Profile.jsx
        Register.jsx
        VerifyMentors.jsx
      App.jsx
      main.jsx
      styles.css
    package.json
```

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```txt
http://localhost:5000
```

Health check:

```txt
GET http://localhost:5000/api/health
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```txt
http://localhost:5173
```

## Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
HF_API_KEY=your_hugging_face_api_key
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

Important security notes:

- Never upload `.env` to GitHub.
- Add `.env` to `.gitignore`.
- Use strong secrets for `JWT_SECRET`.
- Store production environment variables only inside Render, Vercel, or the hosting provider dashboard.
- Do not expose `HF_API_KEY` in the frontend. Hugging Face requests must go through the backend.

## API Endpoints

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Mentors

```txt
POST /api/mentors/profile
GET  /api/mentors/my-profile
PUT  /api/mentors/profile
GET  /api/mentors
GET  /api/mentors/search
GET  /api/mentors/:id
```

### Sessions

```txt
POST /api/sessions/book
GET  /api/sessions/my
GET  /api/sessions/mentor
PUT  /api/sessions/:id/accept
PUT  /api/sessions/:id/reject
PUT  /api/sessions/:id/cancel
PUT  /api/sessions/:id/complete
```

### Reviews

```txt
POST /api/reviews
GET  /api/reviews/mentor/:mentorProfileId
```

### AI

```txt
POST /api/ai/recommend
```

### Dashboards

```txt
GET /api/dashboard/student
GET /api/dashboard/mentor
```

### Admin

```txt
GET    /api/admin/dashboard
GET    /api/admin/users
GET    /api/admin/mentors
PUT    /api/admin/mentors/:id/verify
PUT    /api/admin/mentors/:id/reject
DELETE /api/admin/users/:id
```

## User Roles

### STUDENT

- Register and login
- View dashboard
- Search mentors
- Book sessions
- Cancel pending or accepted sessions
- Review completed sessions
- Create a mentor profile
- Use AI suggestions

### ADMIN

- View admin dashboard
- View all users
- Delete users safely
- View mentor profiles
- Verify or reject mentors

## AI Integration Explanation

SkillBridge uses the Hugging Face Inference API from the backend. The user enters a learning goal such as:

```txt
I am weak in dynamic programming and recursion. I want to prepare for placements.
```

The backend sends this goal to Hugging Face and asks the model to return:

- Extracted skills
- A 5-day learning path
- Mentor matching input

Then the backend matches extracted skills with verified mentor profiles. Mentors are sorted by skill match count and rating.

If Hugging Face fails, the backend uses fallback keyword extraction for common skills like:

```txt
DSA, Java, React, Node, MongoDB, Aptitude, English, Resume, DBMS, OS, CN, Recursion, DP, Spring Boot
```

This keeps the feature usable even if the AI API is unavailable.

## Skill Points Logic

- Every new student starts with `100` skill points.
- Booking a session requires enough points, usually `20`.
- Points are not transferred when the session is booked.
- Points are transferred only after the mentor marks the session as `COMPLETED`.
- On completion:
  - Learner loses `pointsUsed`
  - Mentor gains `pointsUsed`
- Double completion is prevented by checking session status.

This design prevents unfair point transfer if a session is rejected, cancelled, or never completed.

## Screenshots

Add screenshots here after running the app locally or deploying it.

```txt
screenshots/
  login.png
  student-dashboard.png
  find-mentors.png
  mentor-details.png
  ai-suggestions.png
  admin-dashboard.png
```

## Deployment Steps

### Database: MongoDB Atlas

1. Create a MongoDB Atlas account.
2. Create a new cluster.
3. Create a database user.
4. Allow network access from your deployment provider.
5. Copy the MongoDB connection string.
6. Add it as `MONGO_URI` in Render environment variables.

### Backend: Render

1. Push the project to GitHub.
2. Go to Render and create a new Web Service.
3. Connect your GitHub repository.
4. Set the root directory to:

```txt
backend
```

5. Set build command:

```bash
npm install
```

6. Set start command:

```bash
npm start
```

7. Add environment variables in Render:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
HF_API_KEY=your_hugging_face_api_key
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

8. Deploy and copy the backend URL.

### Frontend: Vercel

1. Go to Vercel and import your GitHub repository.
2. Set the root directory to:

```txt
frontend
```

3. Set build command:

```bash
npm run build
```

4. Set output directory:

```txt
dist
```

5. Update the frontend API base URL in `frontend/src/api/axios.js` to use the deployed Render backend URL.

Example:

```js
baseURL: "https://your-render-backend.onrender.com/api"
```

6. Deploy the frontend.

## Resume Points

- Built a full-stack MERN skill exchange platform for college students.
- Implemented JWT authentication and role-based authorization.
- Designed mentor verification workflow for admins.
- Built session booking lifecycle with skill-point transfer logic.
- Integrated Hugging Face API for AI mentor recommendations and learning paths.
- Added fallback AI logic to maintain reliability during API failures.
- Created student, mentor, and admin dashboards with analytics using Recharts.
- Designed responsive React UI with normal CSS.
- Used MongoDB Atlas and Mongoose for schema-based data modeling.

## Interview Explanation

SkillBridge solves a common college problem: students often need help with skills like DSA, React, DBMS, aptitude, or resume building, but they may not know who on campus can teach them. The platform lets students become mentors, list skills, and get verified by an admin.

The application has two main roles: `STUDENT` and `ADMIN`. A student can also become a mentor by creating a mentor profile. Admins verify mentor profiles before they appear in public mentor search.

The session booking system uses skill points. Students spend points to learn, but points are transferred only after the mentor completes the session. This protects both learners and mentors from unfair transactions.

The AI module improves discovery. Students enter a learning goal, the backend sends it to Hugging Face, extracts skills, generates a 5-day learning path, and recommends verified mentors based on matching skills and ratings.

The project demonstrates authentication, authorization, REST APIs, database modeling, AI integration, dashboard analytics, and responsive frontend development in a real-world MERN stack application.
