const path = require('path');
const dotenv = require('dotenv');

function getEnvironment() {
  return process.env.NODE_ENV || 'development';
}

function initializeEnv() {
  dotenv.config({
    path: path.resolve(process.cwd(), `.env.${getEnvironment()}`),
  });
}

function normalizePort(val) {
  const portNum = parseInt(val, 10);

  if (Number.isNaN(portNum)) {
    // named pipe
    return val;
  }

  if (portNum >= 0) {
    // port number
    return portNum;
  }

  return false;
}

function initializeConfig() {
  return {
    mongoDb: process.env.MONGO_DB_URL,
    port: normalizePort(process.env.PORT || '3001'),
  };
}

initializeEnv();

module.exports = initializeConfig();
