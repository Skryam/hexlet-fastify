import users from "./users.js";

export default (app, db) => {

  // BEGIN (write your solution here)
  app.get('/sessions/new', (req, res) => {
    res.view('sessions/new');
  });

  app.post('/sessions', (req, res) => {
    const { username } = req.body;
    db.get(`SELECT name FROM users WHERE name = '${username}'`, (err, data) => {
      if (data) {
        req.session.set('username', data);
        return res.redirect('/');
      } else {
        return res.view('sessions/new', { error: 'valFailed' });
      }
    });
  });

  app.post('/sessions/delete', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  })
  // END
};