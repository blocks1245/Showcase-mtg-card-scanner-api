import { get } from "http";

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

export function getCardByUUID(uuid: string): Promise<any> {
    const query = 'SELECT * FROM cards WHERE uuid = ?';

    return new Promise((resolve, reject) => {
        db.get(query, [uuid], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}


export function addCardToScanned(uuid: string): Promise<void> {
    const query = 'INSERT INTO Scanned (uuid, name) VALUES (?, ?)';

    const name = getCardByUUID(uuid).then(card => card ? card.name : 'Unknown Card');

    return new Promise((resolve, reject) => {
        db.run(query, [uuid, name], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

export function getScannedCards(): Promise<any[]> {
    const query = 'SELECT * FROM Scanned';

    return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

export function getScannedCardByName(name: string): Promise<any> {
    const query = 'SELECT * FROM Scanned WHERE name = ?';

    return new Promise((resolve, reject) => {
        db.get(query, [name], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}
