import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import sanitize from 'sanitize-html';
import formbody from '@fastify/formbody';
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

app.post('/courses', (req, res) => {
  const course = {
    coursename: req.body.coursename.trim().toLowerCase(),
    description: req.body.description.trim().toLowerCase(),
  };

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

app.post('/users', (req, res) => {
  const user = {
    username: req.body.username.trim(),
    email: req.body.email.toLowerCase().trim(),
    password: crypto(req.body.password),
    id: generateId(),
  };

  users.push(user);

  res.redirect('/users');
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});