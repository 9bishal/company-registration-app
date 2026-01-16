// PostgreSQL Database Configuration
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'company_registration'
});

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        mobile_no VARCHAR(20),
        gender CHAR(1),
        reset_token VARCHAR(255),
        reset_token_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Companies table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        company_name VARCHAR(255),
        company_email VARCHAR(255),
        company_phone VARCHAR(20),
        company_website VARCHAR(255),
        industry VARCHAR(100),
        company_size VARCHAR(50),
        address VARCHAR(500),
        city VARCHAR(100),
        state VARCHAR(100),
        zip_code VARCHAR(20),
        country VARCHAR(100),
        logo_url VARCHAR(500),
        banner_url VARCHAR(500),
        description TEXT,
        setup_completed BOOLEAN DEFAULT FALSE,
        completion_percentage INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Test database connection
pool.connect((err, client) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('✅ Connected to PostgreSQL database');
  client.release();
});

// Export pool and initializeDatabase
module.exports = {
  pool,
  initializeDatabase
};
