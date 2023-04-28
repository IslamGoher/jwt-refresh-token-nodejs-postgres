import * as dotenv from "dotenv";
dotenv.config()
import express from "express";
import { Database } from "./database/config/dbConfig";
import { authRouter } from "./routes/auth";

const app = express();
const port = process.env.PORT || 3000;

app.use("/api/v1/auth", authRouter);

app.listen(port, async () => {
  console.log(`server is running on port ${port}`);
  await Database.init();
});
