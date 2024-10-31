import { getUsers } from '../utils.js';
import yup from 'yup';
import { generateId } from '../utils.js';

export const users = [];
users.push(...getUsers());

export default (app) => {

  app.get('/users/:id', { name: 'user' }, (req, res) => {
    const user = users.find((item) => item.id === req.params.id);

    if (!user) {
      res.status(404).send('User not found');
      return;
    }
  res.view('users/showId', { user });
  });

  app.get('/users', { name: 'users' }, (req, res) => {
    const { term } = req.query;
    let currentUsers = users;
    if (term) {
      currentUsers = users.filter((user) => user.name
        .toLowerCase().includes(term.toLowerCase()));
    }
    res.view('users/index', { users: currentUsers });
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
        name, email, password, passwordConfirmation,
        error: req.validationError,
      };

      res.view('users/new', data);
      return;
    }

    const user = {
      id: generateId(),
      name,
      email,
      password,
    };

    users.push(user);

    res.redirect(app.reverse('users'));
  });

  app.get('/users/new', { name: 'newUser' }, (req, res) => {
    res.view('users/new');
  });
}