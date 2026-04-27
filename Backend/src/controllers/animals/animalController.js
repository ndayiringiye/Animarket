import { AnimalService } from "../../services/animals/AnimalsService.js";
import Animal from "../../models/animals/AnimalModel.js";

const animalRegitering = async (req , res) =>{
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

export default  animalRegitering;