import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth";
import { UserController } from "../controllers/user";

export const userRouter = Router();

userRouter.get(
  "/profile",
  AuthMiddleware.isUserVerified,
  UserController.getUserProfile
);
