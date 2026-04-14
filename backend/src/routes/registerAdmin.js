import express from "express"
import registerAdminController from "../controllers/registerAdminController.js"

const router = express.Router();

router.route("/").post(registerAdminController.register);
router.route("/verifyAdmin").post(registerAdminController.verifyCode);
//para verificar el codigo es con el endpoint http://localhost:4000/api/registerAdmin/verifyAdmin
export default router;