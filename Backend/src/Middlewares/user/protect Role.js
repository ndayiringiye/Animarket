import User from "../../models/users/UserModel.js";

export const protectRolePostAnimal = async (req, res, next) => {
    try {
        const token = await req.cookie.token && req.authorization.spilt(" ")[1];
        if (!token) {
            return res.json({
                message: "no token found",
                status: 404,
                data: token
            });
            const role = await req.User.role || req.cookie.role;
            if (!role) {
                return res.json({
                    message: "missing token",
                    status: 404,
                    data: role

                });
            };
            if (token && role === "seller" || token && role === "farmer") {
                return await next();
            }
        }
    } catch (error) {
        return res.json({
            error: error.message,
            status: 404,
            message: "user proction failed"
        })
    }

}