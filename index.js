'use strict';

const express = require('express');
const cors = require('cors');
const endpoints = require('express-endpoints');
const gracefulShutdown = require('http-graceful-shutdown');
const agent = require('multiagent');

// Define some default values if not set in environment
const PORT = process.env.PORT || 3000;
const SHUTDOWN_TIMEOUT = process.env.SHUTDOWN_TIMEOUT || 10000;
const SERVICE_CHECK_HTTP = process.env.SERVICE_CHECK_HTTP || '/healthcheck';
const SERVICE_ENDPOINTS = process.env.SERVICE_ENDPOINTS || '/endpoints';
const DISCOVERY_SERVERS = process.env.DISCOVERY_SERVERS
  ? process.env.DISCOVERY_SERVERS.split(',')
  : ['http://46.101.245.190:8500', 'http://46.101.132.55:8500', 'http://46.101.193.82:8500'];

// Create a new express app
const app = express();

// Add CORS headers
app.use(cors());

// Add health check endpoint
app.get(SERVICE_CHECK_HTTP, (req, res) => res.send({ uptime: process.uptime() }));

// Add metadata endpoint
app.get(SERVICE_ENDPOINTS, endpoints());

// Add all other service routes
app.get('/superstars', (req, res) => {
  res.send([
    'Person 1',
    'Person 2'
  ]);
});

// Start the server
const server = app.listen(PORT, () => console.log(`Service listening on port ${PORT} ...`));

// Enable graceful server shutdown when process is terminated
gracefulShutdown(server, { timeout: SHUTDOWN_TIMEOUT });



// This is how you would use the discovery
// client to talk to other services:
//
// const client = agent.client({
//   discovery: 'consul',
//   discoveryServers: DISCOVERY_SERVERS,
//   serviceName: 'some-service'
// });

// client
//   .get('/healthcheck')
//   .then(res => console.log(res.body))
//   .catch(err => console.log(err));
