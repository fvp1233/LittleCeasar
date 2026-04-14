import express from "express"
import registerCustomerController from "../controllers/registerCustomer.js"

const router = express.Router();

router.route("/").post(registerCustomerController.register);
router.route("/verifyCodeEmail").post(registerCustomerController.verifyCode);
//para verificar el codigo es con el endpoint http://localhost:4000/api/registerCustomer/verifyCodeEmail

export default router;