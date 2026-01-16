-- ================================================
-- Company Registration App - SQL Queries
-- ================================================
-- Database: PostgreSQL
-- Purpose: Database setup, maintenance, and common queries
-- ================================================

-- ================================================
-- 1. DATABASE SETUP
-- ================================================

-- Create database
CREATE DATABASE company_registration;

-- Connect to database
\c company_registration;

-- ================================================
-- 2. TABLE CREATION
-- ================================================

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    mobile_no VARCHAR(20),
    signup_type CHAR(1) DEFAULT 'e' CHECK (signup_type IN ('e', 'g', 'f')),
    otp VARCHAR(10),
    is_mobile_verified BOOLEAN DEFAULT FALSE,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_email VARCHAR(255),
    company_phone VARCHAR(20),
    company_website VARCHAR(255),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    description TEXT,
    organization_type VARCHAR(100),
    year_established VARCHAR(4),
    vision TEXT,
    social_links JSONB,
    logo_url TEXT,
    banner_url TEXT,
    completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 3. INDEXES FOR PERFORMANCE
-- ================================================

-- Index on user email for faster login
CREATE INDEX idx_users_email ON users(email);

-- Index on mobile number for OTP verification
CREATE INDEX idx_users_mobile ON users(mobile_no);

-- Index on user_id in companies for faster lookups
CREATE INDEX idx_companies_user_id ON companies(user_id);

-- Index on company name for search
CREATE INDEX idx_companies_name ON companies(company_name);

-- ================================================
-- 4. COMMON SELECT QUERIES
-- ================================================

-- Get all users
SELECT id, email, full_name, mobile_no, is_mobile_verified, created_at 
FROM users 
ORDER BY created_at DESC;

-- Get user by email
SELECT * FROM users WHERE email = 'user@example.com';

-- Get user with company details
SELECT 
    u.id, u.email, u.full_name, u.mobile_no, u.is_mobile_verified,
    c.company_name, c.company_email, c.industry, c.logo_url, c.completion_percentage
FROM users u
LEFT JOIN companies c ON u.id = c.user_id
WHERE u.email = 'user@example.com';

-- Get all companies with user info
SELECT 
    c.id, c.company_name, c.company_email, c.industry, c.company_size,
    c.completion_percentage, c.created_at,
    u.full_name as owner_name, u.email as owner_email
FROM companies c
JOIN users u ON c.user_id = u.id
ORDER BY c.created_at DESC;

-- Get company by user_id
SELECT * FROM companies WHERE user_id = 1;

-- Get verified users only
SELECT * FROM users WHERE is_mobile_verified = TRUE;

-- Get unverified users
SELECT * FROM users WHERE is_mobile_verified = FALSE;

-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- Count total companies
SELECT COUNT(*) as total_companies FROM companies;

-- Count companies by industry
SELECT industry, COUNT(*) as count 
FROM companies 
WHERE industry IS NOT NULL
GROUP BY industry 
ORDER BY count DESC;

-- Get companies with completion percentage
SELECT company_name, completion_percentage, created_at
FROM companies
ORDER BY completion_percentage DESC, created_at DESC;

-- ================================================
-- 5. INSERT QUERIES (EXAMPLES)
-- ================================================

-- Insert new user (manually - normally done via API)
INSERT INTO users (email, password_hash, full_name, gender, mobile_no, signup_type)
VALUES ('test@example.com', '$2a$10$hashedpassword', 'Test User', 'M', '1234567890', 'e');

-- Insert company for user
INSERT INTO companies (
    user_id, company_name, company_email, company_phone, 
    industry, company_size, address, city, country
)
VALUES (
    1, 'Test Company', 'info@testcompany.com', '123-456-7890',
    'Technology', '10-50', '123 Main St', 'New York', 'USA'
);

-- ================================================
-- 6. UPDATE QUERIES
-- ================================================

-- Update user profile
UPDATE users 
SET full_name = 'Updated Name', updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Verify mobile number
UPDATE users 
SET is_mobile_verified = TRUE, otp = NULL
WHERE id = 1;

-- Update company details
UPDATE companies
SET 
    company_name = 'New Company Name',
    description = 'Updated description',
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = 1;

-- Update company logo
UPDATE companies
SET logo_url = 'https://cloudinary.com/logo.png'
WHERE user_id = 1;

-- Update completion percentage
UPDATE companies
SET completion_percentage = 100
WHERE id = 1;

-- Clear reset token after password reset
UPDATE users
SET reset_token = NULL, reset_token_expiry = NULL
WHERE id = 1;

-- ================================================
-- 7. DELETE QUERIES
-- ================================================

-- Delete user (will cascade delete company)
DELETE FROM users WHERE id = 1;

-- Delete company only
DELETE FROM companies WHERE id = 1;

-- Delete unverified users older than 7 days
DELETE FROM users 
WHERE is_mobile_verified = FALSE 
AND created_at < NOW() - INTERVAL '7 days';

