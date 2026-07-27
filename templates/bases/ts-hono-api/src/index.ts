import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({
    message: 'Welcome to your hackpack API',
    docs: 'https://hackpack.dev/docs',
    routes: {
      get: '/ (this)',
      post: '/example (demo)',
    },
  });
});

app.post('/example', async (c) => {
  const data = await c.req.json().catch(() => ({}));
  return c.json({ received: data, timestamp: new Date().toISOString() });
});

// hackpack:routes

export default app;
