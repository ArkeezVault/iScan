const multer = require("fastify-multer");

const homeController = require("../controllers/main");
const typeController = require("../controllers/scan-types");
const attachmentController = require("../controllers/attachment");
const teethController = require("../controllers/teeth");

async function routes(fastify, options) {
  // register fastify content parser
  fastify.register(multer.contentParser);

  fastify.get("/", homeController.fetchHome);

  /**
   * SCAN TYPE ROUTES
   */

  // CREATE SCAN TYPE
  fastify.post(
    "/types",
    { onRequest: [fastify.authenticate] },
    typeController.createType
  );

  // FETCH ALL SCAN TYPES
  fastify.get(
    "/types",
    { onRequest: [fastify.authenticate] },
    typeController.fetchTypes
  );

  // FETCH ONE SCAN TYPES
  fastify.get(
    "/types/:id",
    { onRequest: [fastify.authenticate] },
    typeController.fetchOneType
  );

  // UPDATE ONE SCAN TYPES
  fastify.put(
    "/types/:id",
    { onRequest: [fastify.authenticate] },
    typeController.updateType
  );

  // REMOVE SCAN TYPE
  fastify.delete(
    "/types/:id",
    { onRequest: [fastify.authenticate] },
    typeController.removeType
  );

  /**
   * ATTACHMENT ROUTES
   */

  // CREATE ATTACHMENT
  fastify.post("/attachments", {
    onRequest: [fastify.authenticate],
    preHandler: attachmentController.filesToUpload,
    handler: attachmentController.createAttachment,
  });

  // REMOVE ATTACHMENTS
  fastify.delete(
    "/attachments",
    { onRequest: [fastify.authenticate] },
    attachmentController.removeAttachment
  );

  /**
   * TEETH ROUTES
   */

  // CREATE TEETH
  fastify.post("/teeth/bulk", {
    onRequest: [fastify.authenticate],
    preHandler: attachmentController.filesToUpload,
    handler: teethController.createTeeth,
  });

  // FETCH ALL TEETH
  fastify.get(
    "/teeth",
    { onRequest: [fastify.authenticate] },
    teethController.fetchAll
  );

  // UPDATE TOOTH IMAGE
  fastify.post("/teeth/image", {
    onRequest: [fastify.authenticate],
    preHandler: attachmentController.filesToUpload,
    handler: teethController.updateToothImage,
  });

  // UPDATE TOOTH DETAILS
  fastify.post(
    "/teeth/details",
    { onRequest: [fastify.authenticate] },
    teethController.updateToothDetails
  );

  // REMOVE TEETH
  fastify.post(
    "/teeth/remove",
    { onRequest: [fastify.authenticate] },
    teethController.removeTooth
  );

  /**
   * Branches & Zones
   */

  // CREATE BRANCH
  fastify.post(
    "/branches",
    { onRequest: [fastify.authenticate] },
    homeController.createBranch
  );

  // FETCH BRANCHES
  fastify.get(
    "/branches",
    { onRequest: [fastify.authenticate] },
    homeController.fetchBranches
  );

  // EDIT Branch
  fastify.put(
    "/branches/:id",
    { onRequest: [fastify.authenticate] },
    homeController.updateBranch
  );

  // REMOVE BRANCHES
  fastify.delete(
    "/branches",
    { onRequest: [fastify.authenticate] },
    homeController.removeBranches
  );

  // CREATE Zone
  fastify.post(
    "/zones",
    { onRequest: [fastify.authenticate] },
    homeController.createZone
  );

  // FETCH Zone
  fastify.get(
    "/zones",
    { onRequest: [fastify.authenticate] },
    homeController.fetchZones
  );

  // EDIT Zone
  fastify.put(
    "/zones/:id",
    { onRequest: [fastify.authenticate] },
    homeController.updateZone
  );

  // REMOVE Zone
  fastify.delete(
    "/zones",
    { onRequest: [fastify.authenticate] },
    homeController.removeZones
  );

  // ATTACH / DETACH ZONE TO / FROM BRANCH
  fastify.post(
    "/branch/:id/zones",
    { onRequest: [fastify.authenticate] },
    homeController.toggleZoneOnBranch
  );
}

module.exports = routes;
