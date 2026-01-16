import axiosInstance from './axiosInstance'

export const companyAPI = {
  // Create company profile
  createCompany: (companyData) => 
    axiosInstance.post('/company/create', companyData),
  
  // Get company profile
 getCompany: () => 
    axiosInstance.get('/company/profile'),
   
  // Update company profile
  updateCompany: (companyData) => 
    axiosInstance.put('/company/update', companyData),
  
  // Get completion percentage
  getCompletionPercentage: () =>
    axiosInstance.get('/company/completion-percentage'),
  
  // Upload logo
  uploadLogo: (formData) => 
    axiosInstance.post('/company/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  
  // Upload banner
  uploadBanner: (formData) => 
    axiosInstance.post('/company/upload-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
}