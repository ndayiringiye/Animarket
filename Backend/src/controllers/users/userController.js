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
