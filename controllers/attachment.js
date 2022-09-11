const path = require("path");
const multer = require("fastify-multer");

const { Attachment } = require("../models");
const { UserException } = require("../plugins/exceptions");

const createStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = file.mimetype.includes("image")
      ? "public/images"
      : "public/file-manager";

    cb(null, path.join(__dirname, "..", dest));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "." + file.originalname.split(".").pop());
  },
});

const create = multer({ storage: createStorage });

module.exports.filesToUpload = create.array("attachments");

module.exports.createAttachment = async (request, reply) => {
  const { parent_id, parent_type } = request.body;

  try {
    if (request?.files.length > 0) {
      const bulkAttachments = request.files.map((file) => ({
        parent_id,
        parent_type,
        url: file.mimetype.includes("image")
          ? `/public/images/${file.filename}`
          : `/public/file-manager/${file.filename}`,
      }));
      const attachments = await Attachment.bulkCreate(bulkAttachments);

      reply.send({
        code: 200,
        message: "file created successfully",
      });
    } else {
      throw new UserException(400, "no files found to create attachment");
    }
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.removeAttachment = async (request, reply) => {
  const { files } = request.body;

  try {
    let notDeleted = [];

    await files.forEach(async (id) => {
      const file = await Attachment.findOne({
        attributes: ["id"],
        where: { id },
      });

      if (file) {
        await Attachment.destroy({ where: { id } });
      } else {
        notDeleted.push(id);
      }
    });

    if (notDeleted.length > 1) {
      reply.send({
        code: 400,
        message: `the following attachments with ids were not deleted: ${JSON.stringify(
          notDeleted
        )}`,
      });
    } else {
      reply.send({
        code: 200,
        message: "attachments successfully removed",
      });
    }
  } catch (error) {
    reply.code(400).send(error);
  }
};
