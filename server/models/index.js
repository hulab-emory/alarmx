"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + '/../config/config.js');
const db = {};

function loadModels(directory) {
  fs.readdirSync(directory, { withFileTypes: true })
    .forEach(entry => {
      const entryPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
          loadModels(entryPath);
      } else if (entry.isFile() && entry.name.endsWith('.js') && entry.name !== basename && !entry.name.endsWith('_relations.js')) {
          console.log(`Loading model: ${directory}/${entry.name}`);
          const modelDefinition = require(entryPath);
          
          if (directory.endsWith("omop")) {
            const model = modelDefinition(sequelize_omop, Sequelize.DataTypes);
            db[model.name] = model;
          } else if (directory.endsWith("vocab")) {
            const model = modelDefinition(sequelize_vocab, Sequelize.DataTypes);
            db[model.name] = model
          } else {
            const model = modelDefinition(sequelize_app, Sequelize.DataTypes);
            db[model.name] = model;
          }
      }
  });
}

function loadRelations(directory) {
  fs.readdirSync(directory)
  .filter(dir => fs.lstatSync(path.join(directory, dir)).isDirectory()) 
  .forEach(dir => {

    const relationsPath = path.join(directory, dir, '_relations.js');
    
    if (fs.existsSync(relationsPath)) {
      const setupRelations = require(relationsPath);
      setupRelations(db); // Call the function to set up associations
    } else {
      console.error(`Relations file not found in ${dir}`);
    }
  });
}

let sequelize_app, sequelize_omop, sequelize_vocab;
if (env === 'development') {
  console.log("Using development environment");
  sequelize_app = new Sequelize(config.development.sqlite_app);
  sequelize_omop = new Sequelize(config.development.sqlite_omop);
  sequelize_vocab = new Sequelize(config.development.sqlite_vocab);
} else if (env === 'test') {
  console.log("Using test environment");
  const configTest = config.test;
  sequelize_app = sequelize_omop = new Sequelize(configTest.storage, configTest);
} else if (env === 'production') {
  console.log("Using production environment"); 
  sequelize_app = new Sequelize(config.production.db_app);
  sequelize_omop = new Sequelize(config.production.db_omop);
  sequelize_vocab = new Sequelize(config.production.db_vocab);
}

loadModels(__dirname);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ------------------------ App relations ------------------------

db.feature.hasMany(db.featureUser);
db.user.hasMany(db.featureUser, { onDelete: "cascade", hooks: true });
db.featureUser.belongsTo(db.user);
db.user.belongsToMany(db.feature, {
  through: db.featureUser,
  sourceKey: "id",
  targetKey: "id",
})
db.feature.belongsToMany(db.user, {
  through: db.featureUser,
  sourceKey: "id",
  targetKey: "id",
})
db.user.hasMany(db.log);
db.log.belongsTo(db.user);

//------------------------ Features relations ------------------------

loadRelations(__dirname);
  
db.sequelize_app = sequelize_app;
db.sequelize_omop = sequelize_omop;
db.sequelize_vocab = sequelize_vocab;
db.Sequelize = Sequelize;

module.exports = db;