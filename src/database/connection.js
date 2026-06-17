import mongoose from "mongoose";
import { env } from "../../config/env.service.js";

export const DatabaseConnection = () => {
    mongoose
        .connect(env.mongooseUrl)
        .then(() => console.log("Database connected..."))
        .catch((err) => console.log(err));
};

