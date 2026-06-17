import { Router } from "express";
import { SuccessResponse } from "../../common/utils/Responses/success.response.js";
import { getAccessToken, login, register } from "./auth.service.js";
import { Validation } from "../../common/middleware/validation/validation.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

const router = Router();

//*------------ Register ------------
router.post("/register", Validation(registerSchema), async (req, res, next) => {
    try {
        const result = await register(req.body);
        SuccessResponse({
            res,
            message: "Register success",
            data: result,
            status: 201,
        });
    } catch (error) {
        next(error);
    }
});

//*------------ Login ------------
router.post("/login", Validation(loginSchema), async (req, res, next) => {
    try {
        const result = await login(req.body, req.get("host"));
        SuccessResponse({
            res,
            message: "Login success",
            token: result.token,
            status: 200,
        });
    } catch (error) {
        next(error);
    }
});

//*------------ Get Access Token ------------
router.get("/token", async (req, res, next) => {
    try {
        const result = await getAccessToken(
            req.headers.authorization,
            req.get("host"),
        );
        SuccessResponse({
            res,
            message: "Access token",
            token: result,
            status: 201,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
