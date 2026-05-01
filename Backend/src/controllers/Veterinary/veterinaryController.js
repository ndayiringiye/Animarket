import * as veterinaryService from "../../services/Veterinary/veterinaryService.js";

export const createServiceJob = async (req, res) => {
  return await veterinaryService.createVeterinaryServiceJob(req, res);
};

export const listServiceJobs = async (req, res) => {
  return await veterinaryService.getAllServiceJobs(req, res);
};

export const acceptServiceJob = async (req, res) => {
  return await veterinaryService.acceptVeterinaryJob(req, res);
};

export const completeServiceJob = async (req, res) => {
  return await veterinaryService.completeVeterinaryJob(req, res);
};

export const createAgreement = async (req, res) => {
  return await veterinaryService.createVeterinaryAgreement(req, res);
};

export const signVeterinaryAgreement = async (req, res) => {
  return await veterinaryService.signAgreement(req, res);
};

export const recordPayment = async (req, res) => {
  return await veterinaryService.recordPayment(req, res);
};

export const recordVaccination = async (req, res) => {
  return await veterinaryService.recordVaccination(req, res);
};

export const generateServiceQRCode = async (req, res) => {
  return await veterinaryService.generateQRCode(req, res);
};

export const scanServiceQRCode = async (req, res) => {
  return await veterinaryService.scanQRCode(req, res);
};

export const getServiceHistory = async (req, res) => {
  return await veterinaryService.getVeterinarianServiceHistory(req, res);
};
