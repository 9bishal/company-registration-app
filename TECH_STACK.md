# 📚 Technology Stack & Libraries Reference

## Complete List of Technologies Used in Company Registration App

---

## 🔙 Backend Technologies

### **Core Framework**
| Library | Version | Purpose |
|---------|---------|---------|
| **Node.js** | v18+ | JavaScript runtime environment |
| **Express.js** | ^4.18.0 | Web application framework for building REST APIs |

### **Database**
| Library | Version | Purpose |
|---------|---------|---------|
| **PostgreSQL** | v14+ | Relational database system |
| **pg (node-postgres)** | ^8.11.0 | PostgreSQL client for Node.js |

### **Authentication & Security**
| Library | Version | Purpose |
|---------|---------|---------|
| **jsonwebtoken (JWT)** | ^9.0.0 | Create and verify authentication tokens |
| **bcrypt** | ^5.1.0 | Hash and compare passwords (10 salt rounds) |
| **express-validator** | ^7.0.0 | Input validation and sanitization |
| **cors** | ^2.8.5 | Enable Cross-Origin Resource Sharing |

### **Email Service**
| Library | Version | Purpose |
|---------|---------|---------|
| **nodemailer** | ^6.9.0 | Send emails (OTP verification, password reset) |

### **File Upload & Storage**
| Library | Version | Purpose |
|---------|---------|---------|
| **multer** | ^1.4.5 | Handle multipart/form-data for file uploads |
| **cloudinary** | ^1.40.0 | Cloud-based image storage and delivery |

### **Utilities**
| Library | Version | Purpose |
|---------|---------|---------|
| **dotenv** | ^16.3.0 | Load environment variables from .env file |
| **nodemon** | ^3.0.0 | Auto-restart server during development |

---

## 🎨 Frontend Technologies

### **Core Framework**
| Library | Version | Purpose |
|---------|---------|---------|
| **React** | ^18.2.0 | UI library for building component-based interfaces |
| **React DOM** | ^18.2.0 | React rendering for web applications |
| **Vite** | ^5.0.0 | Fast build tool and development server |

### **Routing**
| Library | Version | Purpose |
|---------|---------|---------|
| **React Router** | ^6.20.0 | Client-side routing and navigation |

### **State Management**
| Library | Version | Purpose |
|---------|---------|---------|
| **Redux Toolkit** | ^2.0.0 | Modern Redux with simplified API |
| **React Redux** | ^9.0.0 | React bindings for Redux |

### **UI Framework & Components**
| Library | Version | Purpose |
|---------|---------|---------|
| **Material-UI (MUI)** | ^5.15.0 | React component library with Material Design |
| **@mui/icons-material** | ^5.15.0 | Material Design icons for React |
| **@emotion/react** | ^11.11.0 | CSS-in-JS library (required by MUI) |
| **@emotion/styled** | ^11.11.0 | Styled component API for Emotion |

### **HTTP Client**
| Library | Version | Purpose |
|---------|---------|---------|
| **Axios** | ^1.6.0 | Promise-based HTTP client for API calls |

### **Optional Authentication**
| Library | Version | Purpose |
|---------|---------|---------|
| **Firebase** | ^10.7.0 | Google/Facebook authentication (optional) |

---

## 🗄️ Database Details

### **PostgreSQL Features Used**
- **JSONB Data Type** - Store social media links flexibly
- **Foreign Keys** - User-Company relationship with CASCADE delete
- **Indexes** - Optimize queries on email, mobile_no, user_id
- **Constraints** - CHECK constraints for gender, signup_type
- **Timestamps** - Auto-updated created_at and updated_at

### **Tables**
1. **users** - Authentication and profile data
2. **companies** - Company information and metadata

---

## 🔐 Security Implementations

### **Authentication Flow**
```
1. Bcrypt - Hash passwords before storing (10 salt rounds)
2. JWT - Issue tokens after successful login (90-day expiry)
3. OTP - Generate 6-digit code for mobile verification
4. Email - Send OTP via Nodemailer SMTP service
5. Token Storage - Store in Redux + localStorage
6. Protected Routes - Verify JWT on both frontend and backend
```

### **Security Features**
- ✅ Password hashing with Bcrypt
- ✅ JWT authentication tokens
- ✅ OTP email verification
- ✅ Protected API routes with middleware
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ XSS protection
- ✅ Environment variable protection (.env)

---

## 📧 Email Service Configuration

