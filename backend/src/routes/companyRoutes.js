// It defines all API endpoints related to a company profile and protects them using JWT authentication.
const express=require('express');
const router=express.Router();
const companyController=require('../controllers/comapnyController');
const authMiddleware=require('../middleware/authMiddleware');
const {
    validateCompanyProfile,
    handleValidationErrors
}=require('../middleware/validationMiddleware');


//all company routes require authentication
router.use(authMiddleware); //Every route below requires authentication



// Company profile routes
router.post('/create', validateCompanyProfile, handleValidationErrors, companyController.createCompanyProfile); //create → Create new company profile
router.get('/profile', companyController.getCompanyProfile); //profile → Get company profile and also Fetches company profile for logged-in user
router.put('/update', companyController.updateCompanyProfile); //update → Update company profile

// Upload routes
router.post('/upload-logo', companyController.uploadLogo); //upload-logo → Upload company logo
router.post('/upload-banner', companyController.uploadBanner); //upload-banner → Upload company banner

module.exports = router;



// It is mounted in server.js like this:
// app.use('/api/company', companyRoutes);
// So the final URLs are:
// POST /api/company/create
// GET  /api/company/profile
// PUT  /api/company/update
// POST /api/company/upload-logo
// POST /api/company/upload-banner