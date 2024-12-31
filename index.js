const { createClient } = require('redis');

const fastify = require('fastify')({
  logger: true
})

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen({ port: 8080, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }``
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
    console.log(message)
  })
});


