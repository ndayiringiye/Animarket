import Animal from "../../models/animals/AnimalModel.js";
import { animalIsVerified } from "../../validators/Animal/animalvalidator.js";

// ─── CREATE ───────────────────────────────────────────────────────────────────
export const createAnimal = async (req, res) => {
  const {
    name, type, gender, age, owner, price, currency,
    health, location, weight, breed, previousOwners,
    images, videos,
    previousOwnerName, previousOwnerPhone, previousOwnerAgreementPhoto,
    previousOwnerIdType, previousOwnerIdNumber, previousOwnerIdPhoto,
    previousOwnerGender, previousOwnerAge,
  } = req.body;

  if (!name || !type || !gender || !age || !owner || !price || !currency || !location || !health || !weight) {
    return res.status(400).json({
      status: 400,
      error: "All required animal details must be provided.",
    });
  }

  try {
    const { error } = animalIsVerified.validate(req.body);
    if (error) {
      return res.status(400).json({ status: 400, error: error.details[0].message });
    }

    const animal = await Animal.create({
      name, type, gender, age, owner, price,
      currency: currency || "RWF",
      health, location, weight, breed,
      previousOwners: previousOwners || [],
      images: images || [],
      videos: videos || [],
      previousOwnerName, previousOwnerPhone, previousOwnerAgreementPhoto,
      previousOwnerIdType, previousOwnerIdNumber, previousOwnerIdPhoto,
      previousOwnerGender, previousOwnerAge,
    });

    return res.status(201).json({
      status: 201,
      message: "Animal created successfully.",
      data: animal,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Animal creation failed.",
      error: err.message,
    });
  }
};

// ─── READ ALL ─────────────────────────────────────────────────────────────────
export const getAllAnimals = async (req, res) => {
  try {
    const { type, gender, health, minPrice, maxPrice, location, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (type)     filter.type     = type;
    if (gender)   filter.gender   = gender;
    if (health)   filter.health   = health;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Animal.countDocuments(filter);
    const animals = await Animal.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      message: "Animals fetched successfully.",
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: animals,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch animals.",
      error: err.message,
    });
  }
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────
export const getAnimalById = async (req, res) => {
  const { id } = req.params;

  try {
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({ status: 404, error: "Animal not found." });
    }

    return res.status(200).json({
      status: 200,
      message: "Animal fetched successfully.",
      data: animal,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch animal.",
      error: err.message,
    });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export const updateAnimal = async (req, res) => {
  const { id } = req.params;

  // Strip out fields that should never be mass-updated
  const { _id, __v, createdAt, ...updates } = req.body;

  try {
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({ status: 404, error: "Animal not found." });
    }

    const updated = await Animal.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      status: 200,
      message: "Animal updated successfully.",
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Failed to update animal.",
      error: err.message,
    });
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
export const deleteAnimal = async (req, res) => {
  const { id } = req.params;

  try {
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({ status: 404, error: "Animal not found." });
    }

    await Animal.findByIdAndDelete(id);

    return res.status(200).json({
      status: 200,
      message: "Animal deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Failed to delete animal.",
      error: err.message,
    });
  }
};