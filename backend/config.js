//Instalar en la terminal npm i dotenv
import dotenv from "dotenv"

//Ejecutamos la libreria dotenv
dotenv.config();

export const config = {
    JWT: {
        secret: process.env.JWT_Secret_key
    }
}