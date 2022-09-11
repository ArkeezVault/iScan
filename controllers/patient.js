const fs = require("fs");
const path = require("path");
const multer = require("fastify-multer");

const { UserException } = require("../plugins/exceptions");
const generateUniqueId = require("generate-unique-id");
const identifier = () => generateUniqueId({ length: 8 });

const { Patient, User } = require("../models");

module.exports.fetchPatients = async (request, reply) => {
  try {
    const patients = await Patient.findAll();

    reply.send({
      code: 200,
      results: patients,
    });
  } catch (error) {
    reply.code(400).send(error);
  }
};

module.exports.fetchPatient = async (request, reply) => {
  const { user_id } = request.params;

  try {
    const patient = await Patient.findOne({
      where: { user_id },
      include: [
        {
          model: User,
          attributes: ["avatar"],
          as: "user",
          include: ["role"],
        },
        "doctor",
      ],
    });

    if (!patient) {
      throw new UserException(404, "patient not found");
    }

    reply.send({
      code: 200,
      results: patient,
    });
  } catch (error) {
    reply.send(error);
  }
};
