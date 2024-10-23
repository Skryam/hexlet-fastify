import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import sanitize from 'sanitize-html';
import getCourses from './utils.js'

const app = fastify();
const port = 3000;

await app.register(view, { engine: { pug }})
const courses = getCourses();

app.get('/', (req, res) => {
  res.view('src/views/index')
})

app.get('/users/:id', (req, res) => {
  // const escapedId = sanitize(req.params.id)
  //res.type('html');
  const { id } = req.params;
  const data = {
    id,
  }
 res.view('src/views/user/showId', data);
});

app.get('/users/:id/post/:postId', (req, res) => {
  res.send(`id: ${req.params.id} & postId: ${req.params.postId}`);
});

app.post('/users', (req, res) => {
  res.send('POST /users');
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
  const filter = courses.filter((elem) => {
    return elem.coursename.toLocaleLowerCase().includes(term) &&
    elem.description.toLocaleLowerCase().includes(description)
  });
  const data = { term, description, courses: filter };

  res.view('src/views/courses/index', data);
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});