import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { config } from "../../config.js";
import customerModel from "../models/customers.js";
import HTMLRecoveryEmail from "../utils/sendMailRecovery.js";

const recoveryPasswordController = {};

recoveryPasswordController.requestCode = async (req, res) => {
  try {
    //#1 solicitamos los datos
    const { email } = req.body;

    //Validar que el correo si exista en la base
    const userFound = await customerModel.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    //Generamos un codigo aleatorio
    const randomCode = crypto.randomBytes(3).toString("hex");

    //Guardamos todo en un token
    const token = jsonwebtoken.sign(
      //#1 ¿Que vamos a guardar?
      { email, randomCode, userType: "customer", verified: false },

      //#2 Secret key
      config.JWT.secret,

      //#3 ¿Cuando expira?
      { expiresIn: "15m" },
    );

    res.cookie("recoveryCookie", token, { maxAge: 15 * 60 * 1000 });

    //Enviar el codigo por correo electronico

    //#1 ¿Quien lo envia?
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.password_email,
      },
    });

    //#2 ¿Quien lo recibe y como lo recibe?
    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Recuperación de contraseña",
      body: "El código vence en 15 minutos",
      html: HTMLRecoveryEmail(randomCode),
    };

    //#3 Enviar correo electronico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Error sending mail" });
      }
      return res.status(200).json({ message: "email sent" });
    });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

recoveryPasswordController.verifyCode = async (req, res) => {
  try {
    //#1 Solicitamos los datos
    const { code } = req.body;

    //Obtenemos la informacion que esta dentro del token
    //Accedemos a la cookie
    const token = req.cookies.recoveryCookie;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    //Comparar el codigo que el usuario escribio
    //Con el que esta guardado en el token
    if (code !== decoded.randomCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    //Si escribe bien el codigo vamos a colocar en el token que ya esta verificado
    const newToken = jsonwebtoken.sign(
      //#1 ¿Que vamos a guardar?
      { email, decoded: email, userType: "customer", verified: true },

      //#2 Secret key
      config.JWT.secret,

      //#3¿Cuando expira?
      { expiresIn: "15m" },
    );

    res.cookie("recoveryCookie", newToken, { maxAge: 15 * 60 * 1000 });

    return res.status(200).json({ message: "Code verified successfully" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

recoveryPasswordController.newPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Password doesnt match" });
    }

    const token = req.cookies.recoveryCookie;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.status(400).json({ message: "Code not verified" });
    }

    //Encriptar la contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10)

    //Actualizar la contraseña en la base de datos
    await customerModel.findByIdAndUpdate(
        {email: decoded.email},
        {password: passwordHash},
        {new: true}
    )

    res.clearCookie("recoveryCookie")
    return res.status(200).json({message: "Password updated"})

  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "Internal server error"})
  }
};                                          
 
export default recoveryPasswordController;