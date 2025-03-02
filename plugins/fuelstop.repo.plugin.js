const fastifyPlugin = require('fastify-plugin');
const FuelStopRepo = require('../core/repository/fuelstop.repo.js');

async function fuelStopRepoPlugin(fastify, options) {
  fastify.decorate('fuelStopRepo', new FuelStopRepo());
}
module.exports = fastifyPlugin(fuelStopRepoPlugin);