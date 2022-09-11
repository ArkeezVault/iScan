const doctorController = require("../controllers/doctor");

async function routes(fastify, options) {
  fastify.get(
    "/",
    { onRequest: [fastify.authenticate] },
    doctorController.fetchDoctors
  );
}

module.exports = routes;
