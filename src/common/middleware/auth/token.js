import jwt from "jsonwebtoken";
import { env } from "../../../../config/env.service.js";
import { UnAuthorizedException } from "../../utils/Error/error.handler.js";

export const GenerateToken = (payload, host, role) => {
    let signature = "";
    let refreshSignature = "";
    switch (role) {
        case 0:
            signature = env.userSignature;
            refreshSignature = env.userRefreshTokenSignature;
            break;
        case 1:
            signature = env.adminSignature;
            refreshSignature = env.adminRefreshTokenSignature;
            break;
    }
    const accessToken = jwt.sign(payload, signature, {
        expiresIn: "30m",
        issuer: host,
        audience: [role],
    });
    const refreshToken = jwt.sign(payload, refreshSignature, {
        expiresIn: "1y",
        issuer: host,
        audience: [role],
    });
    return { accessToken, refreshToken };
};

export const generateAccessToken = (refreshToken, host) => {
    if (!refreshToken || !refreshToken.startsWith("Bearer "))
        UnAuthorizedException({ message: "Unauthorized" });

    const token = refreshToken.split(" ")[1];
    const decoded = jwt.decode(token);
    let signature = "";
    try {
        switch (decoded.aud[0]) {
            case 0:
                signature = env.userSignature;
                break;
            case 1:
                signature = env.adminSignature;
                break;
        }
        jwt.verify(token, signature);
   
        const accessToken = jwt.sign({ _id: decoded._id }, signature, {
            expiresIn: "30m",
            issuer: host,
            audience: [decoded.aud[0]], 
        });

        return accessToken;
    } catch (err) {
        UnAuthorizedException({ message: err.message });
    }
};
