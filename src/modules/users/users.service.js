import { isValidObjectId } from "mongoose";
import { userModel } from "../../database/models/user.model.js";

import {
    CompareText,
    HashText,
} from "../../common/middleware/security/encryption.js";

import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    UnAuthorizedException,
} from "../../common/utils/Error/error.handler.js";
import { GenerateToken } from "../../common/middleware/auth/token.js";

//*------------ Get my profile ------------
export const retriveProfile = async (userId) => {
    const isExist = await userModel.findById(userId);
    if (!isExist || isExist.status === "deleted")
        NotFoundException({ message: "user not found" });
    if (isExist.status === "inactive")
        ForbiddenException({ message: "Account is inactive" });

    return isExist;
};

//*------------ Update profile ------------
export const updateProfile = async (data, userId) => {
    let { username, email, password, newPassword, profileLink, phone } = data;

    const userExist = await userModel.findById(userId);
    if (!userExist || userExist.status === "deleted")
        NotFoundException({ message: "user not found" });

    if (email || newPassword) {
        let comparedPassword = await CompareText(password, userExist.password);
        if (!comparedPassword)
            UnAuthorizedException({ message: "Wrong password!" });

        if (newPassword) userExist.password = await HashText(newPassword);

        if (email && email !== userExist.email) {
            const isExist = await userModel.findOne({ email });
            if (isExist) ConflictException({ message: "email already exist" });
            userExist.email = email;
        }
    }

    if (username) userExist.username = username;

    if (phone && phone !== userExist.phone) {
        const phoneExist = await userModel.findOne({ phone });
        if (phoneExist) ConflictException({ message: "phone already exist" });
        userExist.phone = phone;
    }
    if (profileLink) userExist.profileLink = profileLink;

    await userExist.save();
    return userExist;
};

//*------------ Activate profile ------------
export const activeProfile = async (userId, password) => {
    const isExist = await userModel.findById(userId);
    if (!isExist || isExist.status === "deleted")
        NotFoundException({ message: "user not found" });

    let comparedPassword = await CompareText(password, isExist.password);
    if (!comparedPassword)
        UnAuthorizedException({ message: "Wrong password!" });

    if (isExist.status === "active")
        ConflictException({ message: "Account already active" });

    isExist.status = "active";
    await isExist.save();
    return isExist;
};

//*------------ Inactivate profile ------------
export const inactiveProfile = async (userId, password) => {
    const isExist = await userModel.findById(userId);
    if (!isExist || isExist.status === "deleted")
        NotFoundException({ message: "user not found" });

    let comparedPassword = await CompareText(password, isExist.password);
    if (!comparedPassword)
        UnAuthorizedException({ message: "Wrong password!" });

    if (isExist.status === "inactive")
        ConflictException({ message: "Account already inactive" });

    isExist.status = "inactive";
    await isExist.save();
    return isExist;
};

//*------------ Delete profile ------------
export const deleteProfile = async (userId, password) => {
    const isExist = await userModel.findById(userId);
    if (!isExist || isExist.status === "deleted")
        NotFoundException({ message: "user not found" });

    let comparedPassword = await CompareText(password, isExist.password);
    if (!comparedPassword)
        UnAuthorizedException({ message: "Wrong password!" });

    isExist.status = "deleted";
    await isExist.save();
    return isExist;
};
