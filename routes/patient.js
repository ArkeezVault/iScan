const multer = require("fastify-multer");

const patientController = require("../controllers/patient");

async function routes(fastify, options) {
  fastify.register(multer.contentParser);

  // FETCH PATIENTS
  fastify.get(
    "/",
    { onRequest: [fastify.authenticate] },
    patientController.fetchPatients
  );

  // FETCH PATEINT
  fastify.get(
    "/:user_id",
    { onRequest: [fastify.authenticate] },
    patientController.fetchPatient
  );
}

module.exports = routes;
