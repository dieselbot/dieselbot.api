const fastifyPlugin = require('fastify-plugin');
const path = require('path');
const FuelStopRepo = require(
  path.join(__dirname, '../efshelper.core/repository/fuelstop.repo.js')
);

async function fuelStopRepoPlugin(fastify, options) {
  fastify.decorate('fuelStopRepo', new FuelStopRepo());
}
module.exports = fastifyPlugin(fuelStopRepoPlugin);