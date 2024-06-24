const { Pool } = require('pg');

const pool = new Pool({
    user: 'ister',
    host: 'localhost',
    database: 'academic_certificates',
    password: '1ster',
    port: 5432,
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    document_id VARCHAR(255) NOT NULL,
    course VARCHAR(255) NOT NULL,
    description TEXT,
    issued_at VARCHAR(255) NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    tx_hash VARCHAR(255) NOT NULL
);
`;

const initializeDatabase = async () => {
    try {
        await pool.query(createTableQuery);
        console.log('Table created successfully or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
        process.exit(1); 
    }
};

module.exports = initializeDatabase;
