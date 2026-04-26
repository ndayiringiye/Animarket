import Animal from "../../models/animals/AnimalModel.js";
import { protectRolePostAnimal } from "../../Middlewares/user/protect Role.js";
import { animalIsVerified } from "../../validoators/Animal/animalvalidator.js";

export const AnimalService = async (req, res) => {
    const { name, type, gender, age, owner, price, currence, health, location, weight, previoudsOwners } = req.body;
    const { id } = req.params;
    if (!Animal.id) {
        return res.json({
            error: "id is missing ",
            status: 404
        })
    }
    if (!name || !type || !gender || !age || !owner || price || currence || location || !health || weight || !previoudsOwners) {
        return res.json({
            error: "All animal details are required",
            status: 404
        });
    };
    try {
        const result = await animalIsVerified.validate(req.body);
        if (result.error) {
            return res.json({
                message: result.error.details[0].message,
                status: 404
            })
        }
        const animal = await animal.create({ id, protectRolePostAnimal });
        const saveAnimal = await animal.save();
        return res.json({
            message: "animal created successfully",
            status: 500,
            data: saveAnimal,

        });
    } catch (error) {
        return res.json({
            message: "animal creation failed",
            error: error.message,
            status: 500
        })
    }

}