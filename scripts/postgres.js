const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:admin@localhost:5432/Galmin';
const { Pool } = require('pg')

module.exports = {
    pool: new Pool({
        connectionString: connectionString,
        ssl: process.env.DATABASE_URL ? {
            rejectUnauthorized: false,
            requestCert: true
        } : false,

    }),
    connectionString: connectionString
}