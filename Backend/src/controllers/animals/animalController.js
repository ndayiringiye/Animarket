import { AnimalService } from "../../services/animals/AnimalsService.js";


export const animalRegistering = async (req, res) => {
  try {
    const animal = await AnimalService.createAnimal(req.body);

    return res.status(201).json({
      message: "Animal registered successfully",
      status: 201,
      data: animal
    });

  } catch (error) {
    return res.status(500).json({
      message: "Animal registration failed",
      status: 500,
      error: error.message
    });
  }
};


export const getAnimals = async (req, res) => {
  try {
    const animals = await AnimalService.getAllAnimals(req.query);

    return res.status(200).json({
      message: "Animals fetched successfully",
      status: 200,
      data: animals
    });

  } catch (error) {
    return res.status(500).json({
      message: "Fetching animals failed",
      status: 500,
      error: error.message
    });
  }
};


export const getAnimalById = async (req, res) => {
  const { id } = req.params;

  try {
    const animal = await AnimalService.getAnimalById(id);

    if (!animal) {
      return res.status(404).json({
        message: "Animal not found",
        status: 404
      });
    }

    return res.status(200).json({
      message: "Animal fetched successfully",
      status: 200,
      data: animal
    });

  } catch (error) {
    return res.status(500).json({
      message: "Fetching animal failed",
      status: 500,
      error: error.message
    });
  }
};