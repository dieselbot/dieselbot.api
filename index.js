const path = require("path");
const { check_env } = require("./core/common/utils.js");

check_env(path.join(__dirname, '.env'));

const formbody = require("@fastify/formbody");
const cors = require('@fastify/cors');
const bearerAuthPlugin = require('@fastify/bearer-auth');
const fuelstopRoute = require('./routes/fuelstop');
const fuelStopRepoPlugin = require('./plugins/fuelstop.repo.plugin.js');
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

// Formbody lets us parse incoming forms
fastify.register(formbody);

fastify.register(cors, {
  origin: ['0.0.0.0', process.env.WEB_ORIGIN]
})

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ diesel: 'bot' })
})


fastify.post('/drift', driftRoute);

// Run the server!
fastify.listen({ port: 8080, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
