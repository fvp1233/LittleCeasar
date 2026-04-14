//#1 Creo un array de funciones vacio
const adminController = {};

//#2 importo el Schema de la coleccion que voy a ocupar
import adminModel from "../models/admins.js";

//Select
adminController.getAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find();
    return res.status(200).json(admins);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Update
adminController.updateAdmin = async (req, res) => {
  try {
    let { name, lastName, email, password, isVerified } = req.body;

    name = name?.trim();
    lastName = lastName?.trim();
    email = email?.trim();

    if (!name || !email || !password) {
      return res.json(400).json({ message: "Fields required" });
    }

    //Longitud de caracteres
    if (name.length < 3 || name.length > 15) {
      return res.json(400).json({ message: "Please insert a valid name" });
    }

    const adminUpdated = await adminModel.findByIdAndUpdate(req.params.id, {
      name,
      lastName,
      email,
      password,
      isVerified,
    },{
        new: true
    });

     if (!adminUpdated) {
      return res.status(400).json({ message: "Admin not found" });
    }
    return res.status(200).json({ message: "Admin updated" });

  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Eliminar
adminController.deleteAdmin = async(req, res) =>{
    try {
        const deletedAdmin = adminModel.findByIdAndDelete(req.params.id);
        if(!deletedAdmin){
            return res.status(400).json({ message: "Admin not found" });
        }

        return res.status(400).json({ message: "Admin deleted" });
        
    } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });        
    }
};

export default adminController;
