const express=require('express'); //web framework for Node.js
const cors=require('cors'); //cors → Allows frontend (React) to access backend APIs
const helmet=require('helmet'); //helmet → Adds HTTP security headers
const morgan=require('morgan');//morgan → Logs HTTP requests (useful for debugging)
require('dotenv').config(); //dotenv → Loads environment variables from .env

const app=express(); //app is your server instance and also used to create express application


//Middlewear
app.use(helmet()); //helmet → Adds HTTP security headers

// CORS configuration - allow multiple frontend ports in development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', 
  'http://localhost:5175',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(morgan('dev')); //morgan → Logs HTTP requests (useful for debugging)
app.use(express.json()); //express.json() → Parses JSON request bodies
app.use(express.urlencoded({extended:true})); //express.urlencoded() → Parses URL-encoded request bodies

// Health check route , Used to verify if server is alive
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});


//import routes

const authRoutes=require('./routes/authRoutes');
const companyRoutes=require('./routes/companyRoutes');

//use routes
app.use('/api/auth',authRoutes);     //authRoutes → Handles authentication (login, register)
app.use('/api/company',companyRoutes); //companyRoutes → Handles company registration



// 404 handler, Runs when no route matches
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});
    
// Error handling middleware, Runs when any error occurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});


// Start server, Runs when server starts
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});