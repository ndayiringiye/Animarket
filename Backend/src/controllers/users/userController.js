import * as userServices from '../../services/user/userServices.js';

export const registerUser = async (req, res) => {
    return await userServices.registeringUser(req, res);
};

export const loginUser = async (req, res) => {
    return await userServices.LoginUser(req, res);
};

export const getAllUsers = async (req, res) => {
    return await userServices.getAlluser(req, res);
};

export const getUserById = async (req, res) => {
    return await userServices.getoneUser(req, res);
};

export const deleteUser = async (req, res) => {
    return await userServices.deleteUser(req, res);
};

export const updateUserRole = async (req, res) => {
    return await userServices.updateRole(req, res);
};

export const resetPassword = async (req, res) => {
    return await userServices.resetPassword(req, res);
};

export const forgotPassword = async (req, res) => {
    return await userServices.forgotPassword(req, res);
};

export const verifyResetOTP = async (req, res) => {
    return await userServices.verifyResetOTP(req, res);
};

export const confirmResetPassword = async (req, res) => {
    return await userServices.confirmResetPassword(req, res);
};

export const getMe = async (req, res) => {
    try {
        // `verifyToken` middleware attaches `req.user`
        if (!req.user) return res.status(404).json({ message: 'User not found', status: 404 });
        return res.status(200).json({ message: 'User fetched', status: 200, data: req.user });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch user', error: error.message, status: 500 });
    }
};
