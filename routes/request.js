const multer = require("fastify-multer");

const requestController = require("../controllers/request");

async function routes(fastify, options) {
  // register fastify content parser
  fastify.register(multer.contentParser);

  // CREATE REQUEST
  fastify.post(
    "/",
    { onRequest: [fastify.authenticate] },
    requestController.createRequest
  );

  // FETCH DOCTOR REQUESTS
  fastify.get(
    "/doctor/:id",
    { onRequest: [fastify.authenticate] },
    requestController.fetchDoctorRequests
  );

  // CHANGE REQUEST BRANCH
  fastify.post(
    "/:request_id/change-branch/:branch_id",
    { onRequest: [fastify.authenticate] },
    requestController.changeBranch
  );

  // Add Details
  fastify.post(
    "/:request_id/add-details",
    { onRequest: [fastify.authenticate] },
    requestController.addDetails
  );

  // Edit Details
  fastify.post(
    "/:request_id/edit-details",
    { onRequest: [fastify.authenticate] },
    requestController.editDetails
  );

  // Remove Details
  fastify.delete(
    "/details",
    { onRequest: [fastify.authenticate] },
    requestController.removeDetails
  );

  // Update Teeth
  fastify.post(
    "/:request_id/teeth",
    { onRequest: [fastify.authenticate] },
    requestController.updateTeeth
  );
}

module.exports = routes;
