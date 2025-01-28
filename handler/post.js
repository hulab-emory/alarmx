const postService = require('../services/post');

exports.findAll = (req, res) => {
  const { page=0, pageLength=10 } = req.query;
  const { fid } = req.params;

  postService.findAll(fid, page, pageLength)
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
  const { pid } = req.params;

  postService.findById(pid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.findByUserId = (req, res) => {
  const { uid, fid } = req.params;
  const { page=0, pageLength=10 } = req.query;

  postService.findByUserId(fid, uid, page, pageLength)
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
  const { content } = req.body;

  postService.create(content)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.update = (req, res) => {
  const { pid } = req.params;
  const body = req.body;

  postService.update(pid, body)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.remove = (req, res) => {
  const { pid } = req.params;

  postService.remove(pid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.search = (req, res) => {
  const { keyword, page=0, pageLength=10 } = req.query;
  const { fid } = req.params;

  postService.search(fid, keyword, page, pageLength)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};