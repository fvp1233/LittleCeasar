import express from "express";
import pizzasController from "../controllers/pizzaController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

//Router nos ayuda a colocar los metodos que tendra el endpoint

const router = express.Router();

//Los separo porque el actualizar y el eliminar necesita el id
router
  .route("/")
  .get(validateAuthCookie(["customer", "admin"]), pizzasController.getPizzas)
  .post(validateAuthCookie(["admin"]), pizzasController.insertPizza);

router
  .route("/low-stock")
  .get(validateAuthCookie(["customer", "admin"]), pizzasController.getLowStock);

router
  .route("/price-range")
  .post(
    validateAuthCookie(["customer", "admin"]),
    pizzasController.getPizzasByPriceRange,
  );

router
  .route("/count")
  .get(validateAuthCookie(["customer", "admin"]), pizzasController.countPizzas);

router
  .route("/search-name")
  .post(
    validateAuthCookie(["customer", "admin"]),
    pizzasController.searchByName,
  );

//El que lleve id siempre es el ultimo en las rutas
router
  .route("/:id")
  .put(validateAuthCookie(["admin"]), pizzasController.updatePizzas)
  .delete(validateAuthCookie(["admin"]), pizzasController.deletePizzas)
  .get(
    validateAuthCookie(["customer", "admin"]),
    pizzasController.getPizzaById,
  );

export default router;
