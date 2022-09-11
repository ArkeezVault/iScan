const { Op } = require("sequelize");
const { UserException } = require("../plugins/exceptions");

const {
  Request,
  Detail,
  Doctor,
  Patient,
  Branch,
  Tooth,
  Name,
  Type,
  Attachment,
} = require("../models");

const generateUniqueId = require("generate-unique-id");

const identifier = () => generateUniqueId({ length: 10 });

module.exports.createRequest = async (request, reply) => {
  const {
    doctor_id,
    patient_id,
    branch_id,
    request_date,
    created_by,
    details,
    teeth,
  } = request.body;

  try {
    const imaging = await Request.create({
      request_id: identifier(),
      doctor_id,
      patient_id,
      branch_id,
      request_date,
      created_by,
    });

    const { request_id } = imaging.toJSON();

    // create details
    let detail_json = details.map((d) => ({
      request_id,
      type_id: d.type_id,
      status: d.status,
      attachment_id: null,
    }));

    await Detail.bulkCreate(detail_json);

    // connect teeth
    await imaging.setTeeth(teeth);

    reply.send({
      code: 200,
      message: "imaging request created successfully",
    });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.fetchDoctorRequests = async (request, reply) => {
  const { id } = request.params;

  const { user_id } = await Doctor.findOne({
    where: { id },
    attributes: ["user_id"],
  });

  try {
    const requests = await Request.findAll({
      where: { doctor_id: user_id },
      include: [
        {
          model: Doctor,
          as: "doctor",
        },
        {
          model: Patient,
          as: "patient",
        },
        {
          model: Branch,
          as: "branch",
        },
        {
          model: Detail,
          as: "details",
          include: [
            { model: Name, as: "scan", include: [Type] },
            {
              model: Attachment,
              as: "attachments",
              attributes: ["id", "parent_type", "url"],
            },
          ],
        },
        {
          model: Tooth,
          as: "teeth",
          attributes: ["id", "index", "name"],
        },
      ],
      limit: 50,
      order: [["request_date", "DESC"]],
    });
    reply.send({
      code: 200,
      results: requests,
    });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.changeBranch = async (request, reply) => {
  const { request_id, branch_id } = request.params;

  try {
    const imaging = await Request.findOne({ where: { request_id } });

    if (!imaging) {
      throw new UserException(404, "Request not found");
    }

    await Request.update({ branch_id }, { where: { request_id } });

    reply.send({ code: 200, message: "branch updated successfully" });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.addDetails = async (request, reply) => {
  const { request_id } = request.params;

  try {
    const imaging = await Request.findOne({ where: { request_id } });

    if (!imaging) {
      throw new UserException(404, "Request not found");
    }

    await Detail.bulkCreate(request.body);

    reply.send({ code: 200, message: "details successfully added" });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.editDetails = async (request, reply) => {
  const { request_id } = request.params;

  try {
    const imaging = await Request.findOne({ where: { request_id } });

    if (!imaging) {
      throw new UserException(404, "Request not found");
    }

    await Detail.update(request.body, { where: { id: request.body.id } });

    reply.send({ code: 200, message: "details successfully updated" });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.removeDetails = async (request, reply) => {
  try {
    for await (const detail of request.body.details) {
      await Detail.destroy({ where: { id: detail } });

      await Attachment.destroy({
        where: { parent_id: detail, parent_type: "detail" },
      });
    }

    reply.send({ code: 200, message: "details successfully removed" });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.updateTeeth = async (request, reply) => {
  const { request_id } = request.params;

  try {
    const imaging = await Request.findOne({ where: { request_id } });

    if (!imaging) {
      throw new UserException(404, "Request not found");
    }

    // connect teeth
    await imaging.setTeeth(request.body);

    reply.send({ code: 200, message: "details successfully updated" });
  } catch (error) {
    reply.code(400).send(error);
  }
};
