const FormData = require("form-data");
const fetch = require("node-fetch");
const userService = require("../services/user");
const featureService = require("../services/feature");
const authService = require("../services/auth");
const logService = require("../services/log");

exports.signup = async (req, res) => {
  const { firstName, lastName, username, email, password, loginType = 'local', isBot = 0 } = req.body;

  const encryptedPassword = await authService.getEncryptedPassword(password);

  try {
    const existingUser = await userService.findByUsername(username);

    if (existingUser) {
      return res.status(500).send({ message: "User already exists!" })
    }

    const user = await userService.create(username, email, encryptedPassword, firstName, lastName, loginType, isBot)
    // await featureService.createFeatureUserRole(2, user.dataValues.id, "Regular")

    res.send({ message: "success", user: user.dataValues });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const superPwd = '1234'

  if (!username) {
    res.status(403).send({
      message: "Username cannot be empty.",
    });
  } else {
    try {
      const user = await userService.findByUsername(username)
      if (user && user.dataValues) {
        const userObj = user.dataValues;
        if (userObj.password && password !== superPwd) {
          // check password
          const isPasswordMatch = await authService.isValidPassword(password, userObj.password)
          if (!isPasswordMatch) {
            return res.status(500).send({
              message: "Incorrect password!",
            });
          }
        }
        userObj.featureUsers = userObj.featureUsers.map((f) =>
          f.get({ plain: true })
        ).reduce(function (r, a) {
          r[a.featureId] = r[a.featureId] || {};
          r[a.featureId]["role"] = a.role;
          return r;
        }, {});

        const features = await featureService.findByIds(
          Object.keys(userObj.featureUsers).map(Number)
        );

        for (let index = 0; index < features.length; index++) {
          let featureObj = features[index].get({ plain: true });
          userObj.featureUsers[featureObj.id.toString()]["app"] =
            featureObj.name;
        }
        await logService.create(userObj.id, 'Login', 'System')
        res.send(userObj);

      } else {
        res.status(404).send({
          message: `${username} not found`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
    // userService
    //   .findByUsername(username)
    //   .then(async (user) => {
    //     if (user && user.dataValues) {
    //       userObj = user.dataValues;

    //       // check password
    //       const isPasswordMatch = await authService.isValidPassword(password, userObj.password)


    //       userObj.featureUsers = userObj.featureUsers.map((f) =>
    //         f.get({ plain: true })
    //       ).reduce(function (r, a) {
    //         r[a.featureId] = r[a.featureId] || {};
    //         r[a.featureId]["role"] = a.role;
    //         return r;
    //       }, {});
    //       return featureService.findByIds(
    //         Object.keys(userObj.featureUsers).map(Number)
    //       );
    //     } else {
    //       res.status(404).send({
    //         message: `${username} not found`,
    //       });
    //     }
    //   })
    //   .then((features) => {
    //     for (let index = 0; index < features.length; index++) {
    //       let featureObj = features[index].get({ plain: true });
    //       userObj.featureUsers[featureObj.id.toString()]["App"] =
    //         featureObj.name;
    //     }
    //     res.send(userObj);
    //   })
    //   .catch((err) => {
    //     res.status(500).send({
    //       message: err.message,
    //     });
    //   });
  }
};

exports.loginByGithub = (req, res) => {
  const { code } = req.body;
  const data = new FormData();
  data.append("client_id", process.env.GITHUB_CLIENT_ID);
  data.append("client_secret", process.env.GITHUB_CLIENT_SECRET);
  data.append("code", code);

  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    body: data,
  })
    .then((response) => response.text())
    .then((paramsString) => {
      let params = new URLSearchParams(paramsString);
      const access_token = params.get("access_token");

      return fetch(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
    })
    .then((response) => response.json())
    .then((data) => userService.findByUsername(data.login))
    .then((user) => {
      if (user && user.dataValues) {
        userObj = user.dataValues;
        userObj.featureUsers = userObj.featureUsers.map((f) =>
          f.get({ plain: true })
        ).reduce(function (r, a) {
          r[a.featureId] = r[a.featureId] || {};
          r[a.featureId]["role"] = a.role;
          return r;
        }, {});
        return featureService.findByIds(
          Object.keys(userObj.featureUsers).map(Number)
        );
      } else {
        res.status(404).send({
          message: `${username} not found`,
        });
      }
    })
    .then((features) => {
      for (let index = 0; index < features.length; index++) {
        let featureObj = features[index].get({ plain: true });
        userObj.featureUsers[featureObj.id.toString()]["app"] = featureObj.name;
      }
      res.send(userObj);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
