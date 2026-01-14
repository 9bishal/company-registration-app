// Import Pool class from pg (PostgreSQL client for Node.js)
const { Pool } = require('pg');

// Load environment variables from .env file
require('dotenv').config();

// Create a PostgreSQL connection pool
// Pool manages multiple DB connections efficiently
const pool = new Pool({
    host: process.env.DB_HOST,       // Database host
    port: process.env.DB_PORT,       // Database port (default: 5432)
    database: process.env.DB_NAME,   // Database name
    user: process.env.DB_USER,       // Database user
    password: process.env.DB_PASSWORD // Database password
});

// Test database connection when server starts
pool.connect((err, client) => {
    if (err) {
        // Log error if database connection fails
        console.error('Error connecting to the database:', err);
        return;
    }

    // Log success message if connected
    console.log('Connected to the database');

    // Release the client back to the pool
    client.release();
});

// Export pool to use in other parts of the application
module.exports = pool;
