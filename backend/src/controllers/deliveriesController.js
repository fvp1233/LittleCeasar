import deliveriesModel from "../models/deliveries.js";
import { v2 as cloudinary } from "cloudinary";

//Array de funciones
const deliveriesController = {};

//Select
deliveriesController.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await deliveriesModel.find();
    return res.status(200).json(deliveries);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Insert
deliveriesController.insertDeliveries = async (req, res) => {
  try {
    const { name, phone, cars, isActive } = req.body;

    const newDeliveries = new deliveriesModel({
      name,
      phone,
      image: req.file.path,
      public_id: req.file.filename,
      cars,
      isActive,
    });

    //Guardo todo en la base de datos
    await newDeliveries.save();

    return res.status(200).json({ message: "Deliveries saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//eliminar
deliveriesController.deleteDeliveries = async (req, res) => {
  try {
    const deliveriesFound = await deliveriesModel.findById(req.params.id);

    await cloudinary.uploader.destroy(deliveriesFound.public_id);

    const deliveriesDeleted = await deliveriesModel.findByIdAndDelete(
      req.params.id,
    );

    if (!deliveriesDeleted) {
      return res.status(404).json({ message: "Deliveries not found" });
    }
    return res.status(200).json({ message: "Deliveries deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Update
deliveriesController.updateDeliveries = async (req, res) => {
  try {
    const { name, phone, cars, isActive } = req.body;

    const deliveriesFound = await deliveriesModel.findById(req.params.id);

    const updatedData = {
      name,
      phone,
      cars,
      isActive,
    };

    //Si viene una imagen
    if (req.file) {
      await cloudinary.uploader.destroy(deliveriesFound.public_id);

      updatedData.image = req.file.path;
      updatedData.public_id = req.file.filename;
    }

    await deliveriesModel.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    return res.status(200).json({ message: "Deliveries updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export default deliveriesController
