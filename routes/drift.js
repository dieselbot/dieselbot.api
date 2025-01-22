const FuelSolution = require('../core/domain/fuel.solution');
const FuelStopRepo = require('../core/repository/fuelstop.repo');
const globalEmitter = require('../core/common/global.emitter');

globalEmitter.on('insert:unlisted_fuel_stops', unlisted_fuel_stops => {
    const repo = new FuelStopRepo();
    return repo.addMany(unlisted_fuel_stops);
})

async function driftRoute(request, reply){
    const payload = request.body;

    if(payload.type == 'mock_event_type' || payload.data.author.bot) {
        return reply.send();
    }    

    const { conversationId, body } = payload.data;

    this.searchUseCase.fuel_solution = new FuelSolution(body);

    const result = await this.searchUseCase.execute();

    if(result.success){
        this.drift.send(conversationId, result.data);
        return reply.send();
    }

    reply.code(400).send('Could not process request');
    
}

module.exports = driftRoute;