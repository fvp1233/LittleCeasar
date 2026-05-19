import express from "express"
import pizzasController from "../controllers/pizzaController.js"

//Router nos ayuda a colocar los metodos que tendra el endpoint

const router = express.Router()

//Los separo porque el actualizar y el eliminar necesita el id
router.route("/").get(pizzasController.getPizzas).post(pizzasController.insertPizza)


router.route("/low-stock").get(pizzasController.getLowStock)

router.route("/price-range").post(pizzasController.getPizzasByPriceRange)

router.route("/count").get(pizzasController.countPizzas)

router.route("/search-name").post(pizzasController.searchByName)

//El que lleve id siempre es el ultimo en las rutas
router.route("/:id").put(pizzasController.updatePizzas).delete(pizzasController.deletePizzas).get(pizzasController.getPizzaById)



export default router