const SearchUseCase = require('../core/application/search.usecase');
const FuelSolution = require('../core/domain/fuel.solution');
const DriftService = require('../core/services/drift');

async function driftRoute(request, reply){
    const payload = request.body;

    if(payload.type == 'mock_event_type' || payload.data.author.bot) {
        return reply.send();
    }    

    const { conversationId, body } = payload.data;

    const search = new SearchUseCase(new FuelSolution(body));

    const result = await search.execute();

    if(result.success){

        if(search.new_fuel_stops.length){
            this.fuelStopRepo.addMany(search.new_fuel_stops)
                .catch(error => console.warn(`failed to insert fuel stop: ${error.message}`))
        }

        const drift = new DriftService();
        drift.send(conversationId, result.data);

        return reply.send();
    }

    reply.code(400).send('Could not process request');
    
}

module.exports = driftRoute;