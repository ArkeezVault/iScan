const fp = require("fastify-plugin");

module.exports = fp(async function (fastify, opts) {
  const { Server } = require("socket.io");
  const io = new Server(fastify.server, {
    cors: { origin: "*" },
  });

  // LOGIC GOES HERE
  fastify.ready((err) => {
    if (err) throw err;

    // SOCKET IO
    io.on("connection", async (socket) => {
      console.log("========================");
      console.log("client connected!");

      socket.on("disconnect", async () => {
        console.log("client disconnected!");
      });
    });
  });
});
