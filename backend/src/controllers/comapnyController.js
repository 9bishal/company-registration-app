const pool = require('../config/database');

// Create Company Profile
exports.createCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.userId; //get logged-in user ID from JWT
    // Extract company details from request body
    const {
      company_name,
      about_company,
      organizations_type,
      industry_type,
      team_size,
      year_of_establishment,
      company_website,
      company_vision,
      headquarter_phone_no,
      social_links,
      map_location_url,
      careers_link,
      headquarter_mail_id
    } = req.body;

    // Check if company profile already exists
    const existingProfile = await pool.query(
      'SELECT * FROM company_profile WHERE owner_id = $1',
      [userId]
    );

    if (existingProfile.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Company profile already exists for this user'
      });
    }

    // Insert company profile
    const newCompany = await pool.query(
      `INSERT INTO company_profile 
       (owner_id, company_name, about_company, organizations_type, 
        industry_type, team_size, year_of_establishment, company_website,
        company_vision, headquarter_phone_no, social_links, map_location_url,
        careers_link, headquarter_mail_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        userId,
        company_name,
        about_company,
        organizations_type,
        industry_type,
        team_size,
        year_of_establishment,
        company_website,
        company_vision,
        headquarter_phone_no,
        social_links ? JSON.stringify(social_links) : null,//if social_links is not null then convert it to JSON
        map_location_url,
        careers_link,
        headquarter_mail_id
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Company profile created successfully',
      data: newCompany.rows[0]
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
    const userId = req.user.userId;//mean the user is already authenticated
//req.user was attached by JWT middleware

    //fetch comapny profile with owner details
    const companyResult = await pool.query(
      `SELECT cp.*, u.email, u.full_name, u.mobile_no
       FROM company_profile cp
       JOIN users u ON cp.owner_id = u.id
       WHERE cp.owner_id = $1`, //$1 ensure one user = 1 company
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

    // Get existing profile
    const existingProfile = await pool.query(
      'SELECT * FROM company_profile WHERE owner_id = $1',
      [userId]
    );
    //check if the company profile exists
    if (existingProfile.rows.length === 0) {
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
      if (key !== 'owner_id' && updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(key === 'social_links' ? JSON.stringify(updateData[key]) : updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(userId);
    
    const updateQuery = `
      UPDATE company_profile 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE owner_id = $${paramCount}
      RETURNING *
    `;

    const updatedProfile = await pool.query(updateQuery, values);

    res.json({
      success: true,
      message: 'Company profile updated successfully',
      data: updatedProfile.rows[0]
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

// Upload Logo (Placeholder - integrate with Cloudinary)
exports.uploadLogo = async (req, res) => {
  try {
    const userId = req.user.userId;
    // In real implementation, upload to Cloudinary and get URL
    // For now, just update with placeholder
    const logoUrl = 'https://via.placeholder.com/400x400';

    await pool.query(
      'UPDATE company_profile SET company_logo_url = $1 WHERE owner_id = $2',
      [logoUrl, userId]
    );

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: { logo_url: logoUrl }
    });
  } catch (error) {
    console.error('Upload logo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload logo',
      error: error.message
    });
  }
};

// Upload Banner (Placeholder - integrate with Cloudinary)
exports.uploadBanner = async (req, res) => {
  try {
    const userId = req.user.userId;
    // In real implementation, upload to Cloudinary and get URL
    const bannerUrl = 'https://via.placeholder.com/1500x400';

    await pool.query(
      'UPDATE company_profile SET company_banner_url = $1 WHERE owner_id = $2',
      [bannerUrl, userId]
    );

    res.json({
      success: true,
      message: 'Banner uploaded successfully',
      data: { banner_url: bannerUrl }
    });
  } catch (error) {
    console.error('Upload banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload banner',
      error: error.message
    });
  }
};