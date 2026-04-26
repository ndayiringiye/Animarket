import joi from "express-validator"
import Animal from "../../models/animals/AnimalModel"

export const animalIsVerified =  joi.Object({
    name: joi.string().capitalize().length(6).required(),
    type: joi.string().required().special().message({
        "Animal.type":"animals inclusion cow, goat, pig, sheep, cheken should be atleas one of them"
    })
})