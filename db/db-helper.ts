const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('./db/AllPrintings.sqlite');

export function getCardBySetCodeAndNumber(setCode: string, number: string): Promise<any> {
    const query = 'SELECT * FROM cards WHERE setCode = ? AND number = ?';

    return new Promise((resolve, reject) => {
        db.get(query, [setCode, number], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}
