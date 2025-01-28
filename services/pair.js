const db = require("../models");
const { Op, Sequelize } = require("sequelize");

/**
 * 
 * @returns {List<Object>} all pairs
 */
exports.findAll = () => {
  return db.userPair.findAll({
    include: [
      {
        model: db.user,
        as: 'user1',
        required: true,
      },
      {
        model: db.user,
        as: 'user2',
        required: true,
      }
    ]
  });
};

/**
 * 
 * @param {Number} uid 
 * @returns user's paired accounts
 */
exports.findByUserId = (uid, fid) => {
  return db.userPair.findAll({
    where: {
      [Sequelize.Op.or]: [{ user1Id: uid }, { user2Id: uid }],
      featureId: fid
    },
    include: [
      {
        model: db.user,
        as: 'user1',
        where: {
          id: {
            [Op.not]: uid
          }
        },
        required: false,
      },
      {
        model: db.user,
        as: 'user2',
        where: {
          id: {
            [Op.not]: uid
          }
        },
        required: false,
      },
    ],
  });
};

/**
 * 
 * @param {Number} user1Id 
 * @param {Number} user2Id 
 * @param {String} user1Status
 * @param {String} user2Status
 * @param {Number} fid
 * @returns created pair
 */
exports.create = (user1Id, user2Id, user1Status, user2Status, fid) => {
  return db.userPair.create({
    user1Id: user1Id,
    user2Id: user2Id,
    user1Status: user1Status,
    user2Status: user2Status,
    featureId: fid
  });
};

/**
 * 
 * @param {Number} user1Id 
 * @param {Number} user2Id 
 * @param {String} user1Status 
 * @param {String} user2Status 
 * @param {Number} fid
 * @returns updated pair
 */
exports.update = (user1Id, user2Id, user1Status, user2Status, fid) => {
  return db.userPair.update({
    user1Status: user1Status,
    user2Status: user2Status,
  }, {
    where: {
      user1Id: user1Id,
      user2Id: user2Id,
      featureId: fid
    }
  });
};

/**
 * 
 * @param {Number} user1Id 
 * @param {Number} user2Id 
 * @param {Number} fid
 * @returns removed pair
 */
exports.remove = (user1Id, user2Id, fid) => {
  return db.userPair.destroy({
    where: {
      user1Id: user1Id,
      user2Id: user2Id,
      featureId: fid
    }
  });
};