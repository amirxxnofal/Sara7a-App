export const SuccessResponse = ({
    res,
    status = 200,
    message = "Success",
    data,
    token,
} = {}) => {
    const response = {
        success: true,
        message,
        ...(data !== undefined && { data }),
        ...(token !== undefined && { token }),
    };

    return res.status(status).json(response);
};
