import { Schema, model } from "mongoose";
/*
name
lastName
email
password
isVerified
*/

const adminSchema = new Schema ({
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    isVerified:{
        type: Boolean
    }
},
{
     timestamps: true,
    strict: false
})
export default model("admins", adminSchema);