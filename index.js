const formbody = require("@fastify/formbody");
const cors = require('@fastify/cors');
const bearerAuthPlugin = require('@fastify/bearer-auth');
const fuelstopRoute = require('./routes/fuelstop');
const fuelStopRepoPlugin = require('./plugins/fuelstop.repo.plugin.js');

const keys = new Set([process.env.EFS_API_KEY]);

const fastify = require('fastify')({
  logger: true
})

fastify.register(bearerAuthPlugin, { keys })

fastify.register(fuelStopRepoPlugin);

// Formbody lets us parse incoming forms
fastify.register(formbody);

fastify.register(cors, {
  origin: ['0.0.0.0', process.env.EFS_WEB_ORIGIN]
})

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

fastify.post('/fuelstop', fuelstopRoute);

// Run the server!
fastify.listen({ port: 8080, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
