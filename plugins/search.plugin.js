const fastifyPlugin = require('fastify-plugin');
const SearchUseCase = require('../core/application/search.usecase.js');

async function searchPlugin(fastify, options) {
  fastify.decorate('searchUseCase', new SearchUseCase());
}
module.exports = fastifyPlugin(searchPlugin);