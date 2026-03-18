
# LASUSTECH Clearance System

## Project Overview
The **LASUSTECH Clearance System** is a progressive web application designed to digitize the final year clearance process for students at Lagos State University of Science and Technology. It replaces manual file movement with a digital workflow, allowing students to upload documents and officers to review them in real-time.

### Key Features
*   **Student Portal**: Document upload, status tracking, AI-powered document analysis, and digital certificate generation.
*   **Officer Dashboard**: Queue management, document verification, rejection feedback, and analytics.
*   **AI Integration**: Uses Google Gemini 3.0 Flash for preliminary document quality checks and OCR.
*   **Real-time Notifications**: Status updates via in-app alerts using React Context API.
*   **JWT Authentication**: Secure token-based authentication with automatic token refresh.

## Tech Stack
*   **Frontend Framework**: React 19
*   **Styling**: Tailwind CSS 4
*   **Icons**: Lucide React
*   **Charts**: Recharts
*   **AI/LLM**: Google GenAI SDK (`@google/genai`)
*   **Routing**: React Router DOM 7
*   **Build Tool**: Vite 6

## Prerequisites
*   Node.js >= 18.0.0
*   npm >= 9.0.0
*   A Google AI Studio API Key (for Gemini features)

## Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-org/lasustech-clearance.git
    cd lasustech-clearance
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    # Required for AI Document Analysis
    GEMINI_API_KEY=your_google_gemini_api_key_here
    ```

## Development Commands

*   **Start Development Server**
    ```bash
    npm run dev
    # Runs on http://localhost:3000 by default
    ```

*   **Build for Production**
    ```bash
    npm run build
    ```

*   **Preview Production Build**
    ```bash
    npm run preview
    ```

## Folder Structure

```
/
├── components/         # Reusable UI components (Buttons, Cards, Layouts)
│   ├── student/        # Student-specific components (PreviewModal)
│   └── ...
├── context/            # Global state (NotificationContext)
├── pages/              # Route views
│   ├── admin/          # Admin/Officer views
│   └── student/        # Student views
├── services/           # API and logic layers (mockData, geminiService)
├── types.ts            # TypeScript interfaces
├── App.tsx             # Main router/entry point
└── index.tsx           # DOM mounting
```

## Contributing
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License
Proprietary software for LASUSTECH. Unauthorized copying or distribution is strictly prohibited.