### **Nodemailer Setup**
```javascript
Service: SMTP (Gmail, Outlook, custom)
Authentication: Username + App Password
Features:
  - OTP delivery for mobile verification
  - Password reset emails
  - Welcome emails (optional)
  - Company registration confirmation
```

### **Email Templates**
- Mobile verification OTP
- Password reset token
- Registration confirmation

---

## ☁️ Cloudinary Integration

### **Features Used**
- **Image Upload** - Logo and banner images
- **Signed URLs** - Secure access to uploaded images
- **Transformations** - Automatic image optimization
- **CDN Delivery** - Fast global content delivery
- **Storage Management** - Unlimited scalable storage

### **Supported Formats**
- JPG/JPEG
- PNG
- WebP (auto-conversion)

### **Validations**
- Max file size: 5MB
- Image dimensions: Flexible
- Format validation: Client & server-side

---

## 🎨 Material-UI Components Used

### **Layout Components**
- `Box` - Flexible container
- `Container` - Responsive centered container
- `Grid` - Responsive grid system
- `Stack` - Vertical/horizontal stack
- `Drawer` - Sidebar navigation

### **Input Components**
- `TextField` - Text input fields
- `Button` - Action buttons
- `Select` - Dropdown menus
- `Checkbox` - Boolean inputs
- `Radio` - Single choice selection
- `IconButton` - Icon-based buttons

### **Display Components**
- `Typography` - Text with variants
- `Card` - Content containers
- `Avatar` - User/company images
- `Chip` - Small labels
- `Badge` - Notification indicators
- `Alert` - Success/error messages

### **Navigation Components**
- `AppBar` - Top navigation bar
- `Toolbar` - AppBar content container
- `Menu` - Dropdown menus
- `List` - Vertical lists
- `ListItem` - List entries

### **Feedback Components**
- `CircularProgress` - Loading spinner
- `LinearProgress` - Progress bar
- `Snackbar` - Toast notifications
- `Dialog` - Modal dialogs
- `Backdrop` - Full-screen overlay

### **Data Display**
- `Table` - Data tables
- `Stepper` - Multi-step wizard
- `Divider` - Visual separators

---

## 🔄 Redux State Management

### **Slices Implemented**
1. **authSlice** - User authentication state
   - User data
   - JWT token
   - Temp token (for verification)
   - Mobile verification status
   - Login/logout actions

### **Redux Toolkit Features**
- `createSlice` - Simplified reducer creation
- `createAsyncThunk` - Async action creators
- `configureStore` - Store setup with middleware
- Redux DevTools integration

---

## 🛣️ React Router Setup

### **Route Types**
- **Public Routes** - Login, Register, Forgot Password
- **Verification Routes** - OTP verification (temp token)
- **Protected Routes** - Dashboard, Company Setup (JWT required)
- **Company Routes** - Features requiring company profile

### **Route Guards**
- `ProtectedRoute` - Checks JWT authentication
- `CompanyCheck` - Verifies company profile exists
- `RootRedirect` - Smart redirect based on auth status

---

## 🎯 API Endpoints Structure

