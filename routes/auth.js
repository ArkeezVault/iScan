const multer = require("fastify-multer");
const AuthController = require("../controllers/auth");

async function routes(fastify, options) {
  // parse multipart forms
  fastify.register(multer.contentParser);

  fastify.post("/register", AuthController.register);

  fastify.post("/login", AuthController.login);

  fastify.post(
    "/reset/:user_id",
    { onRequest: [fastify.authenticate] },
    AuthController.reset
  );

  fastify.get(
    "/",
    { onRequest: [fastify.authenticate] },
    AuthController.fetchAll
  );

  fastify.put(
    "/edit/:user_id",
    { onRequest: [fastify.authenticate] },
    AuthController.update
  );

  fastify.delete(
    "/remove/:user_id",
    { onRequest: [fastify.authenticate] },
    AuthController.remove
  );

  fastify.post("/upload-profile-image/:user_id", {
    onRequest: AuthController.removePreviousImage,
    preHandler: AuthController.profileImage,
    handler: AuthController.uploadImage,
  });
}

module.exports = routes;
