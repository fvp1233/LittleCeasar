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
import { config } from "../../config.js";
import { text } from "stream/consumers";

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
        password: passwordHashed,
        isVerified,
        loginAttemps,
        timeOut,
      },
      //#2 Secret key que va en el .env
      config.JWT.secret,
      //#3 ¿Cuándo expira mi token?
      { expiresIn: "15m" },
    );

    //Guardamos el token en una cookie
    res.cookie("registrationCookie", token, { maxAge: 15 * 60 * 1000 });

    //Enviar correo electronico
    //#1 Transporter ¿Quién lo envía?
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.password_email,
      },
    });

    //#2 ¿Quíen lo recibe?
    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Verificación de cuenta",
      text:
        "Para verificar tu cuenta, usa este código" +
        randomCode +
        "expira en 15 minutos",
    };

    //#3 Enviar el correo electronico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Error sending email" });
      }
      return res.status(200).json({ message: "Email sent" });
    });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Verificar el código que acabamos de enviar
registerCustomerController.verifyCode = async (req, res) => {
  try {
    //Solicitamos el código que el usuario escribio en el frontEnd
    const { verificationCodeRequest } = req.body;

    //Obtener el token de las cookies
    const token = req.cookies.registrationCookie;

    //Extrar los datos del token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const {
      randomCode: storedCode,
      name,
      lastName,
      birthdate,
      email,
      password,
      isVerified,
      loginAttemps,
      timeOut,
    } = decoded

    if(verificationCodeRequest !== storedCode){
      return res.status(400).json({message: "Invalid code"})
    }

    //Si todo esta bien, y el usuario lo registramos en la bd
    const newCustomer = customerModel({
      name,
      lastName,
      birthdate,
      email,
      password,
      isVerified: true,
    });
    await newCustomer.save();

    res.clearCookie("registrationCookie")
    return res.status(200).json({message: "Customer registered"})

  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "Internal server error"})
  }
};
export default registerCustomerController