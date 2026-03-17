import express from "express"
import pizzasController from "../controllers/pizzaController.js"

//Router nos ayuda a colocar los metodos que tendra el endpoint

const router = express.Router()

//Los separo porque el actualizar y el eliminar necesita el id
router.route("/").get(pizzasController.getPizzas).post(pizzasController.insertPizza)

router.route("/:id").put(pizzasController.updatePizzas).delete(pizzasController.deletePizzas)

export default router