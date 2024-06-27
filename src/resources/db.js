const { Pool } = require('pg');

const pool = new Pool({
    user: 'ister',
    host: 'postgres',
    // host: 'idx-academic-ister-1719265372037.cluster-m7tpz3bmgjgoqrktlvd4ykrc2m.cloudworkstations.dev',
    database: 'academic_certificates',
    password: '1ster',
    port: 5432,
});

module.exports = pool;
