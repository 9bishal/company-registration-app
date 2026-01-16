const { pool } = require('../config/database');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const { sendCompanyRegistrationSuccess } = require('../services/emailService');

/**
 * Calculate completion percentage based on filled fields
 */
const calculateCompletionPercentage = (data) => {
  const fields = [
    'company_name',
    'company_email',
    'company_phone',
    'industry',
    'company_size',
    'company_website',
    'address',
    'city',
    'state',
    'country',
    'organization_type',
    'year_established'
  ];
  
  const filledFields = fields.filter(field => data[field] && data[field].toString().trim() !== '');
  return Math.round((filledFields.length / fields.length) * 100);
};

// Create Company Profile
exports.createCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      company_name,
      company_email,
      company_phone,
      company_website,
      industry,
      company_size,
      address,
      city,
      state,
      zip_code,
      country,
      description,
      organization_type,
      year_established,
      vision,
      social_links
    } = req.body;

    // Validation
    if (!company_name || !company_email) {
      return res.status(400).json({
        success: false,
        message: 'Company name and email are required'
      });
    }

    // Check if company already exists for this user
    const existingCompany = await pool.query(
      'SELECT id FROM companies WHERE user_id = $1',
      [userId]
    );

    if (existingCompany.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You already have a company registered'
      });
    }

    // Prepare company data
    const companyData = {
      user_id: userId,
      company_name,
      company_email,
      company_phone,
      company_website,
      industry,
      company_size,
      address,
      city,
      state,
      zip_code,
      country,
      description,
      organization_type,
      year_established,
      vision
    };

    // Calculate completion percentage
    const completionPercentage = calculateCompletionPercentage(companyData);

    // Insert new company
    const newCompany = await pool.query(
      `INSERT INTO companies 
       (user_id, company_name, company_email, company_phone, company_website, 
        industry, company_size, address, city, state, zip_code, country, 
        description, organization_type, year_established, vision, social_links, completion_percentage)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING *`,
      [
        userId, company_name, company_email, company_phone, company_website,
        industry, company_size, address, city, state, zip_code, country,
        description, organization_type, year_established, vision, 
        typeof social_links === 'string' ? social_links : JSON.stringify(social_links || {}), 
        completionPercentage
      ]
    );

    // Get user email for success notification
    const userResult = await pool.query('SELECT email, full_name FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    // Send success email
    try {
      await sendCompanyRegistrationSuccess(user.email, user.full_name, company_name);
    } catch (emailErr) {
      console.error('Failed to send success email:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Company profile created successfully',
      data: {
        ...newCompany.rows[0],
        completion_percentage: completionPercentage
      }
    });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create company profile',
      error: error.message
    });
  }
};

// Get Company Profile
exports.getCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const companyResult = await pool.query(
      `SELECT * FROM companies WHERE user_id = $1`,
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    res.json({
      success: true,
      data: companyResult.rows[0]
    });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get company profile',
      error: error.message
    });
  }
};

// Update Company Profile
exports.updateCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;

    // Get existing company
    const existingCompany = await pool.query(
      'SELECT * FROM companies WHERE user_id = $1',
      [userId]
    );

    if (existingCompany.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Prepare update query dynamically
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (key !== 'user_id' && key !== 'id' && updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    // Add completion percentage calculation
    const updatedCompanyData = { ...existingCompany.rows[0], ...updateData };
    const completionPercentage = calculateCompletionPercentage(updatedCompanyData);
    
    fields.push(`completion_percentage = $${paramCount}`);
    values.push(completionPercentage);
    paramCount++;

    values.push(userId);
    
    const updateQuery = `
      UPDATE companies 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const updatedCompany = await pool.query(updateQuery, values);

    res.json({
      success: true,
      message: 'Company profile updated successfully',
      data: {
        ...updatedCompany.rows[0],
        completion_percentage: completionPercentage
      }
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update company profile',
      error: error.message
    });
  }
};

// Upload Company Logo
exports.uploadLogo = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Get existing company
    const companyResult = await pool.query(
      'SELECT id, logo_url FROM companies WHERE user_id = $1',
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const company = companyResult.rows[0];

    // Delete old logo if exists
    if (company.logo_url) {
      try {
        const publicId = company.logo_url.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`company-registration/logos/${publicId}`);
      } catch (err) {
        console.warn('Failed to delete old logo:', err.message);
      }
    }

    // Upload new logo
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      `logo_${userId}_${Date.now()}`,
      'company-registration/logos'
    );

    // Update company with new logo URL
    const updateResult = await pool.query(
      'UPDATE companies SET logo_url = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
      [uploadResult.url, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        ...updateResult.rows[0],
        logo_url: uploadResult.url
      }
    });
  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload logo',
      error: error.message
    });
  }
};

// Upload Company Banner
exports.uploadBanner = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Get existing company
    const companyResult = await pool.query(
      'SELECT id, banner_url FROM companies WHERE user_id = $1',
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const company = companyResult.rows[0];

    // Delete old banner if exists
    if (company.banner_url) {
      try {
        const publicId = company.banner_url.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`company-registration/banners/${publicId}`);
      } catch (err) {
        console.warn('Failed to delete old banner:', err.message);
      }
    }

    // Upload new banner
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      `banner_${userId}_${Date.now()}`,
      'company-registration/banners'
    );

    // Update company with new banner URL
    const updateResult = await pool.query(
      'UPDATE companies SET banner_url = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
      [uploadResult.url, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Banner uploaded successfully',
      data: {
        ...updateResult.rows[0],
        banner_url: uploadResult.url
      }
    });
  } catch (error) {
    console.error('Banner upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload banner',
      error: error.message
    });
  }
};

// Get completion percentage
exports.getCompletionPercentage = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT completion_percentage FROM companies WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    res.status(200).json({
      success: true,
      completion_percentage: result.rows[0].completion_percentage
    });
  } catch (error) {
    console.error('Get completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get completion percentage',
      error: error.message
    });
  }
};
