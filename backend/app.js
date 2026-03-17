import express from "express"
import pizzaRoutes from "./src/routes/pizza.js"

//Creo la constante para utilizar la libreria de express en todos lados
const app = express();

//Para que la API acepte json
app.use(express.json());

app.use("/api/pizzas", pizzaRoutes);

export default app;