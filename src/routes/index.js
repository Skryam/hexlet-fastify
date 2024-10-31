import users from './users.js';
import courses from './courses.js';
import sessions from './sessions.js';

const controllers = [
  users,
  courses,
  sessions,
];

export default (app) => controllers.forEach((f) => f(app));