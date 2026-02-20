import pool from './src/db';
import fs from 'fs';
import path from 'path';

async function init() {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema-aiven.sql'), 'utf8');
        const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);

        console.log('Starting DB initialization...');
        for (const statement of statements) {
            console.log('Executing:', statement.substring(0, 50) + '...');
            await pool.execute(statement);
        }
        console.log('DB initialization complete!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

init();
