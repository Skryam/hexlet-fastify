import yup from 'yup';

export default (app, db) => {

  app.get('/users/:id', { name: 'user' }, (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM users WHERE id = ${id}`, (err, user) => {
      if (err) return res.send('Ошибка сервера');
      return user ? res.view('users/showId', { user }) : res.status(404).send('User not found');
  });
});

  app.get('/users', { name: 'users' }, (req, res) => {
    const term = req.query.term ?? '';
    db.all(`
      SELECT * FROM users
      WHERE LOWER(name) LIKE LOWER('%${term}%')
        OR LOWER(email) LIKE LOWER('%${term}%')`, (err, data) => {
      if (err) return res.send('Ошибка сервера');
      res.view('users/index', { users: data, messages: res.flash() });
    }); 
  });

  app.post('/users', {
    attachValidation: true,
    schema: {
      body: yup.object({
        name: yup.string().min(2).required(),
        email: yup.string().email().required(),
        password: yup.string().min(5),
        passwordConfirmation: yup.string(),
      }),
    },
    validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
      if (data.password !== data.passwordConfirmation) {
        return {
          error: Error('Password confirmation is not equal the password'),
        };
      }
      try {
        const result = schema.validateSync(data);
        return { value: result };
      } catch (e) {
        return { error: e };
      }
    },
  }, (req, res) => {
    const { name, email, password, passwordConfirmation } = req.body;

    if (req.validationError) {
      const data = {
        name, email, password, passwordConfirmation
      };

      req.flash('error', { type: 'info', message: req.validationError})
      res.view('users/new', { data, messages: res.flash() });
      return;
    }

    const stmt = db.prepare(`INSERT INTO users(id, name, email, password) VALUES (?, ?, ?, ?)`);
    stmt.run([null, name, email, password], function (err) {
      if (err) {
        const data = {
          name, email, password, passwordConfirmation,
          error: err,
        };
        req.flash('error', { type: 'info', message: 'Ошибка сервера!'})
        res.view('users/new', { data, messages: res.flash() });
        return;
      }
      req.flash('success', { type: 'success', message: 'Регистрация прошла успешно!'});
      res.redirect(app.reverse('users'));
    })
  });

  app.get('/users/new', { name: 'newUser' }, (req, res) => {
    res.view('users/new');
  });
};
