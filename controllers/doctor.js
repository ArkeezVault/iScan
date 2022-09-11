const bcrypt = require("bcrypt");

const generateUniqueId = require("generate-unique-id");

const identifier = () => generateUniqueId({ length: 8 });

const { UserException } = require("../plugins/exceptions");

const { Doctor, Request } = require("../models");

// FETCH DOCTORS
module.exports.fetchDoctors = async (request, reply) => {
  try {
    const doctors = await Doctor.findAll({
      order: [["doctor_name", "ASC"]],
      include: [{ model: Request, as: "requests" }],
    });

    reply.send({ code: 200, results: doctors });
  } catch (error) {
    reply.code(400).send(error);
  }
};
