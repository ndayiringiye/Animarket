import mongoose, { Schema } from "mongoose";

const agreementSchema =  mongoose,Schema({
    name:{
        type: String,
        required: true,
        length: 30
    },
    user:{
        type: String,
        reqiured : true,
        id: Object
    }
    
})

export default agreementSchema;