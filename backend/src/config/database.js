const sqlite3 = require("sqlite3").verbose();
const path = require("path");

class Database {
  constructor(nodoId) {
    this.nodoId = nodoId;
    this.dbPath = path.join(__dirname, "../../nodos", `nodo${nodoId}.db`);
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) reject(err);
        console.log(`🤖 BD conectada: nodo${this.nodoId}.db`);
        resolve(this.db);
      });
    });
  }

  getDb() {
    return this;
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = Database;
