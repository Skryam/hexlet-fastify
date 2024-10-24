import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import sanitize from 'sanitize-html';
import formbody from '@fastify/formbody';
import yup from 'yup';
import getCourses, { generateId, crypto, getUsers } from './utils.js'

const app = fastify();
const port = 3000;

await app.register(view, { engine: { pug }})
await app.register(formbody);

const courses = getCourses();
const users = getUsers();

app.get('/', (req, res) => {
  res.view('src/views/index')
})

app.get('/users/:id', (req, res) => {
  // const escapedId = sanitize(req.params.id)
  //res.type('html');
  const { id } = req.params;
  const data = { id }
 res.view('src/views/users/showId', data);
});

app.get('/users/:id/post/:postId', (req, res) => {
  res.send(`id: ${req.params.id} & postId: ${req.params.postId}`);
});

app.get('/hello', (req, res) => {
  const name = req.query.name;
  if (!name) {
    res.send('Hello, World!')
  } else {
    res.send(`Hello, ${name}!`)
  }
})

app.get('/courses', (req, res) => {
  const { term, description } = req.query;
  let currentCourses = courses;

  if(term || description) {
    currentCourses = courses.filter((elem) => {
      return elem.coursename.toLocaleLowerCase().includes(term.toLocaleLowerCase()) &&
      elem.description.toLocaleLowerCase().includes(description.toLocaleLowerCase())
    })
  }
  const data = { term, description, courses: currentCourses };

  res.view('src/views/courses/index', data);
});

app.get('/courses/new', (req, res) => {
  res.view('src/views/courses/new');
});

app.post('/courses', {
  attachValidation: true,
  schema: {
    body: yup.object({
      coursename: yup.string().min(2).required(),
      description: yup.string().min(10).required(),
    }),
  },
  validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
    try {
      const result = schema.validateSync(data);
      return { value: result };
    } catch (e) {
      return { error: e };
    }
  },
}, (req, res) => {
  const { coursename, description } = req.body;

  if (req.validationError) {
    const data = { coursename, description, error: req.validationError };

    res.view('src/views/courses/new', data);
    return;
  }

  const course = { coursename, description };

  courses.push(course);

  res.redirect('/courses');
});

app.get('/users', (req, res) => {
  const { term } = req.query;
  let currentUsers = users;

  if (term) {
    currentUsers = users.filter((user) => user.username
      .toLowerCase().includes(term.toLowerCase()));
  }
  res.view('src/views/users/index', { users: currentUsers });
});

app.get('/users/new', (req, res) => {
  res.view('src/views/users/new');
});

app.post('/users', {
  attachValidation: true,
  schema: {
    body: yup.object({
      name: yup.string().min(2),
      email: yup.string().email(),
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

    res.view('src/views/users/new', data);
    return;
  }

  const user = {
    name,
    email,
    password,
  };

  users.push(user);

  res.redirect('/users');
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});