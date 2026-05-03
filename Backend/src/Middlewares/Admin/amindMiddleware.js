export const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized. Please login.",
                status: 401
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Forbidden. Admin access only.",
                status: 403
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Server error in admin middleware",
            error: error.message,
            status: 500
        });
    }
};