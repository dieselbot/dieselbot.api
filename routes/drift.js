const FuelSolution = require('../core/domain/fuel.solution');
const FuelStopRepo = require('../core/repository/fuelstop.repo');
const globalEmitter = require('../core/common/global.emitter');
const { found } = require('../core/common/constants.json');
const { no_results_found, invalid_fuel_solution } = require('../core/templates');

globalEmitter.on(found.unlisted_fuel_stops, unlisted_fuel_stops => {
    const repo = new FuelStopRepo();
    return repo.addMany(unlisted_fuel_stops);
})

async function driftRoute(request, reply) {
    const payload = request.body;

    if (payload.type == 'mock_event_type' || payload.data.author.bot) {
        return reply.send();
    }

    const { conversationId, body } = payload.data;

    this.searchUseCase.fuel_solution = new FuelSolution(body);

    const result = await this.searchUseCase.execute();

    if (result.success) {
        this.drift.send(conversationId, result.data);
        const fuel_stops = result.not_found.map(fuel_stop => fuel_stop.toString());
        if (result.not_found.length) {
            this.drift.write(conversationId, no_results_found({ fuel_stops }));
        }
    } else if (result.error) {
        this.drift.write(conversationId, invalid_fuel_solution({
            errors: result.error.errors.length ? result.error.errors : [result.error.message],
            wiki: result.error.wiki
        }));
    }

    return reply.send();

}

module.exports = driftRoute;