import {
  createAnimal,
  getAllAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
  deleteAnimalMedia
} from "../../services/animals/AnimalsService.js";

export const animalRegistering = async (req, res) => {
  try {
    const animal = await createAnimal(req);

    return res.status(201).json({
      status: 201,
      message: "Animal registered successfully",
      data: animal
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Animal registration failed",
      error: error.message
    });
  }
};

export const getAnimals = async (req, res) => {
  try {
    const result = await getAllAnimals(req.query);

    return res.status(200).json({
      status: 200,
      message: "Animals fetched successfully",
      ...result 
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Fetching animals failed",
      error: error.message
    });
  }
};

export const getSingleAnimal = async (req, res) => {
  const { id } = req.params;

  try {
    const animal = await getAnimalById(id);

    if (!animal) {
      return res.status(404).json({
        status: 404,
        message: "Animal not found"
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Animal fetched successfully",
      data: animal
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Fetching animal failed",
      error: error.message
    });
  }
};

export const updateAnimalController = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedAnimal = await updateAnimal(id, req);

    if (!updatedAnimal) {
      return res.status(404).json({
        status: 404,
        message: "Animal not found"
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Animal updated successfully",
      data: updatedAnimal
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Updating animal failed",
      error: error.message
    });
  }
};

export const deleteAnimalController = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteAnimal(id);

    if (!deleted) {
      return res.status(404).json({
        status: 404,
        message: "Animal not found"
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Animal deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Deleting animal failed",
      error: error.message
    });
  }
};

export const deleteAnimalMediaController = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteAnimalMedia(req, res);

    // The service function handles the response directly
    return result;

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Deleting animal media failed",
      error: error.message
    });
  }
};

export const rateAnimalController = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();
    const hotelId = req.user?._id || req.user?.id;
    if (!hotelId || req.user?.role !== "hotel") return res.status(403).json({ message: "Only hotels can rate animals" });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be between 1 and 5" });

    const animal = await (await import("../../models/animals/AnimalModel.js")).default.findById(id);
    if (!animal) return res.status(404).json({ message: "Animal not found" });
    const existing = animal.ratings.find((entry) => entry.hotel.toString() === hotelId.toString());
    if (existing) { existing.rating = rating; existing.comment = comment; existing.createdAt = new Date(); }
    else animal.ratings.push({ hotel: hotelId, rating, comment });
    await animal.save();
    return res.status(200).json({ success: true, message: "Animal rating saved", data: animal.ratings.find((entry) => entry.hotel.toString() === hotelId.toString()) });
  } catch (error) {
    return res.status(500).json({ message: "Animal rating failed", error: error.message });
  }
};