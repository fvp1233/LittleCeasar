import bcrypt from "bcryptjs";
import jsonwebToken from "jsonwebtoken"
import { config } from "../../config.js";
import adminModel from "../models/admins.js"

//Array de funciones
const loginAdminsController = {};

loginAdminsController.login = async(req, res) =>{
    try {
        //#1 Solicitar los datos
        const {email,password} = req.body;
        //Verificar si el correo existe en la base de datos
        const adminFound = await adminModel.findOne({email})
        //Si no existe el correo
        if(!adminFound){
            return res.status(400).json({message: "Admin not found"})
        }

        //Verificamos que la cuenta no este bloqueada
        if(adminFound.timeOut && adminFound.timeOut > Date.now()){
            return res.status(403).json({message: "Blocked account"})
        }

        //Validar la contraseña
        const isMatch = await bcrypt.compare(password, adminFound.password)

        //Si la contraseña es incorrecta
        if(!isMatch){
            //Sumar 1 a la cantidad de intentos fallidos
            adminFound.loginAttemps = (adminFound.loginAttemps|| 0) + 1 
            if(adminFound.loginAttemps >= 5) {
                adminFound.timeOut = Date.now() + 5 * 60 * 1000;
                adminFound.loginAttemps = 0;

                await adminFound.save();
                return res.status(403).json({message: "Blocked account for many attemps"});
            }
            await adminFound.save();
            return res.status(400).json({message: "Wrong password"})
        }

        //Reseteamos intentos si login es correcto
        adminFound.loginAttemps = 0;
        adminFound.timeOut = null;

        //Generar el token
        const token = jsonwebToken.sign(
            //¿Qué vamos a guardar
            {id: adminFound._id, userType: "admin"},
            //LLave secreta
           config.JWT.secret,
           //Cuando expira
           {expiresIn: "30d"}

        )

        //El token lo guardamos en una cookie
        res.cookie("AuthCookie", token);

        return res.status(200).json({message: "Login successfully"})
        
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
};
export default loginAdminsController;