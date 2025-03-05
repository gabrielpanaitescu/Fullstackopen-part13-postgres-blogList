const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("../util/config");
const { Umzug, SequelizeStorage } = require("umzug");

const sequelize = new Sequelize(DATABASE_URL);

const migrationsConfig = {
  migrations: {
    glob: "migrations/*.js",
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    tableName: "migrations",
  }),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationsConfig);
  const migrations = await migrator.up();
  console.log("Migrations are synced", {
    files: migrations.map((migration) => migration.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationsConfig);
  await migrator.down();
  sequelize.close();
};

const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("Connection to DB established successfully");
  } catch (error) {
    console.log(`Error connecting to DB: ${error}`);
    return process.exit(1);
  }

  return null;
};

module.exports = {
  sequelize,
  connectToDb,
  rollbackMigration,
};
