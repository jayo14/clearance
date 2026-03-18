# LASUSTECH Digital Clearance Portal

A comprehensive full-stack digital clearance system for the Lagos State University of Science and Technology. This portal digitizes the final year clearance process, providing a seamless experience for students and administrative officers.

## 🏗️ Project Architecture

The system is built with a modern full-stack architecture:
- **Frontend**: React 19 SPA styled with Tailwind CSS 4 and shadcn/ui.
- **Backend**: Django 6.0 REST API with Django Rest Framework.
- **Authentication**: JWT-based authentication using djangorestframework-simplejwt.
- **AI Integration**: Google Gemini 3.0 Flash for automated document analysis and OCR.

## 🚀 Key Features
- **Multi-Role Portals**: Dedicated dashboards for Students, Reviewing Officers, Institution Admins, and Super Admins.
- **JWT Authentication**: Secure token-based authentication with refresh token rotation.
- **Real-time Notifications**: Live notification system for status updates and alerts.
- **AI-Powered Analysis**: Preliminary document verification and OCR using Google Gemini AI.
- **Real-time Tracking**: Monitor clearance status across Admissions, Medical, Faculty, Bursary, and more.
- **Digital Certification**: Automated generation and download of clearance certificates.
- **RESTful API**: Well-documented API with OpenAPI/Swagger documentation.
- **Responsive Design**: Mobile-first approach for accessibility on all devices.

## 📂 Project Structure
```
/
├── frontend/           # React 19 Frontend (Vite, Tailwind 4, shadcn/ui)
│   ├── components/     # UI primitives and shared components
│   ├── pages/          # Role-specific portal views
│   ├── services/       # AI integration and API logic
│   ├── context/        # Global state management (Notifications)
│   └── ...
└── backend/            # Django 6.0 Backend (REST Framework)
    ├── accounts/       # User authentication and management
    ├── institutions/   # Institution and hierarchy management
    ├── records/        # Clearance records and documents
    ├── notifications/  # Real-time notification system
    ├── clearance/      # Core project settings and URLs
    ├── manage.py       # Django management script
    └── requirements.txt
```

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 18.x
- Python >= 3.10
- Google AI Studio API Key (for Gemini features)

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the frontend directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
4. Run development server (runs on http://localhost:3000):
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the backend directory (optional for environment-specific settings):
   ```env
   SECRET_KEY=your_django_secret_key_here
   DEBUG=True
   ```
5. Run migrations and start server (runs on http://localhost:8000):
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### API Documentation
Once the backend is running, access the interactive API documentation at:
- **Swagger UI**: http://localhost:8000/api/schema/swagger-ui/
- **ReDoc**: http://localhost:8000/api/schema/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## 📄 License
Proprietary software for LASUSTECH. Unauthorized use or distribution is prohibited.
---
# clearance
