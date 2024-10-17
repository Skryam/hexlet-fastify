import fastify from 'fastify';

const app = fastify();
const port = 3000;

app.get('/users', (req, res) => {
  res.send('GET /users');
});

app.get('/users/:id/post/:postId', (req, res) => {
  res.send(`id: ${req.params.id} & postId: ${req.params.postId}`);
});

app.post('/users', (req, res) => {
  res.send('POST /users');
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/hello', (req, res) => {
  const name = req.query.name;
  if (!name) {
    res.send('Hello, World!')
  } else {
    res.send(`Hello, ${name}!`)
  }
})