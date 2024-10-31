import { users } from "./users.js";

export default (app) => {

  // BEGIN (write your solution here)
  app.get('/sessions/new', (req, res) => {
    res.view('sessions/new');
  })

  app.post('/sessions', (req, res) => {
    const { username } = req.body;
    const user = users.find((item) => item.name === username);
    console.log(users)

    if (user) {
      req.session.set('username', user.name);
    } else {
      return res.view('sessions/new', { error: 'valFailed' })
    }
    res.redirect('/')
  })

  app.post('/sessions/delete', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  })
  // END
};