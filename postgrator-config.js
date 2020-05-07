require("dotenv").config();

module.exports = {
  migrationsDirectory: "migrations",
  driver: "pg",
  connectionString: NODE_ENV === 'test'
    ? process.env.TEST_DB_URL
    : process.env.DB_URL
  };
