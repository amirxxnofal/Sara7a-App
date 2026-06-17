import { BadRequestException } from "../../utils/Error/error.handler.js";

export const Validation = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error)
            BadRequestException({
                message: "Validation error",
                extra: error,
            });
        next();
    };
};
