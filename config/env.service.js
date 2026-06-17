import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

export const env = {
    port: process.env.PORT,
    mongooseUrl: process.env.MONGOOSE_URL,
    secretKey: process.env.SECRET_KEY,
    saltRounds: Number(process.env.SALT_ROUNDS),
    mood: process.env.MOOD,

    userSignature: process.env.USER_SIGNATURE,
    adminSignature: process.env.ADMIN_SIGNATURE,

    userRefreshTokenSignature: process.env.USER_REFRESH_TOKEN,
    adminRefreshTokenSignature: process.env.ADMIN_REFRESH_TOKEN,
};
