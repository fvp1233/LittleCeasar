import express from "express"
import employeesController from "../controllers/employeesController.js"

//Router nos ayuda a colocar los metodos que tendra el endpoint
const router = express.Router();

//Los separo porque el actualizar y el eliminar necesita el id
router.route("/").get(employeesController.getEmployees).post(employeesController.insertEmployee)

router.route("/:id").put(employeesController.updateEmployee).delete(employeesController.deleteEmployee)

export default router;