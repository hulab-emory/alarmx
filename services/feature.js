db = require("../models");
const { Op } = require("sequelize");

/**
 *
 * @returns all features
 */
exports.findAll = () => {
  return db.feature.findAll({
    include: [
      {
        model: db.featureUser,
      },
    ],
  });
};

/**
 *
 * @param {String} name
 * @param {String} description
 * @returns created feature
 */
exports.create = (name, description) => {
  return db.feature.create({
    name: name,
    description: description,
  });
};

/**
 *
 * @param {Number} fid
 * @returns a feature of the given fid
 */
// Find a Feature by an id
exports.findById = (fid) => {
  return db.feature.findOne({
    where: {
      id: fid,
    },
    include: [
      {
        model: db.featureUser,
      },
    ],
  });
};

/**
 *
 * @param {Array<Number>} fids featureIds
 * @returns all match features of the given fids
 */
exports.findByIds = (fids) => {
  return db.feature.findAll({
    where: {
      id: {
        [Op.in]: fids,
      },
    },
  });
};

/**
 *
 * @param {Number} fid
 * @param {Object} body
 * @returns updated feature
 */
exports.update = (fid, body) => {
  return db.feature(body, {
    where: {
      Id: fid,
    },
  });
};

/**
 *
 * @param {Number} fid
 * @returns remove feature
 */
exports.delete = (fid) => {
  return db.destroy({
    where: {
      Id: fid,
    },
  });
};

/**
 *
 * @param {Number} fid
 * @returns
 */
exports.findFeatureUserRolesByFeatureId = (fid) => {
  return db.user.findAll({
    include: [
      {
        model: db.feature,
        where: {
          id: fid,
        },
        require: true,
      },
    ],
  });
};

/**
 *
 * @param {Number} userId
 * @returns a feature of the given user
 */
exports.findFeatureUserRolesByUserId = (userId) => {
  return db.feature.findOne({
    include: [
      {
        model: db.featureUser,
        where: {
          id: userId,
        },
        require: true,
      },
    ],
  });
};

/**
 *
 * @param {Number} fid
 * @param {Number} uid
 * @param {String} role
 * @param {String} status
 * @returns created feature user
 */
exports.createFeatureUserRole = (fid, uid, role, status = "Pending") => {
  return db.featureUser.create({
    featureId: fid,
    userId: uid,
    role: role,
    status: status,
  });
};

/**
 *
 * @param {Number} fid
 * @param {Number} uid
 * @returns a featureuser of the given featureId and userId
 */
exports.findFeatureUserRole = (fid, uid) => {
  return db.featureUser.findOne({
    where: {
      featureId: fid,
      userId: uid,
    },
  });
};

/**
 *
 * @param {Number} fid
 * @param {Number} uid
 * @param {Object} role
 * @returns updated featureuser
 */
exports.updateFeatureUserRole = (fid, uid, body) => {
  return db.featureUser.update(
    body,
    {
      where: {
        featureId: fid,
        userId: uid,
      },
    }
  );
};

/**
 *
 * @param {Number} fid
 * @param {Number} uid
 * @returns remove featureuser with the given id
 */
exports.deleteFeatureUserRole = (fid, uid) => {
  return db.featureUser.destroy({
    where: {
      featureId: fid,
      userId: uid,
    },
  });
};
