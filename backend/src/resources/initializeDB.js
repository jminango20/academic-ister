const { Pool } = require('pg');

const pool = new Pool({
    user: 'ister',
    // host: 'localhost',
    host: 'postgres',
    database: 'academic_certificates',
    password: '1ster',
    port: 5432,
});

const createTableContracts = `
CREATE TABLE IF NOT EXISTS contracts (
    idContract SERIAL PRIMARY KEY,
    nameContract VARCHAR(255) NOT NULL,
    addressContract VARCHAR(255) NOT NULL,
    addressContractFactory VARCHAR(255) NOT NULL,
    active BOOL NOT NULL
);
`
;

const createTableQuery = `
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    document_id VARCHAR(255) NOT NULL,
    course VARCHAR(255) NOT NULL,
    description TEXT,
    issued_at TIMESTAMPTZ NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    tx_hash VARCHAR(255) NOT NULL,
    idContract INT NOT NULL,
    type VARCHAR(255),
    FOREIGN KEY (contract_id) REFERENCES contracts(idContract)
);
`;


const initializeDatabase = async () => {
    try {
        await pool.query(createTableQuery);
        console.log('Certificate Table created successfully or already exists');
        await pool.query(createTableContracts);
        console.log('Contract Table created successfully or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
        process.exit(1); 
    }
};

module.exports = initializeDatabase;
