const { Op } = require("sequelize");
const { Branch, Zone } = require("../models");
const { UserException } = require("../plugins/exceptions");

module.exports.fetchHome = async (request, reply) => {
  reply.send({ message: "Welcome to app template home api route!" });
};

module.exports.createBranch = async (request, reply) => {
  const { label_en, label_ar, governorate_en, governorate_ar } = request.body;

  try {
    const branch = await Branch.create({
      label_en,
      label_ar,
      governorate_en,
      governorate_ar,
    });

    reply.send({ code: 200, results: branch });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.fetchBranches = async (request, reply) => {
  try {
    const branches = await Branch.findAll({
      include: [{ model: Zone, as: "zones", attributes: ["id"] }],
    });

    reply.send({ code: 200, results: branches });
  } catch (error) {
    reply.send(error);
  }
};

module.exports.updateBranch = async (request, reply) => {
  const { id } = request.params;

  try {
    const branch = await Branch.findOne({ where: { id } });

    if (!branch) {
      throw new UserException(404, "branch was not found");
    }

    await Branch.update(request.body, { where: { id } });

    reply.send({ code: 200, message: "branch successfully updated" });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.removeBranches = async (request, reply) => {
  const { payload } = request.body;
  try {
    await Branch.destroy({
      where: {
        id: { [Op.in]: payload },
      },
    });

    reply.send({ code: 200, message: "branches removed successfully" });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.createZone = async (request, reply) => {
  const { label_en, label_ar, governorate_en, governorate_ar } = request.body;

  try {
    const zone = await Zone.create({
      label_en,
      label_ar,
      governorate_en,
      governorate_ar,
    });

    reply.send({ code: 200, results: zone });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.fetchZones = async (request, reply) => {
  try {
    const zones = await Zone.findAll({
      include: [{ model: Branch, as: "branches", attributes: ["id"] }],
    });

    reply.send({ code: 200, results: zones });
  } catch (error) {
    reply.send(error);
  }
};

module.exports.updateZone = async (request, reply) => {
  const { id } = request.params;

  try {
    const zone = await Zone.findOne({ where: { id } });

    if (!zone) {
      throw new UserException(404, "zone was not found");
    }

    await Zone.update(request.body, { where: { id } });

    reply.send({ code: 200, message: "zone successfully updated" });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.removeZones = async (request, reply) => {
  const { payload } = request.body;

  try {
    await Zone.destroy({
      where: {
        id: { [Op.in]: payload },
      },
    });

    reply.send({ code: 200, message: "zones removed successfully" });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.toggleZoneOnBranch = async (request, reply) => {
  const { id } = request.params;

  try {
    const branch = await Branch.findOne({ where: { id } });

    if (!branch) {
      throw new UserException(404, "branch not found");
    }

    await branch.setZones(request.body);

    reply.send({
      code: 200,
      message: "attaching/detaching zones to branch successful",
    });
  } catch (error) {
    reply.code(400).send(error);
  }
};
