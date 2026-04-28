export const isAdmin = (req, res, next) => {
    try {
        // ensure user is already attached from verifyToken middleware
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized. User not authenticated."
            });
        }

        // check role
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Forbidden. Admin access only."
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Server error in admin middleware",
            error: error.message
        });
    }
};