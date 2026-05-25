# DocSpot - Clinic Appointment Booking System

DocSpot is a modern, premium, and fully responsive clinic appointment booking web application. It integrates a React.js frontend with a Node.js + Express.js backend and a MongoDB Atlas database. The application features a clean medical/healthcare theme, sleek glassmorphism panels, card-based layouts, and full CRUD capabilities for patient appointments and admin management.

## User Review Required

> [!IMPORTANT]
> **MongoDB Database Connection**
> We identified a MongoDB Atlas connection string from your previous conversation:
> `mongodb+srv://faryalali270_db_user:2005@appointmentsystem.kw9jq07.mongodb.net/appointmentDB?appName=AppointmentSystem`
> We will configure the backend to use this connection string in `backend/.env` with an automatic fallback to local MongoDB (`mongodb://localhost:27017/docspot`) so the server runs smoothly in any environment. Please let us know if you want us to use a different database URI.

> [!TIP]
> **Styling Approach**
> Per developer instructions, we will craft a **custom premium vanilla CSS system** (`index.css`) rather than TailwindCSS. This will feature clean, tailored HSL color tokens (white, healthcare blue, and soft mint green), elegant typography (Inter/Poppins), card-based glassmorphism, responsive grids, and subtle interactive hover micro-animations.

---

## Proposed Changes

### Project Layout

```mermaid
graph TD
    Workspace[AppointmentSystem]
    Workspace --> Backend[backend/]
    Workspace --> Frontend[frontend/]
    
    Backend --> BConfig[backend/src/config/db.js]
    Backend --> BModels[backend/src/models/]
    Backend --> BControllers[backend/src/controllers/]
    Backend --> BRoutes[backend/src/routes/]
    Backend --> BServer[backend/server.js]
    Backend --> BSeed[backend/src/seed.js]
    
    Frontend --> FSrc[frontend/src/]
    FSrc --> FComponents[frontend/src/components/]
    FSrc --> FPages[frontend/src/pages/]
    FSrc --> FContext[frontend/src/context/]
    FSrc --> FServices[frontend/src/services/]
    FSrc --> FApp[frontend/src/App.jsx]
    FSrc --> FCSS[frontend/src/index.css]
```

---

### Backend (Node.js & Express & MongoDB)

We will initialize a backend server in `backend/` containing:
- **Dependencies**: `express`, `mongoose`, `dotenv`, `cors`, `morgan`, `helmet` (plus `nodemon` for development).
- **Mongoose Models**:
  - `Doctor`: To represent clinic doctors (name, specialization, availability, photo/icon, bio).
  - `Appointment`: Patient appointments containing:
    - Patient Info: `name`, `age`, `gender`, `diseaseDescription`.
    - Appointment Info: `doctor` (ref), `date` (YYYY-MM-DD), `timeSlot`.
    - Status: `Pending`, `Approved`, or `Completed`.
- **REST API Routes (`/api/appointments` and `/api/doctors`)**:
  - `GET /api/doctors` - Fetch all clinic doctors.
  - `GET /api/appointments` - Fetch all appointments (with optional filters: `date`, `doctor`).
  - `POST /api/appointments` - Book a new appointment (validates input).
  - `PUT /api/appointments/:id` - Update status of an appointment.
  - `DELETE /api/appointments/:id` - Cancel/delete an appointment.
- **Seeding Database (`seed.js`)**: A script to seed default doctor profiles so the system comes with loaded profiles (e.g. Cardiologist, Dermatologist, Pediatrician, General Physician).

---

### Frontend (React.js)

We will initialize a frontend React application using Vite:
- **Routing (`react-router-dom`)**:
  - `/` - Home Page (Modern hero section, doctor cards carousel, CTA).
  - `/book` - Booking Page (Easy step-by-step booking form with validation).
  - `/dashboard` - Patient Dashboard (Check appointment statuses and manage bookings).
  - `/admin` - Doctor/Admin Panel (Complete overview, filters by doctor/date, status updates, search, and delete).
  - `/contact` - Contact Page (Elegant clinic feedback/contact form).
- **Global Context (`AuthContext` or simulated session)**: Easy patient identification for booking and listing appointments.
- **Bonus UI Features**:
  - Toast Notifications: Real-time custom success/error toast alerts.
  - Dark Mode Toggle: A smooth global state switcher between high-contrast hospital light-mode and cool medical dark-mode.
  - Search Feature: Real-time fuzzy filtering of appointments on the dashboard.
  - Loading State: Medical pulse/spinner animations during API requests.

---

## Verification Plan

### Automated Tests & Verification
We will run a browser automated validation using Playwright/browser-subagent to test the core flows:
1. Load `/` (Home page) to confirm successful rendering.
2. Go to `/book` and submit a booking.
3. Verify that the booking shows up in `/dashboard` (Patient view) and `/admin` (Admin view).
4. Update the booking status from the `/admin` view and confirm it updates on `/dashboard`.
5. Cancel/Delete the booking and confirm removal.

### Manual Verification
- We will provide a clean startup instruction in a `walkthrough.md` for launching both frontend and backend dev servers simultaneously.
