//Instalar en la terminal npm i dotenv
import dotenv from "dotenv"

//Ejecutamos la libreria dotenv
dotenv.config();

export const config = {
    JWT: {
        secret: process.env.JWT_Secret_key
    },
    email:{ 
        user_email: process.env.user_email,
        password_email: process.env.password_email
    },
    cloudinary:{
        cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
    }
}