const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const util = require("util");
const astat = util.promisify(fs.stat);
const areaddir = util.promisify(fs.readdir);

async function getFiles(dir) {
  // Get this directory's contents
  const files = await areaddir(dir);
  return Promise.all(
    files
      .map((f) => path.join(dir, f))
      .map(async (f) => {
        const stats = await astat(f);
        return stats.isDirectory()
          ? { type: "dir", path: f.replace(dir + "/", "") }
          : { type: "file", path: f.replace(dir + "/", "") };
      })
  );
}

exports.findAll = (req, res) => {
  getFiles(
    req.params[0]
      ? path.join(process.env.BUCKET_PATH, req.params[0])
      : process.env.BUCKET_PATH
  )
    .then((files) => {
      if (files) {
        res.send(files);
      } else {
        res.send([]);
      }
    })
    .catch((err) => {
      console.log(
        "There was an error getting bucket files",
        JSON.stringify(err)
      );
      res.sendStatus(err);
    });
};