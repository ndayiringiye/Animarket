import joi from "express-validator"
import Animal from "../../models/animals/AnimalModel"

export const animalIsVerified =  joi.Object({
    name: joi.string().capitalize().length(6).required(),
    type: joi.string().required().special().message({
        "Animal.type":"animals inclusion cow, goat, pig, sheep, cheken should be atleas one of them"
    }),
    gender: joi.string().required().special().message({
        "Animal.gender":"animals gender should be male or female"
    }), 

   owner : joi.string().required().message({
    "Animal":"proper owner is required"
   }),

   price : joi.number().required().message({
    "Animal.price":"animals price should be more than 0"
   }),

   location: joi.string().required().message({
    "Animal.location":"animals location is required"
   }),
   
   image: joi.string().image().required().message({
    "Animal.image":"animals image is required"
   }),
   age: joi.number().required().message({
    "Animal.age":"animals age is required"
   }),
   previousOwners:  joi.string().required().message({
    "Animal.previousOwners":"animals previousOwners is required"
   }),
   health: joi.string().required().message({
    "Animal.health":"animals health is required"
   }),
   weight: joi.number().required().message({
    "Animal.weight":"animals weight is required"
   }),
   isAvailable: joi.boolean().required().message({
    "Animal.isAvailable":"animals isAvailable is required"
   }),
   isVerified: joi.boolean().required().message({
    "Animal.isVerified":"animals isVerified is required"
   }),
   verificationLevel: joi.string().required().message({
    "Animal.verificationLevel":"animals verificationLevel is required"
   }),
   marketDemandScore: joi.number().required().message({
    "Animal.marketDemandScore":"animals marketDemandScore is required"
   }),
   popularityScore: joi.number().required().message({
    "Animal.popularityScore":"animals popularityScore is required"
   }),
   createdAt: joi.date().required().message({
    "Animal.createdAt":"animals createdAt is required"
   }),
   updatedAt: joi.date().required().message({
    "Animal.updatedAt":"animals updatedAt is required"
   }),

videos: joi.array().items(joi.string().required()).optional().message({
    "Animal.videos":"animals videos should be an array of strings"
}),

images: joi.array().items(joi.string().required()).optional().message({
    "Animal.images":"animals images should be an array of strings"
}),

})