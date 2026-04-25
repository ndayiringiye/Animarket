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
