import jwt from "jsonwebtoken";
import { env } from "../../../../config/env.service.js";
import { UnAuthorizedException } from "../../utils/Error/error.handler.js";

export const Auth = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer "))
        UnAuthorizedException({ message: "Unauthorized" });

    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.decode(token);

        let signature = "";
        switch (decoded.aud[0]) {
            case 0:
                signature = env.userSignature;
                break;
            case 1:
                signature = env.adminSignature;
                break;
        }

        req.user = jwt.verify(token, signature);
        next();
    } catch (err) {
        UnAuthorizedException({ message: err.message });
    }
};
