/*
name
lastName
email
password
birthdate
isVerified
loginAttemps
timeOut

*/
import { Schema, model } from "mongoose";

const customersSchema = new Schema({
  name: {
    type: String,
  },
  apellido: {
    type: String,
  },
  birthdate: {
    type: Date,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
  loginAttemps: {
    type: Number,
  },
  timeOut: {
    type: Date,
  },
},{
    timestamps: true,
    strict: false
});
export default model("customers", customersSchema)
