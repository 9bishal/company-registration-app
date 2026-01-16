-- Migration: Add new fields to companies table for enhanced setup
-- Run this migration to add missing fields

ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS organization_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS year_established INTEGER,
ADD COLUMN IF NOT EXISTS vision TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';

-- Update completion_percentage calculation to include new fields
COMMENT ON COLUMN companies.organization_type IS 'Type of organization (Private Limited, Public Limited, etc.)';
COMMENT ON COLUMN companies.year_established IS 'Year the company was founded';
COMMENT ON COLUMN companies.vision IS 'Company vision statement';
COMMENT ON COLUMN companies.social_links IS 'JSON object containing social media profile links';

-- Sample social_links structure:
-- {
--   "facebook": "https://facebook.com/company",
--   "twitter": "https://twitter.com/company",
--   "linkedin": "https://linkedin.com/company/company",
--   "instagram": "https://instagram.com/company"
-- }
