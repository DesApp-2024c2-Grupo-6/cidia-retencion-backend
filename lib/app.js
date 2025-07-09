/* eslint-disable no-console */
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import routes from './routes';
import config from './config/config';

const app = express();

/**
 * Get port from environment and store in Express.
 */
const port = config.port || 3001;
app.set('port', port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
// List of allowed origins
const allowedOrigins = [
  'https://cidia-retencion-mock-api-guarani.onrender.com',
  'https://cidia-retencion-frontend.onrender.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
app.use(compression());

app.use('/', routes);

module.exports = app;
