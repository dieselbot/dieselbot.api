const path = require("path");

const formbody = require("@fastify/formbody");
const cors = require('@fastify/cors');
const bearerAuthPlugin = require('@fastify/bearer-auth');

//plugins
const fuelStopRepoPlugin = require('./plugins/fuelstop.repo.plugin.js');
const searchPlugin = require('./plugins/search.plugin.js');
const driftPlugin = require('./plugins/drift.plugin.js');

// routes
const fuelstopRoute = require('./routes/fuelstop');
const driftRoute = require("./routes/drift.js");

const keys = new Set([process.env.API_KEY || crypto.randomUUID()]);

const fastify = require('fastify')({
  logger: true
})

fastify.register(fuelStopRepoPlugin);

fastify.register(async (instance) => {  
  instance.register(bearerAuthPlugin, { keys });
  instance.post('/fuelstop', fuelstopRoute);
})

fastify.register(async (instance) => {
  instance.register(driftPlugin);
  instance.register(searchPlugin);
  instance.post('/drift', driftRoute);
})

// Formbody lets us parse incoming forms
fastify.register(formbody);

fastify.register(cors, {
  origin: ['0.0.0.0']
})

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ diesel: 'bot' })
})

// Run the server!
fastify.listen({ port: 8080, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
