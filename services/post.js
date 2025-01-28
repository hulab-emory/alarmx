db = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("../models");

/**
 * 
 * @param {Number} page Page number starts at 1
 * @param {Number} pageLength Page length > 0
 * @returns 
 */
exports.findAll = (fid, page, pageLength) => {
  return db.post.findAll({
    include: [
      {
        model: db.user,
        attributes: ["id", "username", "email", "firstName", "lastName", "avatar"],
      },
    ],
    where: {
      featureId: fid,
    },
    order: [["createdAt", "DESC"]],
    offset: (page - 1) * pageLength,
    limit: pageLength,
  });
};

/**
 * 
 * @param {Number} pid 
 * @returns 
 */
exports.findById = (pid) => {
  return db.post.findOne({
    include: [
      {
        model: db.user,
        attributes: ["id", "username", "email", "firstName", "lastName", "avatar"],
      },
    ],
    where: {
      id: pid,
    },
  });
};

/**
 * 
 * @param {Number} uid 
 * @param {Number} page 
 * @param {Number} pageLength 
 * @returns 
 */
exports.findByUserId = (fid, uid, page, pageLength) => {
  return db.post.findAll({
    include: [
      {
        model: db.user,
        attributes: ["id", "username", "email", "firstName", "lastName", "avatar"],
      },
    ],
    where: {
      userId: uid,
      featureId: fid,
    },
    order: [["createdAt", "DESC"]],
    offset: (page - 1) * pageLength,
    limit: pageLength,
  });
};

/**
 * 
 * @param {Object} content 
 * @returns 
 */
exports.create = (content) => {
  return db.post.create(content);
};

/**
 * 
 * @param {Number} pid 
 * @returns 
 */
exports.remove = (pid) => {
  return db.post.destroy({
    where: {
      id: pid,
    },
  });
};

/**
 * 
 * @param {Number} pid 
 * @param {Object} content 
 * @returns 
 */
exports.update = (pid, content) => {
  return db.post.update(content, {
    where: {
      id: pid,
    },
  });
};

exports.search = (fid, keyword, page, pageLength) => {
  return db.post.findAll({
    include: [
      {
        model: db.user,
        attributes: ["id", "username", "email", "firstName", "lastName", "avatar"],
        where: {
          [Op.or]: [
            {
              username: {
                [Op.like]: Sequelize.literal(`LOWER("%${keyword}%")`),
              },
            },
            {
              email: {
                [Op.like]: Sequelize.literal(`LOWER("%${keyword}%")`),
              },
            },
            {
              firstName: {
                [Op.like]: Sequelize.literal(`LOWER("%${keyword}%")`),
              },
            },
            {
              lastName: {
                [Op.like]: Sequelize.literal(`LOWER("%${keyword}%")`),
              },
            },
          ],
        },
      },
    ],
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: Sequelize.literal(`LOWER("%${keyword}%")`),
          },
        },
        {
          content: {
            [Op.like]: Sequelize.literal(`LOWER("%${keyword}%")`),
          },
        },
      ],
      featureId: fid,
    },
    order: [["createdAt", "DESC"]],
    offset: (page - 1) * pageLength,
    limit: pageLength,
  });
}