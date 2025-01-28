const userService = require("../services/user");
const featureService = require("../services/feature");

exports.findAll = (req, res) => {
  featureService
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

exports.create = (req, res) => {
  const { name, description } = req.body;

  featureService
    .create(name, description)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findById = (req, res) => {
  const { fid } = req.params;

  featureService
    .findById(fid)
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

exports.update = (req, res) => {
  const { fid } = req.params;
  const body = req.body;

  featureService
    .update(fid, body)
    .then((success) => {
      success == 1
        ? res.send({ message: "Updated successfully" })
        : res.send({ message: `Cannot update with id=${fid}` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.delete = (req, res) => {
  const { fid } = req.params;

  featureService
    .delete(fid)
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

exports.findFeatureUserRolesByFeatureId = (req, res) => {
  const { fid } = req.params;

  featureService
    .findFeatureUserRolesByFeatureId(fid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.createFeatureUserRole = (req, res) => {
  const { fid } = req.params;
  const { username, email, firstName, lastName, loginType, isBot, role, status = "Pending" } =
    req.body;

  userService
    .findByUsername(username)
    .then((user) => {
      console.log(user)
      if (!user) {
        return userService.create(
          username,
          email,
          (password = null),
          firstName,
          lastName,
          loginType,
          isBot
        );
      } else {
        let isFeatureRoleExist = user.dataValues.featureUsers.find(
          (f) => f.get({ plain: true }).featureId === parseInt(fid, 10)
        );
        if (isFeatureRoleExist) {
          return { message: "User exists!" };
        } else return user;
      }
    })
    .then((user) => {
      if (user.message) {
        return res.status(500).send(user);
      }
      return featureService
        .createFeatureUserRole(fid, user.id, role, status)
        .then(async (featureUser) => {
          // Merge user and feature objects
          const userObj = {
            ...user.dataValues,
            featureUsers: [featureUser],
          };
          return res.json(userObj);
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findFeatureUserRole = (req, res) => {
  const { fid, uid } = req.params;

  featureService
    .findFeatureUserRole(fid, uid)
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

exports.updateFeatureUserRole = (req, res) => {
  const { fid, uid } = req.params;
  const body = req.body;

  featureService
    .updateFeatureUserRole(fid, uid, body)
    .then((success) => {
      success == 1
        ? res.send({ message: "Updated successfully" })
        : res.send({ message: "Cannot update" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.deleteFeatureUserRole = (req, res) => {
  const { fid, uid } = req.params;

  userService
    .findById(uid)
    .then((user) => {
      if (
        user &&
        user.dataValues &&
        user.dataValues.featureUsers.length === 1
      ) {
        return featureService
          .deleteFeatureUserRole(fid, uid)
          .then((success) => {
            success == 1 ? userService.delete(uid) : success;
          });
      }
      return featureService.deleteFeatureUserRole(fid, uid);
    })
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
