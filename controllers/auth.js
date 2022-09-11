/**
 * AUTHENTICATION MODULE
 *
 * - user has role
 * - role has permissions
 * - permission has actions
 */

const path = require("path");

const fs = require("fs");

const PROFILE_IMAGES_PATH = path.join(__dirname, "..", "public/images/users");

const multer = require("fastify-multer");

const storage = multer.diskStorage({
  destination: PROFILE_IMAGES_PATH,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + file.originalname.split(".").pop());
  },
});

const upload = multer({ storage });

const bcrypt = require("bcrypt");

const generateUniqueId = require("generate-unique-id");

const identifier = () => generateUniqueId({ length: 8 });

const { UserException } = require("../plugins/exceptions");

const { User, Role, Doctor, Patient } = require("../models");

// REGISTER ENDPOINT
module.exports.register = async (request, reply) => {
  const { username, phone, password, role_id } = request.body;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({
      user_id: identifier(),
      phone,
      password: hash,
      role_id,
    });

    const { user_id } = user.toJSON();

    if (role_id == 1) {
      await user.createPatient({ user_id, patient_name: username, phone });
    }

    if (role_id == 2) {
      await user.createDoctor({ user_id, doctor_name: username, phone });
    }

    reply.send({
      code: 200,
      message: "user successfully created",
    });
  } catch (error) {
    reply.code(400).send(error.errors);
  }
};

// LOGIN ENDPOINT
module.exports.login = async (request, reply) => {
  const fastify = request.server;
  const { phone, password } = request.body;

  try {
    const user = await User.findOne({
      where: { phone },
      include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
    });

    if (!user) {
      throw new UserException(404, "username does not exist!");
    }

    // check if password correct
    let data = user.toJSON();

    const authenticated = await bcrypt.compare(password, data.password);

    if (!authenticated) {
      throw new UserException(400, "incorrect password");
    }

    // sign token
    const token = fastify.jwt.sign({
      user_id: data.user_id,
      phone: data.phone,
      type: data.type,
    });

    let results = {
      token,
      user_id: data.user_id,
      image: data.avatar,
      username: data.username,
      phone: data.phone,
      role: data.role,
    };

    if (data?.role?.id == 1) {
      const { patient_name } = await user.getPatient({ raw: true, nest: true });

      results.patient_name = patient_name;
    }

    if (data?.role?.id == 2) {
      const { id, doctor_name } = await user.getDoctor({
        raw: true,
        nest: true,
      });

      results.id = id;
      results.doctor_name = doctor_name;
    }

    reply.send({
      code: 200,
      results,
    });
  } catch (error) {
    reply.code(400).send(error);
  }
};

// RESET PASSWORD
module.exports.reset = async (request, reply) => {
  const { user_id } = request.params;
  const { new_password } = request.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(new_password, salt);

    console.log(hash);

    const user = await User.update({ password: hash }, { where: { user_id } });

    reply.send({
      code: 200,
      message: "password has been successfully updated",
    });
  } catch (error) {
    console.log(error);
    reply.send(error);
  }
};

// FETCH ALL USERS
module.exports.fetchAll = async (request, reply) => {
  reply.send({
    code: 200,
    results: await User.findAll({
      attributes: ["id", "phone", "role_id"],
      include: { model: Role, as: "role" },
    }),
  });
};

// EDIT PROFILE
module.exports.update = async (request, reply) => {
  const { user_id } = request.params;
  const { username, phone, role_id } = request.body;

  try {
    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      throw new UserException(404, "user not found");
    }

    await User.update({ phone, role_id }, { where: { user_id } });

    if (role_id == 1) {
      await Patient.update(
        { patient_name: username, phone },
        { where: { user_id } }
      );
    }

    if (role_id == 2) {
      await Doctor.update(
        { doctor_name: username, phone },
        { where: { user_id } }
      );
    }

    reply.send({
      code: 200,
      results: await User.findOne({
        where: { user_id },
        attributes: ["id", "phone", "role_id"],
        include: [{ model: Role, as: "role" }],
      }),
    });
  } catch (error) {
    reply.send(error);
  }
};

// REMOVE USER
module.exports.remove = async (request, reply) => {
  try {
    const { user_id } = request.params;

    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      throw new UserException(404, "user not found!");
    }

    await User.destroy({ where: { user_id } });

    reply.send({ code: 200 });
  } catch (error) {
    reply.send(error);
  }
};

// upload a profile image
module.exports.removePreviousImage = async (request, reply, done) => {
  const { user_id } = request.params;

  const { avatar } = await User.findOne({
    raw: true,
    nest: true,
    where: { user_id },
    attributes: ["avatar"],
  });

  const lastIndexSlash = avatar.lastIndexOf("/");

  const prevImagePath = path.join(
    PROFILE_IMAGES_PATH,
    avatar.slice(lastIndexSlash)
  );

  if (fs.existsSync(prevImagePath)) {
    fs.unlinkSync(prevImagePath);
  }

  done();
};

module.exports.profileImage = upload.single("avatar");

module.exports.uploadImage = async (request, reply) => {
  const { user_id } = request.params;
  const { filename } = request.file;

  const image_path = `/images/users/${filename}`;

  try {
    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      throw new UserException(404, "user not found");
    }
    console.log(image_path);
    const updated = await User.update(
      { avatar: image_path },
      { where: { user_id } }
    );

    reply.send({
      code: 200,
      message: "profile image successfully updated",
    });
  } catch (error) {
    reply.send(error);
  }
};
