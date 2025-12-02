# 💰 Vaultly - Personal & Group Finance Tracker

<div align="center">
  
  ![Vaultly](https://img.shields.io/badge/Vaultly-Finance%20Tracker-blue?style=for-the-badge)
  ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
  
  **A modern, collaborative platform for personal expense tracking and group goal management**
  
  [Frontend (Vercel)](https://vaultly-one.vercel.app) • [Backend (Render)](https://vaultly-backend.onrender.com) • [GitHub Repo](https://github.com/PinQusestion/Vaultly)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🌟 Overview

Vaultly is a comprehensive finance tracking application designed to help individuals and groups manage their expenses, set savings goals, and gain valuable insights into spending patterns. With advanced features like search, sort, filter, pagination, and data export, Vaultly makes financial management simple and efficient.

### Key Highlights

- 🔐 **Secure Authentication** - JWT-based auth with Google OAuth integration
- 📊 **Rich Analytics** - Interactive charts and visualizations for spending trends
- 👥 **Group Management** - Split expenses with friends and family
- 🎯 **Goal Tracking** - Create and monitor savings goals with progress tracking
- 📤 **Data Export** - Export reports in CSV and text formats
- 🔍 **Advanced Filtering** - Search, sort, and filter expenses effortlessly
- 📱 **Responsive Design** - Beautiful UI that works on all devices

---

## ✨ Features

### Authentication & Authorization
- User registration and login with email/password
- Google OAuth integration for seamless sign-in
- JWT-based authentication with secure httpOnly cookies
- Protected routes and role-based access control

### Expense Management
- ➕ Create, edit, and delete expenses
- 🏷️ Categorize spending (Food, Transport, Entertainment, etc.)
- 🔍 Search expenses by description
- 📊 Sort by date or amount
- 🎯 Filter by category and date range
- 📄 Pagination for efficient data loading
- 📥 Export expenses to CSV

### Dashboard & Analytics
- 📈 Real-time spending overview with KPI cards
- 📊 6-month spending trend charts
- 🥧 Category breakdown with percentages
- 📋 Recent transactions view
- 🎨 Beautiful data visualizations
- 📤 Export analytics and full reports

### Group Features
- 👥 Create and manage expense groups
- ➕ Add/remove group members
- 💸 Track shared expenses
- 🔍 View group analytics

### Goals
- 🎯 Create savings goals with target amounts
- 💰 Track contributions and progress
- ⏰ Set deadlines for goals
- 📊 Visual progress indicators
- ✏️ Update and delete goals

### Reports
- 📊 Comprehensive analytics dashboard
- 📈 Monthly spending trends
- 🏆 Top expenses tracking
- 📥 CSV export for analytics data
- 📄 Full financial report export

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **UI Library** | React 18 |
| **Styling** | TailwindCSS |
| **Icons** | Lucide React |
| **HTTP Client** | Fetch API |
| **Notifications** | React Hot Toast |
| **Authentication** | JWT + Google OAuth |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running (see [backend setup](https://github.com/PinQusestion/Vaultly))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PinQusestion/Vaultly.git
   cd Vaultly/vaultly-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.sample .env.local
   ```
   Edit `.env.local` and add your backend URL:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# For production
# NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
```

---

## 📁 Project Structure

```
vaultly-frontend/
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── dashboard/  # Dashboard page
│   │   ├── expenses/   # Expense management
│   │   ├── goals/      # Goals tracking
│   │   ├── groups/     # Group management
│   │   ├── login/      # Login page
│   │   ├── profile/    # User profile
│   │   ├── reports/    # Analytics & reports
│   │   └── signup/     # Registration page
│   ├── components/     # Reusable React components
│   │   ├── AddExpenseModal.js
│   │   ├── CreateGoalModal.js
│   │   ├── CreateGroupModal.js
│   │   ├── Navigation.js
│   │   └── ...
│   ├── hooks/          # Custom React hooks
│   │   ├── useCountUp.js
│   │   └── useGsapAnimation.js
│   └── lib/            # Utility functions
│       └── api.js      # API integration layer
├── .env.local          # Environment variables
├── next.config.mjs     # Next.js configuration
├── tailwind.config.js  # Tailwind CSS config
└── package.json        # Project dependencies
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🔌 API Integration

All API calls are centralized in `src/lib/api.js`. The application communicates with the backend using RESTful APIs:

### Key Endpoints

```javascript
// Authentication
POST   /auth/signup
POST   /auth/login
POST   /auth/logout
GET    /auth/me
GET    /auth/google
GET    /auth/google/callback

// Expenses
GET    /expenses          # Query params: search, sortBy, category, date range, pagination
POST   /expenses
PUT    /expenses/:id
DELETE /expenses/:id

// Groups
GET    /groups
POST   /groups
GET    /groups/:id
POST   /groups/:id/members
DELETE /groups/:id/members/:uid

// Goals
GET    /goals
POST   /goals
GET    /goals/:id
PUT    /goals/:id
DELETE /goals/:id
POST   /goals/:id/contribute

// Analytics
GET    /analytics/overview
GET    /analytics/trends
GET    /analytics/top-expenses
GET    /analytics/groups
GET    /analytics/goals
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import project to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Configure environment variables

3. **Add environment variables**
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Vercel will automatically deploy your app
   - Your app will be live at `https://your-app.vercel.app`

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

---

## 🎨 Features in Detail

### Dashboard
- Welcome screen for new users with onboarding guide
- Real-time statistics cards (monthly, weekly spending)
- Spending trend visualization (6-month chart)
- Category breakdown with percentages
- Recent transactions list
- Quick expense addition

### Expense Manager
- Comprehensive expense list with search
- Sort by date, amount, category
- Advanced filtering options
- Pagination controls
- Inline editing and deletion
- Batch export to CSV

### Analytics
- Interactive charts and graphs
- Category-wise spending analysis
- Monthly trends comparison
- Top expenses tracking
- Group analytics
- Goal progress visualization
- Export analytics to CSV/TXT

### Profile
- User information management
- Account statistics
- Activity summary
- Membership badges
- Achievement cards

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is part of an academic assignment. All rights reserved.

---

## 👥 Team

- **Developer**: Manan Bansal
- **Repository**: [GitHub](https://github.com/PinQusestion/Vaultly)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting platform
- Lucide for beautiful icons
- TailwindCSS for styling utilities

---

<div align="center">
  
  **Made with ❤️ using Next.js and TailwindCSS**
  
  [⭐ Star this repo](https://github.com/PinQusestion/Vaultly) if you find it helpful!

</div>
