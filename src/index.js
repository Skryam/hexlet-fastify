import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import sanitize from 'sanitize-html';
import formbody from '@fastify/formbody';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import addRoutes from './routes/index.js';
import fastifyCookie from '@fastify/cookie';
import session from '@fastify/session';

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
  await app.register(session, {
    secret: 'a secret with minimum length of 32 characters',
    cookie: { secure: false },
  })

  app.get('/', { name: 'index' }, (req, res) => {
    const visited = req.cookies.visited;
    const { username } = req.session;
    const data = {
      visited,
      username,
    };
    res.cookie('visited', true);
    
    res.view('index', data);
  });

  addRoutes(app);
  
  return app;
}