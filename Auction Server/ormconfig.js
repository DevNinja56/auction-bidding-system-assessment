module.exports = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "auction",
  entities: ["dist/**/*.entity.js"],
  synchronize: true
};
