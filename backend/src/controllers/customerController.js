//#1 Creo un array de funciones vacio
const customerController = {};

import customerModel from "../models/customers.js";

//Get
customerController.getCustomers = async (req, res) => {
  try {
    const customers = await customerModel.find();
    return res.status(200).json(customers);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Update
customerController.updateCustomer = async (req, res) => {
  try {
    //#1 Solicitamos los datos a guardar
    let {
      name,
      lastName,
      email,
      password,
      birthdate,
      isVerified,
      loginAttemps,
      timeOut,
    } = req.body;

    //Validaciones
    name = name?.trim();
    email = email?.trim();
    lastName = lastName?.trim();

    if (!name || !email || !password) {
      return res.json(400).json({ message: "Fields required" });
    }

    //Longitud de caracteres
    if (name.length < 3 || name.length > 15) {
      return res.json(400).json({ message: "Please insert a valid name" });
    }

    //Actualizamos en la base de datos
    const customerUpdated = await customerModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        lastName,
        email,
        password,
        isVerified,
      },
      {
        new: true,
      },
    );

    if (!customerUpdated) {
      return res.status(400).json({ message: "Customer not found" });
    }

    return res.status(200).json({ message: "Customer updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Eliminar
customerController.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = customerModel.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    return res.status(400).json({ message: "Customer deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export default customerController;
