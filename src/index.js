import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import sanitize from 'sanitize-html';
import formbody from '@fastify/formbody';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import addRoutes from './routes/index.js';

export default async () => {
  const app = fastify({ exposeHeadRoutes: false });

  await app.register(fastifyReverseRoutes);
  const route = (name, placeHoldersValues) => app.reverse(name, placeHoldersValues);
  await app.register(view, {
    engine: { pug },
    defaultContext: {
      route,
    },
  });
  await app.register(formbody);

  app.get('/', { name: 'index' }, (req, res) => {
    res.view('src/views/index')
  });

  addRoutes(app);
  
  return app;
}