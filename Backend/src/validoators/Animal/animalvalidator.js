import joi from "express-validator"
import Animal from "../../models/animals/AnimalModel"

export const animalIsVerified =  joi.Object({
    name: joi.string().capitalize().length(6).required()
})