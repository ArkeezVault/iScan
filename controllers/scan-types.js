const { UserException } = require("../plugins/exceptions");

const { Type, Name } = require("../models");

// CREATE TYPE
module.exports.createType = async (request, reply) => {
  const { names, ...body } = request.body;

  try {
    const type = await Type.create(body);

    if (!type) {
      throw new UserException(400, "failed to create scan type");
    }

    const { id } = type.toJSON();
    if (names) {
      const scan_names = names.map((t) => ({ type_id: id, title: t.title }));

      await Name.bulkCreate(scan_names);
    }

    reply.send({
      code: 200,
      results: await Type.findOne({
        where: { id },
        attributes: ["id", "title"],
        include: [
          {
            model: Name,
            as: "scan_names",
            attributes: ["id", "title", "price"],
          },
        ],
      }),
    });
  } catch (error) {
    console.log(error);
    reply.code(400).send(error);
  }
};

// FETCH ALL SCAN TYPES
module.exports.fetchTypes = async (request, reply) => {
  try {
    const results = await Type.findAll({
      attributes: ["id", "title"],
      include: [
        {
          model: Name,
          as: "scan_names",
          attributes: ["id", "title", "price"],
        },
      ],
    });

    reply.send({
      code: 200,
      results,
    });
  } catch (error) {
    reply.code(400).send(error);
  }
};

// FETCH ONE SCAN TYPE
module.exports.fetchOneType = async (request, reply) => {
  const { id } = request.params;

  try {
    const results = await Type.findOne(
      {
        attributes: ["id", "title"],
        include: [
          {
            model: Name,
            as: "scan_names",
            attributes: ["id", "title", "price"],
          },
        ],
      },
      { where: { id } }
    );

    reply.send({
      code: 200,
      results,
    });
  } catch (error) {
    reply.code(400).send(error);
  }
};

// UPDATE ONE SCAN TYPE
module.exports.updateType = async (request, reply) => {
  const { id } = request.params;
  const { title, scan_names } = request.body;

  try {
    const type = await Type.update({ title }, { where: { id } });

    for (const name of scan_names) {
      const name_updated = await Name.update(name, { where: { id: name.id } });

      if (!name_updated) {
        throw new UserException(400, "an error occured");
      }
    }

    reply.send({
      code: 200,
      results: await Type.findOne({
        attributes: ["id", "title"],
        include: [
          {
            model: Name,
            as: "scan_names",
            attributes: ["id", "title", "price"],
          },
        ],
      }),
    });
  } catch (error) {
    reply.code(400).send(error);
  }
};

// REMOVE ONE SCAN TYPE
module.exports.removeType = async (request, reply) => {
  const { id } = request.params;

  try {
    const type = await Type.destroy({ where: { id } });

    if (!type) {
      throw new UserException(400, "an error occured");
    }

    const names = await Name.destroy({ where: { type_id: id } });

    if (!names) {
      throw new UserException(400, "an error occured");
    }

    reply.send({
      code: 200,
      message: "successfully removed type with it's names",
    });
  } catch (error) {
    reply.code(400).send(error);
  }
};
