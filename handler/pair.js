const pairService = require('../services/pair');

exports.findAll = async (req, res) => {
  try {
    const pairs = await pairService.findAll();
    if (!pairs || pairs?.length === 0) {
      return res.status(404).send({
        message: "No pair found",
      });
    }
    res.send(pairs);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.findByUserId = async (req, res) => {
  const { uid, fid } = req.params;
  try {
    const pairs = await pairService.findByUserId(uid, fid);
    if (!pairs || pairs?.length === 0) {
      return res.status(404).send({
        message: "No pair found",
      });
    }
    res.send(pairs);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.create = async (req, res) => {
  const { user1Id, user2Id, user1Status, user2Status, fid } = req.body;
  try {
    const newPair = await pairService.create(user1Id, user2Id, user1Status, user2Status, fid);
    res.send(newPair);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.update = async (req, res) => {
  const { user1Id, user2Id, user1Status, user2Status, fid } = req.body;
  try {
    await pairService.update(user1Id, user2Id, user1Status, user2Status, fid);
    res.send({ success: 1 });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}

exports.delete = async (req, res) => {
  const { user1Id, user2Id, fid } = req.body;
  try {
    await pairService.remove(user1Id, user2Id, fid);
    res.send({
      message: "Pair deleted",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};