const SearchUseCase = require('../core/application/search.usecase');
const FuelSolution = require('../core/domain/fuel.solution');
const drift_access_token = process.env.DRIFT_ACCESS_TOKEN;

async function driftRoute(request, reply){
    const payload = request.body;

    if(payload.data.author.bot) {
        return reply.send();
    }

    const { conversationId, body } = payload.data;

    console.log({ fuel_solution: body, conversation_id: conversationId });

    const search = new SearchUseCase(new FuelSolution(body));

    const result = await search.execute();

    let message = ``;

    if(result.success){
        for (const fuelstop of result.data) {
            message = message.concat(`${fuelstop.display_name}\n${fuelstop.address}\n\n`)
        }
    }

    fetch(`https://driftapi.com/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
            "authorization": `Bearer ${drift_access_token}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            type: "chat",
            body: message
        })
    }).then(res => {
        if(res.ok){
            return reply.send();
        }
        reply.code(400).send('Could not process request');
    }).then(console.log)

    
}

module.exports = driftRoute;