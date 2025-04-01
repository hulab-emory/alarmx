db = require("../models");
const { Op } = require("sequelize");


/**
 * Creates a log
 * @param {Number} uid
 * @param {String} action 
 * @param {String} target 
 * @param {String?} details  
 * @returns 
 */
exports.create = (uid, action, target, details="") => {
  return db.log.create({
    action,
    target,
    details,
    userId: uid
  });
};


/**
 * Find all logs of a user
 * @param {Number} uid 
 * @returns logs that belong to the user
 */
exports.findByUserId = (uid) => {
  return db.log.findAll({
    order: [['createdAt', 'DESC']],
    where: {
      userId: uid,
    },
  });
};

/**
 * Find log by id
 * @param {Number} lid 
 * @returns 
 */
exports.findById = (lid) => {
  return db.log.findOne({
    where: {
      id: lid,
    },
  });
};

/**
 * Search by user action
 * @param {String} action 
 * @param {Number?} uid 
 */
exports.findByAction = (action, uid) => {
  const search = {
    order: [['createdAt', 'DESC']],
    where: {
      action: action
    }
  };
  if (uid !== undefined && uid !== null) {
    search.where.userId = uid
  }
  return db.log.findAll(search);
};

/**
 * 
 * @param {Object} condition 
 * @returns 
 */
exports.find = (condition) => {
  return db.log.findAll({
    where: condition
  });
};