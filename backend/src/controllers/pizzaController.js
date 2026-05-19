//Aqui en el controlador vamos a definir las funciones que ejecutaran los metodos get, post, put y delete

//#1 creo un array de metodos
const pizzasController = {};

//Importo el esquema que cree en el modelo
import pizzasModel from "../models/pizzas.js";

//SELECT
pizzasController.getPizzas = async (req, res) => {
  const pizzas = await pizzasModel.find();
  res.json(pizzas);
};

//INSERT
pizzasController.insertPizza = async (req, res) => {
  //#1 solicitar los datos que se van a guardar
  const { name, description, price, stock } = req.body;
  //#2 guardo en el modelo
  const newPizza = new pizzasModel({ name, description, price, stock });
  //#3 guardamos
  await newPizza.save();

  res.json({ message: "product saved" });
};

//ELIMINAR
pizzasController.deletePizzas = async (req, res) => {
  await pizzasModel.findByIdAndDelete(req.params.id);
  res.json({ message: "pizza deleted" });
};

//EDITAR
pizzasController.updatePizzas = async (req, res) => {
  //#1 Pedir los nuevos valores
  const { name, description, price, stock } = req.body;
  //#2 Actualizo los daots
  await pizzasModel.findByIdAndUpdate(
    req.params.id,
    { name, description, price, stock },
    { new: true },
  );
  res.json({ message: "pizza updated" });
};

//Select por id (obtener un solo registro)
pizzasController.getPizzaById = async (req, res) => {
  try {
    const pizza = await pizzasModel.findById(req.params.id);

    if (!pizza) {
      return res.stauts(404).json({ message: "Pizza not found" });
    }
    return res.status(200).json(pizza);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Obtener pizzas con stock bajo
pizzasController.getLowStock = async (req, res) => {
  try {
    const pizzas = await pizzasModel.find({ stock: { $lt: 5 } });

    if (!pizzas) {
      return res
        .status(404)
        .json({ message: "Theres not pizzas with low stock" });
    }
    return res.status(200).json(pizzas);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Select con filtros
pizzasController.getPizzasByPriceRange = async (req, res) => {
  try {
    //#1 solicito los datos
    const { min, max } = req.body;

    const pizzas = await pizzasModel.find({
      price: { $gte: min, $lte: max },
    });

    if (!pizzas) {
      return res
        .status(404)
        .json({ message: "Not pizzas with this price range" });
    }

    return res.stauts(200).json(pizzas);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Contar cuantos elementos hay en una coleccion
pizzasController.countPizzas = async (req, res) => {
  try {
    const count = await pizzasModel.countDocuments();

    return res.status(200).json(count);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Buscar por nombre
pizzasController.searchByName = async (req, res) => {
  try {
    //Solicito los datos
    const { name } = req.body;

    const pizzas = await pizzasModel.find({
      name: { $regex: name, $options: "i" },
    });
    if (!pizzas) {
      return res.status(404).json({ message: "Pizzas not found with this name" });
    }

    return res.status(200).json(pizzas);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//

export default pizzasController;
