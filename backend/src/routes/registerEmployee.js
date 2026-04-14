import express from "express"
import registerEmployeeController from "../controllers/registerEmployeesController.js"

const router = express.Router();

router.route("/").post(registerEmployeeController.register);
router.route("/verifyEmployee").post(registerEmployeeController.verifyCode);
//para verificar el codigo usamos el endpoint http://localhost:4000/api/registerEmployee/verifyEmployee
export default router;