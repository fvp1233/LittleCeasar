import nodemailer from "nodemailer"; //Enviar correos
import crypto from "crypto"; //Generar codigos aleatorios
import jsonwebtoken from "jsonwebtoken"; //token
import bcryptjs from "bcryptjs"; //Encriptador
import employeeModel from "../models/employees.js";
import { config } from "../../config.js";
import { register } from "module";

//Array de funciones
const registerEmployeeController = {};

registerEmployeeController.register = async (req, res) => {
  try {
    //#1 solicitar los datos a guardar
    const {
      name,
      lastName,
      DUI,
      birthdate,
      email,
      password,
      isVerified,
      status,
      idBranches,
    } = req.body;

    //#2 validar si el correo existe en la base de datos
    const existEmployee = await employeeModel.findOne({ email });
    if (existEmployee) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    //Encriptar la contraseña
    const passwordHashed = await bcryptjs.hash(password, 10);
    //Generar un codigo aleatorio
    const randomCode = crypto.randomBytes(3).toString("hex");

    //Guardamos todo en un token
    const token = jsonwebtoken.sign(
      //#1 ¿que vamos a guardar?
      {
        randomCode,
        name,
        lastName,
        DUI,
        birthdate,
        email,
        password: passwordHashed,
        isVerified,
        status,
        idBranches,
      },
      //#2 secret key
      config.JWT.secret,
      //#cuando expira
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

//Verificar el codigo que acabamos de enviar
registerEmployeeController.verifyCode = async (req, res) => {
  try {
    //Solicitamos el código que el usuario escribio en el frontEnd
    const { verificationCodeRequest } = req.body;

    //Obtener el token de las cookies
    const token = req.cookies.registrationCookie;

    //Extraer los datos del token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const {
      randomCode: storedCode,
      name,
      lastName,
      DUI,
      birthdate,
      email,
      password,
      isVerified,
      status,
      idBranches,
    } = decoded;

    if (verificationCodeRequest !== storedCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    //Si todo esta bien, registramos
    const newEmployee = employeeModel({
      name,
      lastName,
      DUI,
      birthdate,
      email,
      password,
      isVerified: true,
      status: "activo",
      idBranches,
    });
    await newEmployee.save();

    res.clearCookie("registrationCookie");
    return res.status(200).json({ message: "Customer registered" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export default registerEmployeeController;
