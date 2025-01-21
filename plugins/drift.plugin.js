const fastifyPlugin = require('fastify-plugin');
const DriftService = require('../core/services/drift');

async function driftPlugin(fastify, options) {
  fastify.decorate('drift', new DriftService());
}
module.exports = fastifyPlugin(driftPlugin);