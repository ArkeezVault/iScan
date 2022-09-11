const fs = require("fs");
const path = require("path");

const { Op } = require("sequelize");
const { Attachment, Tooth } = require("../models");

module.exports.createTeeth = async (request, reply) => {
  const { teeth } = request.body;

  const data = JSON.parse(teeth);
  const files = request.files.map((f) => {
    let url = f.path.replace(/\\/g, "/");
    return url.slice(url.indexOf("/public"));
  });

  let teethData = data.map((td) => ({
    name: td.name,
    index: td.index,
    image: files[td.image_idx],
  }));

  try {
    for await (const tooth of teethData) {
      const record = await Tooth.create({
        name: tooth.name,
        index: tooth.index,
      }).then(async (record) => {
        const { id } = record.toJSON();

        await Attachment.create({
          parent_id: id,
          parent_type: "tooth",
          url: tooth.image,
        });
      });
    }

    reply.send({
      code: 200,
      message: "teeth created successfully",
    });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.fetchAll = async (request, reply) => {
  try {
    const teeth = await Tooth.findAll({
      include: [
        {
          model: Attachment,
          as: "image",
          attributes: ["id", "url"],
          where: { parent_type: "tooth" },
        },
      ],
    });

    reply.send({
      code: 200,
      results: teeth,
    });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.updateToothImage = async (request, reply) => {
  const { id, image_id } = request.body;

  try {
    await Tooth.findOne({ where: { id } }).then(async (tooth) => {
      const attachment = await Attachment.findOne({
        attributes: ["url"],
        where: { id: image_id },
        raw: true,
        nest: true,
      });

      let filePath = path.join(__dirname, "..", attachment.url);

      console.log(fs.existsSync(filePath));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // update uploaded file
      const file = request.files[0];
      let url = file.path.replace(/\\/g, "/");
      url = url.slice(url.indexOf("/public"));

      await Attachment.update({ url }, { where: { id: image_id } });

      reply.send({ code: 200, path: url });
    });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.updateToothDetails = async (request, reply) => {
  try {
    await Tooth.update(request.body, { where: { id: request.body.id } });

    reply.send({ code: 200, message: "tooth updated successfully" });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.removeTooth = async (request, reply) => {
  const teeth = request.body.map((t) => t.id);
  const attachments = request.body.map((t) => t.aid);

  try {
    await Tooth.destroy({
      where: {
        id: { [Op.in]: teeth },
      },
    }).then(async () => {
      await Attachment.destroy({
        where: {
          id: { [Op.in]: attachments },
        },
      });

      reply.send({ code: 200, message: "successfully removed teeth" });
    });
  } catch (error) {
    reply.code(400).send(error);
  }
};
