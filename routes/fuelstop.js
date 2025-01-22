async function fuelstopRoute(request, reply) {

    let fuelstops = request.body;

    return this.fuelStopRepo.addMany(fuelstops)
               .then(() => reply.send())
}

module.exports = fuelstopRoute;
