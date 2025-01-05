async function fuelstopRoute(request, reply) {

    let fuelstops = request.body;

    if (/text\/plain/.test(request.headers['content-type'])) {
        fuelstops = JSON.parse(request.body);
    }

    return this.fuelStopRepo.addMany(fuelstops)
               .then(() => reply.send())
               .catch(error => reply.code(400).send(`failed to insert fuel stop: ${error.message}`))
}

module.exports = fuelstopRoute;
