const bcrypt = require("bcrypt");

const generateUniqueId = require("generate-unique-id");

const identifier = () => generateUniqueId({ length: 8 });

const { UserException } = require("../plugins/exceptions");

const { User, Company, Doctor, Patient, Imaging } = require("../models");

// ATTACH DOCTOR TO COMPANY
module.exports.attachDoctor = async (request, reply) => {
  const { company_id, doctor_id } = request.params;

  try {
    const company = await Company.findOne({ where: { user_id: company_id } });

    if (!company) {
      throw new UserException(404, "company not found");
    }

    const doctor = await Doctor.findOne({ where: { user_id: doctor_id } });

    if (!doctor) {
      throw new UserException(404, "doctor not found");
    }

    const attach = await company.addDoctor(doctor);

    if (!attach) {
      throw new UserException(
        400,
        "failed!. doctor was not attached to company"
      );
    }

    reply.send({
      code: 200,
      message: "doctor successfully attached to company",
    });
  } catch (error) {
    reply.send(error);
  }
};

// DETTACH DOCTOR TO COMPANY
module.exports.dettachDoctor = async (request, reply) => {
  const { company_id, doctor_id } = request.params;

  try {
    const company = await Company.findOne({ where: { user_id: company_id } });

    if (!company) {
      throw new UserException(404, "company not found");
    }

    const doctor = await Doctor.findOne({ where: { user_id: doctor_id } });

    if (!doctor) {
      throw new UserException(404, "doctor not found");
    }

    const attach = await company.removeDoctor(doctor);

    if (!attach) {
      throw new UserException(
        400,
        "failed!. doctor was not dettached to company"
      );
    }

    reply.send({
      code: 200,
      message: "doctor successfully dettached to company",
    });
  } catch (error) {
    reply.send(error);
  }
};

// FETCH Companies
module.exports.fetchCompanies = async (request, reply) => {
  try {
    const companies = await Company.findAll({
      include: [
        {
          model: User,
          as: "company_profile",
          attributes: ["avatar", "role_id"],
        },
        {
          model: Doctor,
          as: "doctors",
          include: [
            {
              model: Patient,
              as: "patients",
              include: [
                {
                  model: Imaging,
                  as: "images",
                  include: ["options"],
                },
              ],
            },
          ],
        },
      ],
    });

    reply.send({
      code: 200,
      results: companies,
    });
  } catch (error) {
    reply.send(error);
  }
};

// create doctor
module.exports.createDoctor = async (request, reply) => {
  const { company_id } = request.params;

  try {
    const company = await Company.findOne({ where: { user_id: company_id } });

    if (!company) {
      throw new UserException(404, "company not found");
    }

    const { username, phone } = request.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("12345", salt);

    const user = await User.create({
      user_id: identifier(),
      phone,
      password: hash,
      role_id: 2,
    });

    const { user_id } = user.toJSON();

    const doctor = await user.createDoctor({
      user_id,
      doctor_name: username,
      phone,
    });

    const attach = await company.addDoctor(doctor);

    if (!attach) {
      throw new UserException(400, "failed!. doctor not attached");
    }

    reply.send({
      code: 200,
      message: "successfully created and attached doctor",
    });
  } catch (error) {
    reply.send(error);
  }
};
