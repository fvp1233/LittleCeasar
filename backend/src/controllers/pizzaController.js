//Aqui en el controlador vamos a definir las funciones que ejecutaran los metodos get, post, put y delete

//#1 creo un array de metodos
const pizzasController = {};

//Importo el esquema que cree en el modelo
import pizzasModel from "../models/pizzas.js";

//SELECT 
pizzasController.getPizzas = async (req, res) => {
    const pizzas = await pizzasModel.find();
    res.json(pizzas)
};

//INSERT 
pizzasController.insertPizza = async (req, res) =>{
    //#1 solicitar los datos que se van a guardar
    const {name, description, price, stock} = req.body;
    //#2 guardo en el modelo
    const newPizza = new pizzasModel({name, description, price, stock})
    //#3 guardamos
    await newPizza.save();

    res.json({message: "product saved"});
};

//ELIMINAR 
pizzasController.deletePizzas = async (req, res) =>{
    await pizzasModel.findByIdAndDelete(req.params.id)
    res.json({message: "pizza deleted"});
};

//EDITAR
pizzasController.updatePizzas = async (req, res) =>{
    //#1 Pedir los nuevos valores
    const {name, description, price, stock} = req.body;
    //#2 Actualizo los daots
    await pizzasModel.findByIdAndUpdate(req.params.id, {name, description, price, stock},
        {new: true}
    );
    res.json({message: "pizza updated"})
};  

export default pizzasController;
