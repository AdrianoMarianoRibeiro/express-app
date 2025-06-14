import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

export default new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3301"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_DATABASE || "express_app_mysql",
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
  synchronize: false, // IMPORTANTE: desabilitar em produção
  logging: process.env.NODE_ENV === "development",
});
