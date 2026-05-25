import cartModel from "../models/cart.js";
import pizzasModel from "../models/pizzas.js";

const cartCotroller = {};

//Select
cartCotroller.getAllCarts = async (req, res) => {
  try {
    const carts = await cartModel
      .find()
      .populate("customerId", "name email")
      .populate("products.productId", "name price");
      
    return res.status(200).json(carts);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Insert
cartCotroller.insertCart = async (req, res) => {
  try {
    //#1 solicito los datos
    const { customerId, products, status } = req.body;

    //Variable para guardar el total
    let total = 0;

    //Arreglo de productos
    let newProducts = [];

    //De todos los productos que me envie el frontend los voy a recorrer uno por uno para calcularles el subtotal y el total
    for (let i = 0; i < products.length; i++) {
      //Buscar el producto en la base de datos
      const pizzaFound = await pizzasModel.findById(products[i].productId);

      //console.log(pizzaFound.price)
      //Calcular el subtotal
      const subtotal = pizzaFound.price * products[i].quantity;

      //calcular el total
      total += subtotal;

      //Guardamos el producto junto con la cantidad y el subtotal
      newProducts.push({
        productId: products[i].productId,
        quantity: products[i].quantity,
        subtotal,
      });
    }

    //Llnemaos el modelo
    const newCart = new cartModel({
      customerId,
      products: newProducts,
      total,
      status,
    });

    await newCart.save();

    return res.status(200).json({ message: "Cart created" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
//Update
cartCotroller.updateCart = async (req, res) => {
  try {
    //#1 solicitamos los nuevos datos
    const { customerId, products, status } = req.body;

    let total = 0;

    let newProducts = [];

    //Recorrer todos los productos
    for (let i = 0; i < products.length; i++) {
      //Buscar el producto
      const pizzaFound = await pizzasModel.findById(products[i].productId);

      const subtotal = pizzaFound.price * products[i].quantity;

      //Sumar total
      total += subtotal;

      //Guardamos el producto junto con su subtotal
      newProducts.push({
        productId: products[i].productId,
        quantity: products[i].quantity,
        subtotal: subtotal,
      });
    }

    //Actualizamos el carrito en la base de datos
    const updatedCart = await cartModel.findByIdAndUpdate(
      req.params.id,
      {
        customerId,
        products: newProducts,
        total,
        status,
      },
      {
        new: true,
      },
    );

    return res.status(200).json({ meesage: "Cart updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Delete
cartCotroller.deleteCart = async (req, res) => {
  try {
    await cartModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "cart deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default cartCotroller