const Bull = require('bull');

const index = require('.');
const {queues} = require('./src/server/config');

index(
  {
    Bull,
    queues: JSON.parse(process.env.QUEUES_CONFIG),
  },
  {
    port: process.env.PORT,
    authUsername: process.env.USERNAME,
    authPassword: process.env.PASSWORD,
  }
);
