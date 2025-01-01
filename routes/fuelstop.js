async function fuelstopRoute(request, reply){
    console.log(request.body);
    reply.send(request.body);
}

module.exports = fuelstopRoute;
