import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE courses (
      id INTEGER PRIMARY KEY,
      coursename varchar(255) NOT NULL,
      description varchar(255) NOT NULL
    );
  `);

  const stmt = db.prepare(`INSERT INTO courses(id, coursename, description) VALUES (?, ?, ?)`);
  stmt.run([null, 'opa', 'na'], function (err) {
    if (err) return console.log(err);
    return
  })

  db.get(`SELECT * FROM courses WHERE ID = 3`, (err, data) => {
    if (err) return console.log(err)
    return console.log(data ?? 'plox')
  })
})