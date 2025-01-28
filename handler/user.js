const userService = require("../services/user");
const authService = require("../services/auth");
const featureService = require("../services/feature");

exports.findAll = (req, res) => {
  userService
    .findAll()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.create = async (req, res) => {
  const { username, email, firstName, lastName, loginType, isBot, fid, role, status } = req.body;

  try {
    // check if user exists
    const userExists = await userService.findByUsername(username);

    if (userExists) {
      // check if user is already in the feature
      if (userExists.dataValues.featureUsers.find(fu => fu.featureId === fid)) {
        return res.status(400).send({
          message: "User already exists in the app"
        });
      }
      // if feature doesn't exist
      await featureService.createFeatureUserRole(
        fid,
        userExists.dataValues.id,
        role,
        status ?? "Pending"
      );

      return res.send({ success: 1 });
    }

    const user = await userService
      .create(
        username,
        email,
        password = null,
        firstName,
        lastName,
        loginType,
        isBot
      );

    await featureService.createFeatureUserRole(
      fid,
      user.dataValues.id,
      role,
      status ?? "Pending"
    );

    res.send({ success: 1 });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.findById = (req, res) => {
  const { uid } = req.params;

  userService
    .findById(uid)
    .then((result) => {
      if (result && result.dataValues) {
        res.send(result.dataValues);
      } else {
        res.status(404).send({
          message: "Not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findAllByFeatureId = (req, res) => {
  const { fid } = req.params;

  userService
    .findAllByFeatureId(fid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });

};

exports.update = async (req, res) => {
  const { uid } = req.params;
  const body = req.body;

  if (Object.keys(body).includes('password')) {
    entryptedPassword = await authService.getEncryptedPassword(body.password);
    body.password = entryptedPassword;
  }

  userService
    .update(uid, body)
    .then((success) => {
      console.log("success: ", success)
      success == 1
        ? res.send({ message: "Successfully updated" })
        : res.status(500).send({ message: `Cannot update with id=${uid}!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.resetPasswordByUsername = async (req, res) => {
  const { username, password } = req.body;

  try {
    entryptedPassword = await authService.getEncryptedPassword(password);
    // get uid
    const user = await userService.findByUsername(username);
    if (!user) {
      return res.status(404).send({
        message: "User not found!"
      })
    }

    const uid = user.dataValues.id;
    await userService.update(uid, {
      password: entryptedPassword,
    });

    const fids = user.featureUsers.map((fu) => {
      return fu.featureId
    })

    const features = await featureService.findByIds(fids);

    const featureUsers = {};

    for (let fu of user.featureUsers) {
      featureUsers[fu.featureId] = {
        "role": fu.role,
        "app": features.find(f => f.id === fu.featureId).dataValues.name
      }
    }

    const newUser = { ...user.dataValues, featureUsers: featureUsers };

    res.send(newUser);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}

exports.delete = (req, res) => {
  const { uid } = req.params;

  userService
    .delete(uid)
    .then((success) => {
      success == 1
        ? res.send({ message: "Removed successfully" })
        : res.send({ message: "Nothing to delete" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.search = (req, res) => {
  const { fid, attributes, status, exUids, searchString, limit } = req.body;
  userService
    .search(fid, attributes, status, exUids, searchString, limit)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
