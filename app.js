require("dotenv").config();

const path = require("path");

// CommonJs
const fastify = require("fastify")({
  logger: true,
});

// configure cors
fastify.register(require("@fastify/cors"), {
  origin: "*",
  methods: "*",
  allowedHeaders: ["Content-Type", "Authorization"],
});

// serve static assests
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/public/", // optional: default '/'
});

// jwt for authentication
fastify.register(require("./plugins/is-authenticated"));

// Load Route Plugins
fastify.register(require("./routes/main"), { prefix: "/api" });
fastify.register(require("./routes/auth"), { prefix: "/api/users" });
fastify.register(require("./routes/doctor"), { prefix: "/api/doctors" });
fastify.register(require("./routes/patient"), { prefix: "/api/patients" });
fastify.register(require("./routes/request"), { prefix: "/api/requests" });

fastify.setNotFoundHandler(function (request, reply) {
  reply.sendFile("index.html");
});

// Realtime communication
// fastify.register(require("./plugins/websockets"));

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT, host: process.env.HOST });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
