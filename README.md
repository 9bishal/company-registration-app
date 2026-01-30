# Company Registration App

A full-stack web application for company registration with secure authentication, mobile verification, and profile management.

## 🚀 Features

### Authentication & Security
- **User Registration** with email and mobile number
- **Mobile OTP Verification** via email/SMS
- **Secure Login** with JWT authentication
- **Password Reset** with 6-digit OTP
- **Session Management** with localStorage persistence

### Company Management
- **Multi-Step Company Setup**
  - Step 1: Logo & Banner Upload (Cloudinary)
  - Step 2: Social Media Links
  - Step 3: Founding Information
  - Step 4: Contact Details
- **Company Dashboard** with profile completion tracking
- **Edit Company Profile** with pre-filled data
- **Image Upload** with preview and validation

### UI/UX
- **Mobile Responsive** design for all devices
- **Material-UI** components for modern look
- **Sidebar Navigation** with hamburger menu on mobile
- **Protected Routes** with authentication guards
- **Loading States** and error handling

## 📁 Project Structure

```
company-registration-app/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express server entry point
│   │   ├── config/
│   │   │   └── database.js        # PostgreSQL connection
│   │   ├── controllers/
│   │   │   ├── authControlers.js  # Authentication logic
│   │   │   ├── comapnyController.js   # Company CRUD operations
│   │   │   └── forgetPasswordController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT verification
│   │   │   └── validationMiddleware.js
│   │   ├── models/                # (Database tables created in SQL)
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # Auth API endpoints
│   │   │   └── companyRoutes.js   # Company API endpoints
│   │   ├── services/
│   │   │   └── emailService.js    # Email sending (SMTP)
│   │   └── utils/
│   │       └── cloudinaryUpload.js # Image upload to Cloudinary
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── main.jsx               # React app entry point
    │   ├── App.jsx                # Main app component
    │   ├── routes.jsx             # Route configuration
    │   ├── api/
    │   │   ├── axiosInstance.js   # Axios setup with interceptors
    │   │   ├── authAPI.js         # Auth API calls
    │   │   └── companyAPI.js      # Company API calls
    │   ├── components/
    │   │   ├── Layout.jsx         # Main layout with sidebar
    │   │   ├── Sidebar.jsx        # Navigation sidebar
    │   │   ├── ProtectedRoute.jsx # Auth guard
    │   │   ├── CompanyCheck.jsx   # Company profile guard
    │   │   └── RootRedirect.jsx   # Smart root redirect
    │   ├── pages/
    │   │   ├── Login.jsx          # Login page
    │   │   ├── Register.jsx       # Registration page
    │   │   ├── VerifyMobile.jsx   # OTP verification
    │   │   ├── ForgetPassword.jsx # Password reset
    │   │   ├── CompanySetupNew.jsx    # Company setup wizard
    │   │   ├── DashboardEnhanced.jsx  # Company dashboard
    │   │   └── company-setup/
    │   │       ├── Step1Logo.jsx  # Logo/Banner upload
    │   │       ├── Step2Social.jsx    # Social links
    │   │       ├── Step3Founding.jsx  # Founding info
    │   │       └── Step4Contact.jsx   # Contact details
    │   ├── store/
    │   │   ├── store.js           # Redux store configuration
    │   │   └── slices/
    │   │       └── authSlice.js   # Auth state management
    │   └── utils/
    │       ├── firebaseAuth.js    # Firebase authentication
    │       └── firebaseStorage.js # Firebase storage
    └── package.json
│
└── database/
    └── queries.sql                # SQL queries for database management
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email sending
- **Cloudinary** for image storage
- **Multer** for file upload handling

### Frontend
- **React 18** with Vite
- **Redux Toolkit** for state management
- **React Router v6** for navigation
- **Material-UI (MUI)** for components
- **Axios** for API calls
- **Firebase** (optional) for additional auth

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- Cloudinary account for image storage
- SMTP credentials for email sending

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd company-registration-app
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Database Setup**
- Create PostgreSQL database
- Run SQL queries from `database/queries.sql` to create tables
- See `backend/src/config/database.js` for connection config
- Or let the app auto-create tables on first run

### SQL Database Management

The `database/queries.sql` file contains all SQL commands needed for:
- **Database Setup**: Create tables with proper constraints
- **CRUD Operations**: Insert, update, delete records
- **Analytics Queries**: User statistics, company metrics, OTP analytics
- **Admin Tasks**: User management, data cleanup, backups

Run queries using:
```bash
# Connect to PostgreSQL
psql -U postgres -d company_registration

# Run queries from file
psql -U postgres -d company_registration -f database/queries.sql
```

### Environment Variables

**Backend (.env)**
```env
# Server
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=company_registration
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRY=90d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 📱 User Flow

1. **Registration**
   - User registers with email, password, name, gender, mobile
   - Backend sends 6-digit OTP via email/SMS
   - User redirected to verification page

2. **Mobile Verification**
   - User enters OTP
   - Backend validates OTP
   - User authenticated and token stored
   - Redirected to company setup

3. **Company Setup**
   - Multi-step form with progress tracking
   - Upload logo and banner images
   - Enter company details
   - Submit and redirect to dashboard

4. **Dashboard**
   - View company profile
   - See completion percentage
   - Edit company information
   - Access protected features

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** with bcrypt (10 rounds)
- **OTP Verification** for mobile numbers
- **Protected Routes** with authentication guards
- **CORS Configuration** for API security
- **Input Validation** on both client and server
- **SQL Injection Prevention** with parameterized queries
- **XSS Protection** with sanitized inputs

## 🎨 Key Features

### Mobile Responsive
- Hamburger menu on mobile devices
- Responsive sidebar with drawer
- Mobile-optimized forms and layouts
- Touch-friendly UI elements

### Image Upload
- Cloudinary integration for scalable storage
- Image preview before upload
- File size validation (max 5MB)
- Support for JPG, PNG formats
- Remove/change uploaded images

### State Management
- Redux Toolkit for global state
- Persistent authentication with localStorage
- Temporary token storage for verification
- Optimistic UI updates

### Error Handling
- Comprehensive error messages
- Loading states for all async operations
- Form validation with helpful hints
- API error handling with user-friendly messages

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-mobile` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get user profile

### Company
- `POST /api/company/create` - Create company profile
- `GET /api/company/profile` - Get company profile
- `PUT /api/company/update` - Update company profile
- `POST /api/company/upload-logo` - Upload company logo
- `POST /api/company/upload-banner` - Upload banner image
- `GET /api/company/completion-percentage` - Get profile completion

## 🧪 Testing

### Test OTP
- Master OTP: `123456` (works for all users in development)
- Check email for actual OTP in production

### Test Flow
1. Register with valid email and mobile
2. Check email for OTP
3. Verify mobile with OTP
4. Complete company setup
5. View dashboard
6. Edit company profile
7. Logout and login again

## 📦 Deployment

### Backend
- Deploy to Heroku, Railway, or DigitalOcean
- Set environment variables
- Ensure PostgreSQL database is accessible
- Configure CORS for production domain

### Frontend
- Deploy to Vercel, Netlify, or Cloudflare Pages
- Update API base URL for production
- Build with `npm run build`
- Serve static files

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Bishal Kumar Shah - Initial work

## 🙏 Acknowledgments

- Material-UI for beautiful components
- Cloudinary for image hosting
- Redux Toolkit for state management
- Express.js for robust backend
