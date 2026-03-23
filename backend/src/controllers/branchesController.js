//#1 Creo un array de funciones vacio
const branchesController = {};

//#2 importo el Schema de la coleccion que voy a ocupar
import branchesModel from "../models/branches.js";

//Select
branchesController.getBranches = async(req, res) => {
    const branches = await branchesModel.find();
    res.json(branches);
};

//Insert
branchesController.insertBranches = async(req, res) => {
    //#1 solicitar los datos que se van a guardar
    const {name,address, schedule,isActive} = req.body;
    //#2 guardo en el modelo
    const newBranch = new branchesModel({name,address, schedule,isActive})
    //#3 guardamos
    await newBranch.save();
    res.json({message: "branch saved"})
};

//Delete
branchesController.deleteBranch = async(req, res) =>{
    await branchesModel.findByIdAndDelete(req.params.id)
    res.json({message: "branch deleted"})
};

//Update
branchesController.updateBranch = async(req, res) =>{
    //#1 pedir los nuevos valores
    const {name,address, schedule,isActive} = req.body;
    //#2 actualizado los datos
    await branchesModel.findByIdAndUpdate(req.params.id, {name,address, schedule,isActive},
        {new: true}
    );
    res.json({message: "branch updated"})
};
export default branchesController;
