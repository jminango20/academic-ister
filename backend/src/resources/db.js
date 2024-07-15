const { Pool } = require('pg');

const pool = new Pool({
    user: 'ister',
    host: 'postgres',
    database: 'academic_certificates',
    password: '1ster',
    port: 5432,
});

module.exports = pool;
