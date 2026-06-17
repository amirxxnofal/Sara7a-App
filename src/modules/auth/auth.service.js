import { isValidObjectId } from "mongoose";
import { userModel } from "../../database/models/user.model.js";
import joi from "joi";
import {
    generateAccessToken,
    GenerateToken,
} from "../../common/middleware/auth/token.js";
import {
    CompareText,
    HashText,
} from "../../common/middleware/security/encryption.js";

import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
} from "../../common/utils/Error/error.handler.js";
import { registerSchema } from "./auth.validation.js";

//*------------ Register ------------
export const register = async (data) => {
    let { username, email, password, profileLink, phone } = data;

    const userExist = await userModel.findOne({ email });
    if (userExist) ConflictException({ message: "email already exist" });

    const phoneExist = await userModel.findOne({ phone });
    if (phoneExist) ConflictException({ message: "phone already exist" });

    if (password.length < 8)
        BadRequestException({
            message: "Password must be atleast 8 characater",
        });
    const hashedPassword = await HashText(password);

    return await userModel.create({
        username,
        email,
        password: hashedPassword,
        profileLink,
        phone,
    });
};

//*------------ Login ------------
export const login = async (data, host) => {
    if (!data) return BadRequestException({ message: "Fill all fields." });

    const { email, password } = data;
    if (!email || !password)
        BadRequestException({ message: "Must fill email and password" });

    const userExist = await userModel.findOne({ email });
    if (!userExist || userExist.status === "deleted")
        NotFoundException({ message: "User not found" });

    if (userExist.status === "inactive")
        ForbiddenException({ message: "Account is inactive" });

    const isPassword = await CompareText(password, userExist.password);
    if (!isPassword) BadRequestException({ message: "incorrect password" });

    const token = GenerateToken({ _id: userExist._id }, host, userExist.role);
    return { token };
};

//*------------ Get access token ------------
export const getAccessToken = async (authorization, host) => {
    const token = await generateAccessToken(authorization, host);
    return token;
};
