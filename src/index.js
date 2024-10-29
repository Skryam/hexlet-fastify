import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import sanitize from 'sanitize-html';
import formbody from '@fastify/formbody';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import addRoutes from './routes/index.js';
import fastifyCookie from '@fastify/cookie';

export default async () => {
  const app = fastify({ exposeHeadRoutes: false });

  await app.register(fastifyReverseRoutes);

  const route = (name, placeHoldersValues) => app.reverse(name, placeHoldersValues);

  await app.register(view, {
    engine: { pug },
    defaultContext: {
      route,
    },
    root: 'src/views'
  });

  await app.register(formbody);

  await app.register(fastifyCookie);

  app.get('/', { name: 'index' }, (req, res) => {
    const visited = req.cookies.visited;
    const data = {
      visited,
    };
    res.cookie('visited', true);

    res.view('index', data);
  });

  addRoutes(app);
  
  return app;
}