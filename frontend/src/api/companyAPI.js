import axiosInstance from './axiosInstance'

export const companyAPI = {
  // Create company profile
  createCompany: (companyData) => 
    axiosInstance.post('/company/create', companyData),
  
  // Get company profile
  getCompanyProfile: () => 
    axiosInstance.get('/company/profile'),
  
  // Update company profile
  updateCompany: (companyData) => 
    axiosInstance.put('/company/update', companyData),
  
  // Upload logo
  uploadLogo: (formData) => 
    axiosInstance.post('/company/upload-logo', formData),
  
  // Upload banner
  uploadBanner: (formData) => 
    axiosInstance.post('/company/upload-banner', formData)
}