import jwt from "jsonwebtoken";

export const protectRolePostAnimal = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        const role = req.user?.role;
        if (!role) {
            return res.status(401).json({ message: "Role missing from token" });
        }

        if (role === "seller" || role === "farmer") {
            return next(); 
        }

        return res.status(403).json({ message: "Access denied. Sellers and farmers only." });

    } catch (error) {
        return res.status(500).json({ error: error.message, message: "Authentication failed" });
    }
};