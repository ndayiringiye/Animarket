import * as veterinaryJobService from "../../services/Veterinary/veterinaryJobService.js";
import * as veterinaryProfileService from "../../services/Veterinary/veterinaryProfileService.js";

// ===== JOB POSTING CONTROLLERS =====

export const createJobPosting = async (req, res) => {
  return await veterinaryJobService.createJobPosting(req, res);
};

export const getAllJobPostings = async (req, res) => {
  return await veterinaryJobService.getAllJobPostings(req, res);
};

export const getJobPosting = async (req, res) => {
  return await veterinaryJobService.getJobPosting(req, res);
};

export const updateJobPosting = async (req, res) => {
  return await veterinaryJobService.updateJobPosting(req, res);
};

// ===== APPLICATION CONTROLLERS =====

export const submitApplication = async (req, res) => {
  return await veterinaryJobService.submitApplication(req, res);
};

export const getJobApplications = async (req, res) => {
  return await veterinaryJobService.getJobApplications(req, res);
};

export const evaluateApplication = async (req, res) => {
  return await veterinaryJobService.evaluateApplication(req, res);
};

export const acceptSelectedVeterinarian = async (req, res) => {
  return await veterinaryJobService.acceptSelectedVeterinarian(req, res);
};

// ===== VETERINARIAN PROFILE CONTROLLERS =====

export const createVeterinarianProfile = async (req, res) => {
  return await veterinaryProfileService.createVeterinarianProfile(req, res);
};

export const getVeterinarianProfile = async (req, res) => {
  return await veterinaryProfileService.getVeterinarianProfile(req, res);
};

export const updateVeterinarianProfile = async (req, res) => {
  return await veterinaryProfileService.updateVeterinarianProfile(req, res);
};

export const getTopVeterinarians = async (req, res) => {
  return await veterinaryProfileService.getTopVeterinarians(req, res);
};

// ===== INNOVATION CONTROLLERS =====

export const createInnovation = async (req, res) => {
  return await veterinaryProfileService.createInnovation(req, res);
};

export const getAllInnovations = async (req, res) => {
  return await veterinaryProfileService.getAllInnovations(req, res);
};

export const getInnovation = async (req, res) => {
  return await veterinaryProfileService.getInnovation(req, res);
};

export const rateInnovation = async (req, res) => {
  return await veterinaryProfileService.rateInnovation(req, res);
};

export const updateInnovation = async (req, res) => {
  return await veterinaryProfileService.updateInnovation(req, res);
};