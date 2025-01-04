const FuelStopRepo = require("../efshelper.core/repository/fuelstop.repo");
const FuelStop = require("../efshelper.core/domain/fuel.stop");

async function fuelstopRoute(request, reply) {

    let fuelstops = request.body;

    if(/text\/plain/.test(request.headers['content-type'])){
        fuelstops = JSON.parse(request.body);
    }

    fuelstops.forEach((fuelstop, i) => {
        if (FuelStop.isValid(fuelstop)) {
            this.fuelStopRepo.addOne(fuelstop);
        } else {
            reply.code(400).send(`invalid fuel stop at index ${i}: ${JSON.stringify(fuelstop)}`);
        }
    })

    reply.send();
}

module.exports = fuelstopRoute;
