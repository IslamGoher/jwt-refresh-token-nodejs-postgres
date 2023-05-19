import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Database } from "./database/config/dbConfig";
import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, async () => {
  console.log(`server is running on port ${port}`);
  await Database.init();
});
