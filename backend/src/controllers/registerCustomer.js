/*
Para seguir debemos de instalar las librerias:
nodemailer
crypto
jsonwebtoken
bcrptjs
en la terminal en nuestro caso en la carpeta backend
con npm i nodemailer crypto jsonwebtoken bcryptjs

*/

import nodemailer from "nodemailer"; //Enviar correos
import crypto from "crypto"; //Generar codigos aleatorios
import jsonwebtoken from "jsonwebtoken"; //token
import bcryptjs from "bcryptjs"; //Encriptador
import customerModel from "../models/customers.js";
import { config } from "../../config.js"

//array de funciones
const registerCustomerController = {};

registerCustomerController.register = async (req, res) => {
  try {
    //#1 solicitar los datos a guardar
    const {
      name,
      lastName,
      birthdate,
      email,
      password,
      isVerified,
      loginAttemps,
      timeOut,
    } = req.body;

    //#2 Validar si el correo existe en la base de datos
    const existsCustomer = await customerModel.findOne({ email });
    if (existsCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    //Encriptar la contraseña
    const passwordHashed = await bcryptjs.hash(password, 10);

    //Generar un codigo aleatorio
    const randomCode = crypto.randomBytes(3).toString("hex");

    //Guardamos todo en un token
    const token = jsonwebtoken.sign(
      //#1 ¿Qué vamos a guardar?
      {
        randomCode,
        name,
        lastName,
        birthdate,
        email,
        password:passwordHashed,
        isVerified,
        loginAttemps,
        timeOut,
      },
      //#2 Secret key que va en el .env
      config.JWT.secret,
      //#3 ¿Cuándo expira mi token?
      {expiresIn: "15m"}
    );

    //Guardamos el token en una cookie
    res.cookie("registrationCookie", token, {maxAge: 15 * 60 *1000})

  } catch (error) {}
};
