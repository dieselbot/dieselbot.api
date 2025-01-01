const { createClient } = require('redis');
const formbody = require("@fastify/formbody");
const cors = require('@fastify/cors');
const bearerAuthPlugin = require('@fastify/bearer-auth');
const fuelstopRoute = require('./routes/fuelstop');

const keys = new Set([process.env.EFS_API_KEY]);

const fastify = require('fastify')({
  logger: true
})

fastify.register(bearerAuthPlugin, {keys})

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

const client = createClient({
  url: process.env.REDIS_URL
});

const subscriber = client.duplicate();

subscriber
.on('error', err => console.log('Redis Client Error', err))
.connect().then(() => {
  subscriber.subscribe('fuelstop.found', message => {
    const fuelstops = JSON.parse(message);
    console.log(fuelstops);
  })
});


