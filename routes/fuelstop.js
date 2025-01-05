const FuelStopRepo = require("../efshelper.core/repository/fuelstop.repo");
const FuelStop = require("../efshelper.core/domain/fuel.stop");

async function fuelstopRoute(request, reply) {

    let fuelstops = request.body;

    if (/text\/plain/.test(request.headers['content-type'])) {
        fuelstops = JSON.parse(request.body);
    }

    const promises = fuelstops.map((fuelstop) => {
        return this.fuelStopRepo.addOne(fuelstop)
    })

    return Promise.all(promises)
           .then(() => reply.send())
           .catch(error => reply.code(400).send(`failed to insert fuel stop: ${error.message}`))
}

module.exports = fuelstopRoute;
