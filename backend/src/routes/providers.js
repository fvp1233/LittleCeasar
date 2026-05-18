import express from "express"
import providerController from "../controllers/providersController.js"
import upload from "../utils/cloudinaryConfig.js"

const router = express.Router();

//Si necesito subir mas de 1 imagen debo poner upload.array

router.route("/").get(providerController.getAllProviders).post(upload.single("image"), providerController.insertProviders)
router.route("/:id").put(upload.single("image"), providerController.updateProvider).delete(providerController.deleteProvider)

export default router