const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const util = require("util");
const astat = util.promisify(fs.stat);
const areaddir = util.promisify(fs.readdir);

const maxFilesReturned = 200;

const sortFiles = (files) => {
  // Helper function to extract numerical and string parts of a path for comparison
  const extractKey = (str) => str.match(/\d+|[^\d]+/g).map((chunk) => (isNaN(chunk) ? chunk : Number(chunk)));

  // Custom comparison for natural sorting
  const naturalCompare = (a, b) => {
    const aParts = extractKey(a);
    const bParts = extractKey(b);
    for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
      if (aParts[i] !== bParts[i]) {
        return typeof aParts[i] === "number" && typeof bParts[i] === "number"
          ? aParts[i] - bParts[i]
          : aParts[i].localeCompare(bParts[i]);
      }
    }
    return aParts.length - bParts.length;
  };

  return files.sort((a, b) => {
    return naturalCompare(a, b);
  });
};

async function getFiles(dir) {
  // Get this directory's contents
  let files = await areaddir(dir);
  files = sortFiles(files);
  const fileLength = files.length;
  if (fileLength > maxFilesReturned) {
    // remove files from the list if there are too many
    files.splice(maxFilesReturned, fileLength - maxFilesReturned);
  }
  const fileDetails = await Promise.all(
    files
      .map((f) => path.join(dir, f))
      .map(async (f) => {
        const stats = await astat(f);
        return stats.isDirectory()
          ? { type: "dir", path: f.replace(dir + "/", "") }
          : { type: "file", path: f.replace(dir + "/", "") };
      })
  );


  return { fileLength, files: fileDetails };
}

exports.findAll = (req, res) => {
  getFiles(
    req.params[0]
      ? path.join(process.env.BUCKET_PATH, req.params[0])
      : process.env.BUCKET_PATH
  )
    .then(({ fileLength, files }) => {
      if (files) {
        res.send({ fileLength, files });
      } else {
        res.send({ fileLength: 0, files: [] });
      }
    })
    .catch((err) => {
      console.log(
        "There was an error getting bucket files",
        JSON.stringify(err)
      );
      res.sendStatus(500);
    });
};