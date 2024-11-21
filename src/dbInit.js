import getCourses from './utils.js';
import { getUsers } from './utils.js';

export default (db) => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE courses (
        id INTEGER PRIMARY KEY,
        coursename varchar(255) NOT NULL,
        description varchar(255) NOT NULL
      );
    `);

    db.run(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        password NUMBER NOT NULL
        );
      `);
  });

  const coursesStmt = db.prepare('INSERT INTO courses VALUES (?, ?, ?)');
  getCourses().forEach((course) => coursesStmt.run(null, course.coursename, course.description));
  coursesStmt.finalize();

  const usersStmt = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?)');
  getUsers().forEach((user) => usersStmt.run(null, user.name, user.email, user.password));
  usersStmt.finalize();
};
