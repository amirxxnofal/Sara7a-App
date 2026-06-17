import express from "express";
import { env } from "../config/env.service.js";
import { DatabaseConnection } from "./database/connection.js";
import { GlobalErrorHandler } from "./common/utils/Error/error.handler.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/users/users.controller.js";
export const bootstrap = async () => {
    const app = express();
    app.use(express.json());

    await DatabaseConnection();

    app.get("/check-health", (req, res) => {
        res.json({ message: "Server is healthy..." });
    });

    app.use("/auth", authRouter);
    app.use("/users", userRouter);

    app.use("{*dummy}", (req, res) => {
        res.status(404).json({ message: "url not found" });
    });

    app.use(GlobalErrorHandler);

    app.listen(env.port, () => {
        console.log("Server is running...");
    });
};