-- Delete expired reset tokens
UPDATE users 
SET reset_token = NULL, reset_token_expiry = NULL
WHERE reset_token_expiry < NOW();

-- ================================================
-- 8. DATA CLEANUP & MAINTENANCE
-- ================================================

-- Truncate all data (DANGEROUS - use with caution!)
TRUNCATE TABLE companies, users RESTART IDENTITY CASCADE;

-- Delete all companies
DELETE FROM companies;

-- Delete all users
DELETE FROM users;

-- Reset auto-increment counters
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE companies_id_seq RESTART WITH 1;

-- Vacuum database (optimize storage)
VACUUM FULL;

-- ================================================
-- 9. SEARCH QUERIES
-- ================================================

-- Search companies by name
SELECT * FROM companies 
WHERE company_name ILIKE '%search_term%';

-- Search users by email or name
SELECT * FROM users 
WHERE email ILIKE '%search%' OR full_name ILIKE '%search%';

-- Find companies in specific industry
SELECT * FROM companies WHERE industry = 'Technology';

-- Find companies by size
SELECT * FROM companies WHERE company_size = '10-50';

-- Find incomplete company profiles
SELECT company_name, completion_percentage 
FROM companies 
WHERE completion_percentage < 100
ORDER BY completion_percentage ASC;

-- ================================================
-- 10. ANALYTICS QUERIES
-- ================================================

-- User registration stats by date
SELECT 
    DATE(created_at) as registration_date,
    COUNT(*) as users_count
FROM users
GROUP BY DATE(created_at)
ORDER BY registration_date DESC;

-- Company registration stats
SELECT 
    DATE(created_at) as registration_date,
    COUNT(*) as companies_count
FROM companies
GROUP BY DATE(created_at)
ORDER BY registration_date DESC;

-- Average completion percentage
SELECT AVG(completion_percentage) as avg_completion
FROM companies;

-- Users without companies
SELECT u.id, u.email, u.full_name, u.created_at
FROM users u
LEFT JOIN companies c ON u.id = c.user_id
WHERE c.id IS NULL;

-- Most popular industries
SELECT 
    industry, 
    COUNT(*) as company_count,
    ROUND(AVG(completion_percentage), 2) as avg_completion
FROM companies
WHERE industry IS NOT NULL
GROUP BY industry
ORDER BY company_count DESC;

-- ================================================
-- 11. BACKUP & RESTORE
-- ================================================

-- Create backup (run from terminal)
-- pg_dump -U postgres -d company_registration -F c -b -v -f backup.dump

-- Restore from backup (run from terminal)
-- pg_restore -U postgres -d company_registration -v backup.dump

-- Export to SQL file
-- pg_dump -U postgres -d company_registration > backup.sql

-- Restore from SQL file
-- psql -U postgres -d company_registration < backup.sql

-- ================================================
-- 12. USEFUL ADMIN QUERIES
-- ================================================

-- Check database size
SELECT pg_size_pretty(pg_database_size('company_registration'));

-- Check table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Show table structure
\d users
\d companies

-- List all indexes
SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';

-- ================================================
-- 13. TESTING QUERIES
-- ================================================

-- Create test user
INSERT INTO users (email, password_hash, full_name, gender, mobile_no, is_mobile_verified)
VALUES ('test@test.com', '$2a$10$test', 'Test User', 'M', '1234567890', TRUE)
RETURNING id;

-- Create test company
INSERT INTO companies (
    user_id, company_name, company_email, industry, 
    company_size, completion_percentage
)
VALUES (1, 'Test Company', 'test@company.com', 'Technology', '10-50', 80);

-- Verify test data
SELECT u.email, c.company_name, c.completion_percentage
FROM users u
LEFT JOIN companies c ON u.id = c.user_id
WHERE u.email = 'test@test.com';

-- ================================================
-- 14. PASSWORD & SECURITY QUERIES
-- ================================================

-- Find users with reset tokens
SELECT id, email, reset_token_expiry 
FROM users 
WHERE reset_token IS NOT NULL;

-- Clear OTP for all users
UPDATE users SET otp = NULL;

-- Force verify all users (for testing only)
UPDATE users SET is_mobile_verified = TRUE;

-- ================================================
-- 15. COMMON TROUBLESHOOTING
-- ================================================

-- Check for duplicate emails
SELECT email, COUNT(*) 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Check for orphaned companies (shouldn't happen with CASCADE)
SELECT c.id, c.company_name 
FROM companies c
LEFT JOIN users u ON c.user_id = u.id
WHERE u.id IS NULL;

-- Find users created today
SELECT * FROM users 
WHERE DATE(created_at) = CURRENT_DATE;

-- Find companies created this week
SELECT * FROM companies 
WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE);

-- ================================================
-- END OF SQL QUERIES FILE
-- ================================================
