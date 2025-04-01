db = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("../models");

/**
 *
 * @returns all users
 */
exports.findAll = () => {
  return db.user.findAll({
    include: [
      {
        model: db.featureUser,
      },
    ],
  });
};

/**
 * Find all users that has a given feature
 * @param {Number} fid 
 * @returns {List<Object>} all users belonging to the given feature
 */
exports.findAllByFeatureId = (fid) => {
  return db.user.findAll({
    include: [
      {
        model: db.featureUser,
        required: true,
        where: {
          featureId: fid,
        }
      }
    ]
  });
};

/**
 *
 * @param {String} username
 * @param {String} email
 * @param {String} password
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} loginType - github, local, google or emory
 * @param {Number} isBot - 0 or 1
 * @returns created user
 */
exports.create = (
  username,
  email,
  password,
  firstName,
  lastName,
  loginType = "local",
  isBot = 0,
) => {
  return db.user.create({
    username: username,
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
    loginType: loginType,
    isBot: isBot,
  });
};

/**
 *
 * @param {Number} uid
 * @returns the user with the given id
 */
exports.findById = (uid) => {
  return db.user.findOne({
    where: {
      id: uid,
    },
    include: [
      {
        model: db.featureUser,
        required: true,
      },
    ],
  });
};

/**
 *
 * @param {String} username
 * @returns the user with the given username
 */
exports.findByUsername = (username) => {
  return db.user.findOne({
    where: Sequelize.where(
      Sequelize.fn('lower', Sequelize.col('username')),
      Sequelize.fn('lower', username)
    ),
    include: [
      {
        model: db.featureUser,
        required: false,
      },
    ],
  });
};

/**
 *
 * @param {Array<Number>} uids userIds
 * @returns all match users of the given uids
 */
exports.findByIds = (uids) => {
  return db.user.findAll({
    where: {
      id: {
        [Op.in]: uids,
      },
    },
  });
};

/**
 *
 * @param {Number} uid
 * @param {Object} body
 * @returns updated user
 */
exports.update = (uid, body) => {
  return db.user.update(body, {
    where: {
      id: uid,
    },
  });
};

/**
 *
 * @param {Number} uid
 * @returns remove user with the given id
 */
exports.delete = (uid) => {
  return db.user.destroy({
    where: {
      id: uid,
    },
  });
};

/**
 *
 * @param {Number} uid
 * @returns botUser if any
 */
exports.isBot = (uid) => {
  return db.user.findOne({
    where: {
      id: uid,
      isBot: 1,
    },
  });
};

/**
 *
 * @param {Number} fid feature id, if left blank then return every user and every feature
 * @param {Array<String>} attributes select certain attributes from user table
 * @param {String} statusFilter select users with a specific status
 * @param {Array<Number>} exUids excluded userIds
 * @param {String} searchString select users whose user name or email match the string
 * @param {Number} limit number of records to return
 * @returns all match Users
 */
exports.search = (
  fid = null,
  attributes = [],
  statusFilter = "",
  exUids = [],
  searchString = "",
  limit
) => {
  const query = {
    order: [["id", "DESC"]],
  };
  const where = {};
  const opAnd = [];

  const filter = {
    model: db.featureUser,
    required: true,
  };
  // if filter fid
  if (fid !== null) {
    where["featureId"] = fid;
  }
  // if filter status
  if (statusFilter !== "") {
    where["status"] = statusFilter;
  }
  if (Object.keys(where).length !== 0) {
    filter["where"] = where;
  }

  // must include Id column
  if (attributes.length > 0) {
    if (attributes.includes("id")) {
      query["attributes"] = attributes;
    } else {
      query["attributes"] = ["id", ...attributes];
    }
  }

  // if filter exUids
  if (exUids.length > 0) {
    opAnd.push({
      id: { [Op.notIn]: exUids },
    });
  }
  // if filter searchString
  if (searchString !== "") {
    opAnd.push({
      [Op.or]: [
        { firstName: { [Op.like]: `%${searchString}%` } },
        { lastName: { [Op.like]: `%${searchString}%` } },
        { username: { [Op.like]: `%${searchString}%` } },
        { email: { [Op.like]: `%${searchString}%` } },
      ],
    });
  }
  if (opAnd.length > 0) {
    query["where"] = {
      [Op.and]: opAnd,
    };
  }
  query["include"] = [filter];
  // if set limit
  if (limit) {
    query["limit"] = limit;
  }
  return db.user.findAll(query);
};
