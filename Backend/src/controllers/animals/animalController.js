import { AnimalService } from "../../services/animals/AnimalsService.js";
import Animal from "../../models/animals/AnimalModel.js";
import getAllAnimals from "../../services/animals/AnimalsService.js"
import { getAnimalById } from "../../services/animals/AnimalsService.js";

export const animalRegitering = async (req , res) =>{
    const animal = await Animal.AnimalService(req.body);
    try {
        return res.json({
            message : "animal registared successfully",
            status: 201,
            data:  animal
        })
    } catch (error) {
        res.json({
            message : "animal registeration failed",
            status : 404, 
            error : error.message
        })
    }
}


export const getAnimals = async (req, res )=>{
    const animal =  await  Animal.getAllAnimals(req.body);
    try {
        return res.json({
            message: "All Animal are getted successfully",
            status: 500,
            data: animal
        })
    } catch (error) {
        return res.json({
            message:"getting animal failed",
            status : 404,
            error : error.message
        })
    }
}

export const gettingSingleAnimal = sync (req, res) => {
    const {id} = req.params;
    try {
        const animal =  await  Animal.getAnimalById(id)
         return res.json({
            message: "All Animal are getted successfully",
            status: 500,
            data: animal
        })
    } catch (error) {
         return res.json({
            message:"getting animal failed",
            status : 404,
            error : error.message
        })
    }
}
