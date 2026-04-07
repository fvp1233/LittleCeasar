/*
idEmployee
idPizza
rating
comment
*/
import mongoose, { Schema, model } from "mongoose";

const reviewSchema = new Schema ({
    idEmployee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "employees"
    },
    idPizza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pizzas"
    },
    rating:{
        type: Number
    },
    comment: {
        type: String
    }
},{
    timestamps: true.valueOf,
    strict: false
});
export default model ("reviews",reviewSchema)