### **Authentication Endpoints**
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/verify-mobile     - Verify OTP
POST   /api/auth/resend-otp        - Resend verification OTP
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password with token
GET    /api/auth/profile           - Get user profile (protected)
```

### **Company Endpoints**
```
POST   /api/company/create         - Create company profile (protected)
GET    /api/company/profile        - Get company details (protected)
PUT    /api/company/update         - Update company info (protected)
POST   /api/company/upload-logo    - Upload company logo (protected)
POST   /api/company/upload-banner  - Upload banner image (protected)
GET    /api/company/completion     - Get profile completion % (protected)
```

---

## 📊 Database Schema

### **Users Table**
```sql
- id (SERIAL PRIMARY KEY)
- email (VARCHAR, UNIQUE, NOT NULL)
- password_hash (VARCHAR, NOT NULL)
- full_name (VARCHAR, NOT NULL)
- gender (CHAR: M/F)
- mobile_no (VARCHAR)
- signup_type (CHAR: e/g/f - email/google/facebook)
- otp (VARCHAR)
- is_mobile_verified (BOOLEAN)
- reset_token (VARCHAR)
- reset_token_expiry (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **Companies Table**
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER, FOREIGN KEY → users.id)
- company_name (VARCHAR, NOT NULL)
- company_email (VARCHAR)
- company_phone (VARCHAR)
- company_website (VARCHAR)
- industry (VARCHAR)
- company_size (VARCHAR)
- address (TEXT)
- city (VARCHAR)
- state (VARCHAR)
- zip_code (VARCHAR)
- country (VARCHAR)
- description (TEXT)
- organization_type (VARCHAR)
- year_established (VARCHAR)
- vision (TEXT)
- social_links (JSONB)
- logo_url (TEXT)
- banner_url (TEXT)
- completion_percentage (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🚀 Development Tools

### **Backend Dev Tools**
- **Nodemon** - Auto-restart on file changes
- **Postman** - API testing (optional)
- **PostgreSQL CLI (psql)** - Database management

### **Frontend Dev Tools**
- **Vite Dev Server** - Hot module replacement
- **React DevTools** - Component inspection
- **Redux DevTools** - State debugging
- **Browser DevTools** - Network and console

---

## 📦 Package.json Scripts

### **Backend Scripts**
```json
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

### **Frontend Scripts**
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## 🌍 Environment Variables

### **Backend (.env)**
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

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5001
VITE_FIREBASE_API_KEY=your_firebase_key (optional)
```

---

## 💡 Key Features Summary

### **Authentication System**
- Email/password registration
- Bcrypt password hashing
- JWT token authentication
- OTP email verification
- Password reset functionality
- Session persistence

### **Company Management**
- Multi-step setup wizard (4 steps)
- Logo and banner upload
- Social media links (JSONB storage)
- Company details and vision
- Profile completion tracking
- Edit and update capabilities

### **Image Upload**
- Cloudinary integration
- Drag-and-drop support
- Image preview
- Format validation (JPG, PNG)
- Size validation (max 5MB)
- Secure URL generation

### **UI/UX**
- Mobile responsive design
- Material-UI components
- Loading states
- Error handling
- Toast notifications
- Sidebar navigation
- Dark/light theme support (optional)

---

## 📱 Mobile Responsive Features

- Hamburger menu for mobile
- Collapsible sidebar
- Touch-friendly buttons
- Responsive grid layouts
- Mobile-optimized forms
- Swipe gestures (optional)
- Responsive typography

---

## 🎓 Best Practices Implemented

### **Code Quality**
- ✅ Modular component structure
- ✅ Separation of concerns
- ✅ Reusable components
- ✅ Consistent naming conventions
- ✅ Comprehensive comments
- ✅ Error boundaries

### **Security**
- ✅ Environment variables
- ✅ Password hashing
- ✅ JWT authentication
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CORS configuration

### **Performance**
- ✅ Database indexing
- ✅ Lazy loading (optional)
- ✅ Image optimization (Cloudinary)
- ✅ Code splitting (Vite)
- ✅ Caching strategies

### **Maintainability**
- ✅ Clean code structure
- ✅ Documentation
- ✅ Git version control
- ✅ Environment configuration
- ✅ Error logging

---

## 🔗 External Services

1. **Cloudinary** - Image hosting and CDN
2. **SMTP Service** - Email delivery (Gmail/Outlook)
3. **PostgreSQL** - Database hosting
4. **Firebase** (Optional) - Social authentication

---

## 📚 Learning Resources

- **React Documentation**: https://react.dev
- **Material-UI Docs**: https://mui.com
- **Redux Toolkit**: https://redux-toolkit.js.org
- **Express.js Guide**: https://expressjs.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **JWT.io**: https://jwt.io
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

## ✅ Production Ready Checklist

- [x] Environment variables configured
- [x] Database migrations ready
- [x] API error handling
- [x] Input validation
- [x] Authentication security
- [x] CORS configuration
- [x] Image upload limits
- [x] Mobile responsive
- [x] Loading states
- [x] Error messages
- [x] Documentation complete
- [x] Git repository clean

---

## 🎯 Deployment Recommendations

### **Backend**
- Heroku
- Railway
- DigitalOcean
- AWS EC2
- Render

### **Frontend**
- Vercel (recommended for Vite)
- Netlify
- Cloudflare Pages
- GitHub Pages

### **Database**
- Heroku Postgres
- AWS RDS
- DigitalOcean Database
- Supabase
- Neon

---

## 📞 Support & Documentation

- **GitHub Repository**: https://github.com/9bishal/company-registration-app
- **README.md**: Complete setup instructions
- **PRESENTATION_GUIDE.md**: Video presentation guide
- **database/queries.sql**: All SQL queries

---

**Last Updated**: January 16, 2026  
**Version**: 1.0.0  
**Author**: Bishal Kumar Shah
