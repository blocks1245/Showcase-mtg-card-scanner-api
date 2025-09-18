import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    ssl: { rejectUnauthorized: false }
});

// Helper for single row
async function queryOne(query: string, params: any[]) {
    const res = await pool.query(query, params);
    return res.rows[0];
}

// Helper for multiple rows
async function queryAll(query: string, params: any[]) {
    const res = await pool.query(query, params);
    return res.rows;
}

export function getCardBySetCodeAndNumber(setCode: string, number: string): Promise<any> {
    const query = 'SELECT * FROM cards WHERE setcode = $1 AND number = $2';
    return queryOne(query, [setCode, number]);
}

export function getCardByUUID(uuid: string): Promise<any> {
    const query = 'SELECT * FROM cards WHERE uuid = $1';
    return queryOne(query, [uuid]);
}

export async function addCardToScanned(uuid: string): Promise<void> {
    const card = await getCardByUUID(uuid);

    const name = card ? card.name : 'Unknown Card';
    const setCode = card ? card.setCode : 'Unknown Set';
    const number = card ? card.number : 'Unknown Number';

    const query = 'INSERT INTO scanned (uuid, name, setcode, number) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [uuid, name, setCode, number]);
}

export async function getScannedCards(): Promise<any[]> {
    const query = 'SELECT * FROM scanned';
    return queryAll(query, []);
}

export function getScannedCardByName(name: string): Promise<any[]> {
    const query = `
        SELECT name, setcode, number, POSITION(LOWER($1) IN LOWER(name)) AS relevance
        FROM scanned
        WHERE LOWER(name) LIKE '%' || LOWER($1) || '%'
        ORDER BY relevance ASC, LENGTH(name) ASC
    `;
    return queryAll(query, [name]);
}

export function getCardByName(name: string): Promise<any[]> {
    const query = `
        SELECT name, setcode, number, POSITION(LOWER($1) IN LOWER(name)) AS relevance
        FROM cards
        WHERE LOWER(name) LIKE '%' || LOWER($1) || '%'
        ORDER BY relevance ASC, LENGTH(name) ASC
    `;
    return queryAll(query, [name]);
}
