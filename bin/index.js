import build from '../src/index.js';

const app = await build();
const port = process.env.PORT || 3000;

app.listen({ host: '0.0.0.0', port }, () => {
  console.log(`Example app listening on port ${port}`);
});
