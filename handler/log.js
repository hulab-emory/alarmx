const logService = require("../services/log");


exports.create = (req, res) => {
  const { uid, action, target, details = "" } = req.body;
  logService
    .create(uid, action, target, details)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findByUserId = (req, res) => {
  const { uid } = req.params;
  logService
    .findByUserId(uid)
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
  const { lid } = req.params;
  logService
    .findById(lid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findByAction = (req, res) => {
  const { action } = req.body;
  logService
    .findByAction(action)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.find = (req, res) => {
  const { condition } = req.body;

  logService
    .find(condition)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};