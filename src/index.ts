// First Imports
import './lib/env';

// Third Party Imports
import * as Sentry from '@sentry/node';
import { GraphQLServer } from 'graphql-yoga';
import { merge } from 'lodash';
import redis from 'redis';
import session from 'express-session';

// Graphql Imports
import { resolvers as accountResolvers, schema as accountSchema } from './account/index';

// Middleware Imports
import { authCheck } from './middleware/authCheck';

// Lib Imports
import logger from './lib/logger';

// Initialize Sentry
Sentry.init({ dsn: '' }); // Add sentry url here

// Initialzie Empty Query
const Query = `
  type Query {
    _empty: String
  }
`;

// Initilaize GraphQL Server
const server = new GraphQLServer({
  typeDefs: [Query, accountSchema],
  resolvers: merge({}, accountResolvers),
  context: (req: any) => ({ ...req }),
  middlewares: [
    {
      Query: authCheck,
      Mutation: authCheck,
    },
  ],
});

// Use Sentry Middleware
server.use(Sentry.Handlers.requestHandler());

// Intilaize Redis and Redis Client
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient({ host: 'redis' });

redisClient.on('error', err => {
  logger.error('Redis error: ', err);
});

// Use Reddis Middleware
server.use(
  session({
    secret: process.env.SECRET_KEY!,
    name: process.env.SESSION_NAME!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
    },
    store: new RedisStore({ host: 'redis', port: 6379, client: redisClient, ttl: 86400 }),
  }),
);

// Sentry Middleware
server.use(Sentry.Handlers.errorHandler());

// Server Options
const options = {
  port: process.env.PORT!,
  endpoint: '/graphql',
  playground: '/graphql',
  host: process.env.HOST!,
  cors: {
    credentials: true,
    origin: ['http://localhost:3000'], // your frontend url.
  },
};

// Run Server
server.start(options, ({ port }) => logger.info(`Server started, listening on port ${port} for incoming requests.`));
