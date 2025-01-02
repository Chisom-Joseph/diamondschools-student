module.exports = {
  DB: process.env.DB,
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  dialect: process.env.DB_DIALECT,
  poll: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
